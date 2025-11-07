<?php

namespace Database\Factories;

use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    protected $model = Event::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = fake()->dateTimeBetween('now', '+1 month');
        $endDate = Carbon::parse($startDate)->addDays(fake()->numberBetween(1, 7));

        return [
            'name' => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'start_date' => $startDate,
            'end_date' => $endDate,
            'event_type' => fake()->randomElement(['charla', 'curso', 'convocatoria']),
            'modality' => fake()->randomElement(['presencial', 'virtual', 'mixta']),
            'location' => fake()->optional()->address(),
            'status' => fake()->randomElement(['activo', 'inactivo', 'pendiente', 'cancelado']),
            'capacity' => fake()->optional()->numberBetween(10, 100),
        ];
    }

    /**
     * Indicate that the event is upcoming.
     */
    public function upcoming(): static
    {
        return $this->state(function (array $attributes) {
            $startDate = fake()->dateTimeBetween('now', '+1 month');
            $endDate = Carbon::parse($startDate)->addDays(fake()->numberBetween(1, 7));

            return [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'status' => 'pendiente',
            ];
        });
    }

    /**
     * Indicate that the event is past.
     */
    public function past(): static
    {
        return $this->state(function (array $attributes) {
            $endDate = fake()->dateTimeBetween('-1 month', 'now');
            $startDate = Carbon::parse($endDate)->subDays(fake()->numberBetween(1, 7));

            return [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'status' => 'activo',
            ];
        });
    }
}

