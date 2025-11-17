<?php

namespace Database\Factories;

use App\Models\Article;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ArticleFactory extends Factory
{
    protected $model = Article::class;

    public function definition(): array
    {
        // Temas relevantes y realistas
        $topics = [
            'inteligencia artificial en la educación',
            'minería de datos aplicada a la salud',
            'ciberseguridad en redes académicas',
            'optimización de modelos predictivos',
            'análisis de big data en investigación científica',
            'automatización de procesos administrativos universitarios',
            'uso del internet de las cosas (IoT) en laboratorios educativos',
        ];

        // Elegir un tema aleatorio
        $topic = $this->faker->randomElement($topics);

        // Generar título de estilo académico
        $title = ucfirst($this->faker->randomElement([
            "Análisis del impacto de $topic",
            "Evaluación de metodologías basadas en $topic",
            "Implementación de modelos experimentales sobre $topic",
            "Diseño de una herramienta orientada a $topic",
            "Estudio comparativo en el contexto de $topic",
        ]));

        // Crear autores coherentes (1-3)
        $authorCount = $this->faker->numberBetween(1, 3);
        $authors = collect(range(1, $authorCount))
            ->map(fn() => $this->faker->name())
            ->implode(', ');

        // Descripción más larga y técnica
        $description = "Este artículo presenta una investigación enfocada en $topic. " .
            "Se describe la metodología empleada, los resultados obtenidos y las implicaciones del estudio " .
            "para el desarrollo de soluciones tecnológicas en entornos académicos.";

        return [
            // Usa un usuario existente o crea uno si no hay
            'user_id' => User::query()->inRandomOrder()->value('id') ?? User::factory()->create()->id,
            'title' => $title,
            'description' => $description,
            'publication_date' => $this->faker->dateTimeBetween('-2 years', 'now'),
            'authors' => $authors,
            'publication_url' => $this->faker->optional(0.6)->url(),
        ];
    }
}
