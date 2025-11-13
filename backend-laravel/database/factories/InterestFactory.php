<?php

namespace Database\Factories;

use App\Models\Interest;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Interest>
 */
class InterestFactory extends Factory
{
    protected $model = Interest::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // Use a curated list of realistic interest keywords
            'keyword' => fake()->unique()->randomElement([
                'Inteligencia Artificial',
                'Ciencia de Datos',
                'Desarrollo Web',
                'Ciberseguridad',
                'Ingeniería de Software',
                'Redes',
                'Sistemas Embebidos',
                'Base de Datos',
                'Visión Artificial',
                'Aprendizaje Automático',
            ]),
        ];
    }
}
