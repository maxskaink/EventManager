<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\Publication;
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
        // Fecha de inicio: entre 3 meses atrás y 3 meses adelante
        $startDate = fake()->dateTimeBetween('-3 months', '+3 months');
        // Fecha de fin: siempre después del inicio (1 a 3 días de duración)
        $endDate = Carbon::parse($startDate)->addDays(fake()->numberBetween(1, 3));

        // Tipos y temas de eventos realistas
        $eventTypes = ['charla', 'curso', 'convocatoria', 'taller', 'conferencia'];
        $subjects = [
            'Inteligencia Artificial',
            'Ciencia de Datos',
            'Ciberseguridad',
            'Desarrollo Web',
            'Computación en la Nube',
            'Ingeniería de Software',
            'Internet de las Cosas',
            'Robótica Aplicada',
        ];

        $eventType = fake()->randomElement($eventTypes);
        $subject = fake()->randomElement($subjects);

        // Nombre lógico basado en el tipo de evento y el tema
        $name = ucfirst($eventType) . ' sobre ' . $subject;

        // Modalidad y ubicación
        $modality = fake()->randomElement(['presencial', 'virtual', 'mixta']);
        $cities = ['Popayán', 'Cali', 'Bogotá', 'Medellín', 'Pasto', 'Manizales', 'Cartagena', 'Pereira', 'Ibagué'];
        $location = $modality === 'virtual' ? 'Online' : fake()->randomElement($cities);

        // Estado dinámico basado en las fechas
        $status = match (true) {
            $endDate < now() => 'finalizado',
            $startDate > now() => 'pendiente',
            default => 'activo',
        };

        return [
            // Relación opcional con publicación
            'publication_id' => fake()->optional()->randomElement(Publication::pluck('id')->toArray()),
            'name' => $name,
            'description' => fake()->paragraphs(2, true),
            'start_date' => $startDate,
            'end_date' => $endDate,
            'event_type' => $eventType,
            'modality' => $modality,
            'location' => $location,
            'status' => $status,
            'capacity' => fake()->optional()->numberBetween(20, 300),
        ];
    }

    /**
     * Define an upcoming event.
     */
    public function upcoming(): static
    {
        return $this->state(function () {
            $startDate = fake()->dateTimeBetween('now', '+2 months');
            $endDate = Carbon::parse($startDate)->addDays(fake()->numberBetween(1, 3));

            return [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'status' => 'pendiente',
            ];
        });
    }

    /**
     * Define a past (finished) event.
     */
    public function past(): static
    {
        return $this->state(function () {
            $endDate = fake()->dateTimeBetween('-3 months', '-1 day');
            $startDate = Carbon::parse($endDate)->subDays(fake()->numberBetween(1, 3));

            return [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'status' => 'finalizado',
            ];
        });
    }
}
