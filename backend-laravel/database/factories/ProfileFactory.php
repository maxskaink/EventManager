<?php

namespace Database\Factories;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Profile>
 */
class ProfileFactory extends Factory
{
    protected $model = Profile::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            // Prefer realistic Colombian universities when present
            'university' => fake()->optional(0.85)->randomElement([
                'Universidad del Cauca',
                'Universidad de Antioquia',
                'Universidad Nacional de Colombia',
                'Universidad del Valle',
                'Universidad ICESI',
                'Universidad de los Andes',
            ]),
            // Academic program chosen from common programs
            'academic_program' => fake()->optional(0.9)->randomElement([
                'Ingeniería de Sistemas y Computación',
                'Ingeniería de Software',
                'Ciencia de Datos',
                'Ingeniería Electrónica',
                'Licenciatura en Matemáticas',
            ]),
            // Phone number may be empty for some profiles
            'phone' => fake()->optional(0.7)->phoneNumber(),
        ];
    }
}

