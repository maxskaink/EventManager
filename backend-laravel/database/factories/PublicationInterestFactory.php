<?php

namespace Database\Factories;

use App\Models\PublicationInterest;
use App\Models\Publication;
use App\Models\Interest;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PublicationInterest>
 */
class PublicationInterestFactory extends Factory
{
    protected $model = PublicationInterest::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'publication_id' => Publication::factory(),
            'interest_id' => Interest::factory(),
        ];
    }
}
