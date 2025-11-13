<?php

namespace Database\Factories;

use App\Models\ExternalEvent;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ExternalEvent>
 */
class ExternalEventFactory extends Factory
{
    protected $model = ExternalEvent::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $start = fake()->dateTimeBetween('-2 months', '+3 months');
        $end = (clone $start)->modify('+' . fake()->numberBetween(2, 48) . ' hours');

        return [
            'user_id' => User::factory(),
            'name' => fake()->randomElement([
                'Congreso Internacional de Tecnología',
                'Congreso de Educación y Tecnología',
                'Simposio de Inteligencia Artificial',
                'Congreso de Ingeniería de Software',
            ]),
            'description' => fake()->optional(0.9)->paragraphs(2, true),
            'start_date' => $start,
            'end_date' => $end,
            'modality' => fake()->randomElement(['presencial', 'virtual']),
            'host_organization' => fake()->company(),
            'location' => fake()->optional(0.9)->city() . ', ' . fake()->optional(0.7)->country(),
            'participation_url' => fake()->optional(0.6)->url(),
        ];
    }
}
