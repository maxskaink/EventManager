<?php

namespace Database\Factories;

use App\Models\Publication;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PublicationFactory extends Factory
{
    protected $model = Publication::class;

    public function definition(): array
    {
        $types = ['articulo', 'comunicado', 'material'];
        $visibility = ['public', 'private', 'restricted'];
        $type = $this->faker->randomElement($types);

        // Generar contenido según el tipo
        switch ($type) {
            case 'articulo':
                $title = $this->faker->sentence(5, true) . ': Un estudio sobre ' . $this->faker->randomElement([
                        'inteligencia artificial',
                        'energías renovables',
                        'procesamiento del lenguaje natural',
                        'ciencia de datos aplicada a la salud',
                        'educación virtual universitaria'
                    ]);
                $content = $this->faker->paragraph(2) . "\n\n" .
                    'Este artículo presenta los resultados obtenidos tras un proceso de investigación interdisciplinaria. ' .
                    'Los autores discuten los hallazgos, las limitaciones y las posibles aplicaciones futuras.';
                $summary = 'Análisis detallado sobre ' . $this->faker->randomElement([
                        'el impacto de la IA en la educación superior',
                        'la sostenibilidad en proyectos universitarios',
                        'las tendencias tecnológicas en investigación académica'
                    ]);
                break;

            case 'comunicado':
                $title = 'Comunicado oficial: ' . $this->faker->randomElement([
                        'Convocatoria de proyectos semilla',
                        'Cambio en fechas del evento institucional',
                        'Reconocimiento a investigadores destacados',
                        'Nueva política de publicaciones académicas'
                    ]);
                $content = 'El comité organizador informa a la comunidad universitaria que ' .
                    $this->faker->sentence(12) . '. ' .
                    'Se invita a todos los miembros a participar activamente y consultar los detalles en el portal institucional.';
                $summary = 'Anuncio oficial dirigido a los miembros de la universidad.';
                break;

            case 'material':
                $title = 'Material de apoyo: ' . $this->faker->randomElement([
                        'Guía práctica para redactar artículos científicos',
                        'Plantilla para presentaciones académicas',
                        'Manual de estilo para publicaciones institucionales',
                        'Recursos para la gestión de referencias bibliográficas'
                    ]);
                $content = 'Este material fue elaborado por el equipo académico de apoyo con el fin de ofrecer ' .
                    'herramientas útiles para la comunidad universitaria. ' .
                    'Incluye ejemplos, recomendaciones y enlaces de interés.';
                $summary = 'Recurso formativo para fortalecer competencias académicas.';
                break;

            default:
                $title = $this->faker->sentence(6);
                $content = $this->faker->paragraphs(3, true);
                $summary = $this->faker->sentence(12);
        }

        return [
            'author_id' => User::query()->inRandomOrder()->value('id') ?? User::factory()->create()->id,
            'title' => $title,
            'content' => $content,
            'type' => $type,
            'published_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
            'status' => $this->faker->randomElement(['activo', 'inactivo']),
            'last_modified' => now(),
            'image_url' => $this->faker->optional()->imageUrl(800, 600, 'education', true),
            'summary' => $summary,
            'visibility' => $this->faker->randomElement($visibility),
        ];
    }
}
