<?php

namespace Database\Factories;

use App\Models\Certificate;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Certificate>
 */
class CertificateFactory extends Factory
{
    protected $model = Certificate::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => fake()->words(3, true) . ' Certificate',
            'description' => fake()->sentence(),
            'issue_date' => fake()->dateTimeBetween('-2 years', 'now'),
            'document_url' => fake()->url(), // Required field, not nullable
            'comment' => fake()->optional()->sentence(),
            'deleted' => false,
        ];
    }

    /**
     * Indicate that the certificate is deleted.
     */
    public function deleted(): static
    {
        return $this->state(fn (array $attributes) => [
            'deleted' => true,
        ]);
    }
}

