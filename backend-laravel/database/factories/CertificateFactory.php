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
        $issueDate = $this->faker->dateTimeBetween('-3 years', 'now');

        // 25% de los certificados no expiran
        $doesNotExpire = $this->faker->boolean(25);
        $expirationDate = $doesNotExpire
            ? null
            : $this->faker->optional(0.8)->dateTimeBetween($issueDate, '+2 years');

        return [
            'user_id' => User::factory(),

            // Nombre académico coherente
            'name' => 'Certificado de ' . $this->faker->randomElement([
                'Asistencia al Curso de ' . $this->faker->randomElement(['Machine Learning', 'Desarrollo Web', 'Ciberseguridad', 'Cloud Computing']),
                'Participación en el Evento ' . $this->faker->randomElement(['Semana TIC', 'DataFest', 'InnovaTech', 'AI Day']),
                'Aprobación del Taller de ' . $this->faker->randomElement(['Análisis de Datos', 'Desarrollo Móvil', 'Redes Neuronales']),
                'Reconocimiento Académico en ' . $this->faker->randomElement(['Investigación', 'Innovación', 'Divulgación Científica']),
            ]),

            // Entidad emisora con nombres realistas
            'issuing_organization' => $this->faker->randomElement([
                'Universidad del Cauca',
                'Google Cloud Skills Boost',
                'Coursera',
                'Microsoft Learn',
                'IBM Skills Network',
                'Platzi',
                'EdX',
                'Udemy',
            ]),

            'issue_date' => $issueDate,
            'expiration_date' => $expirationDate,

            // ID de credencial tipo código
            'credential_id' => $this->faker->optional(0.7)->regexify('[A-Z0-9]{8,12}'),

            // URL realista
            'credential_url' => $this->faker->optional(0.8)->url(),

            'does_not_expire' => $doesNotExpire,

            'deleted' => false,

            'created_at' => now(),
            'updated_at' => now(),
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
