<?php

namespace Database\Factories;

use App\Models\PublicationAccess;
use App\Models\Publication;
use App\Models\Profile;
use Illuminate\Database\Eloquent\Factories\Factory;

class PublicationAccessFactory extends Factory
{
    protected $model = PublicationAccess::class;

    public function definition(): array
    {
        // Asegurar que existan registros antes de elegirlos
        if (Profile::count() === 0) {
            Profile::factory(5)->create();
        }

        if (Publication::count() === 0) {
            Publication::factory(5)->create();
        }

        // Seleccionar un perfil y una publicación existentes
        $profile = Profile::inRandomOrder()->first();
        $publication = Publication::inRandomOrder()->first();

        return [
            'profile_id' => $profile->profile_id, // usa la PK real
            'publication_id' => $publication->publication_id, // idem
        ];
    }
}
