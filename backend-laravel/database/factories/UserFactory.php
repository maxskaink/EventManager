<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Generate a realistic full name and role-aware email domain
        $name = $this->faker->name();
        $role = $this->faker->randomElement(['interested', 'active-member', 'seed', 'coordinator', 'mentor']);
        $localPart = strtolower(str_replace(' ', '.', $this->faker->unique()->firstName()));
        $domain = in_array($role, ['seed', 'coordinator', 'mentor']) ? '@unicauca.edu.co' : '@gmail.com';

        return [
            'name' => $name,
            'email' => $localPart . $domain,
            'email_verified_at' => now(),
            // google_id may be null for most users
            'google_id' => $this->faker->boolean(25) ? 'google_' . $this->faker->uuid() : null,
            'avatar' => $this->faker->optional(0.7)->imageUrl(400, 400, 'people'),
            'role' => $role,
            // Do not set password or remember_token here; the users table does not include a password column
        ];

    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
