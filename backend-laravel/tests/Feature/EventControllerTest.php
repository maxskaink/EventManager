<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class EventControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test que addEvent crea un evento correctamente.
     */
    public function test_add_event_creates_event_successfully(): void
    {
        // Arrange: Crear usuario coordinador
        $coordinator = User::factory()->create(['role' => 'coordinator']);
        Sanctum::actingAs($coordinator);

        $eventData = [
            'name' => 'Test Event',
            'description' => 'This is a test event',
            'start_date' => Carbon::now()->addDays(7)->toDateTimeString(),
            'end_date' => Carbon::now()->addDays(8)->toDateTimeString(),
            'event_type' => 'charla',
            'modality' => 'virtual',
            'status' => 'pendiente',
            'capacity' => 50,
        ];

        // Act: Hacer petición POST
        $response = $this->postJson('/api/event', $eventData);

        // Assert: Verificar respuesta
        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
            ]);

        $this->assertDatabaseHas('events', [
            'name' => 'Test Event',
            'event_type' => 'charla',
        ]);
    }

    /**
     * Test que addEvent requiere rol de mentor o coordinator.
     */
    public function test_add_event_requires_mentor_or_coordinator_role(): void
    {
        // Arrange: Crear usuario sin permisos
        $member = User::factory()->create(['role' => 'member']);
        Sanctum::actingAs($member);

        $eventData = [
            'name' => 'Test Event',
            'description' => 'This is a test event',
            'start_date' => Carbon::now()->addDays(7)->toDateTimeString(),
            'end_date' => Carbon::now()->addDays(8)->toDateTimeString(),
            'event_type' => 'charla',
            'modality' => 'virtual',
            'status' => 'pendiente',
        ];

        // Act: Hacer petición POST
        $response = $this->postJson('/api/event', $eventData);

        // Assert: Verificar que se rechaza
        $response->assertStatus(403);
    }

    /**
     * Test que listAllEvents retorna todos los eventos.
     */
    public function test_list_all_events_returns_all_events(): void
    {
        // Arrange: Crear eventos y usuario coordinador
        $coordinator = User::factory()->create(['role' => 'coordinator']);
        $event1 = Event::factory()->create();
        $event2 = Event::factory()->create();

        Sanctum::actingAs($coordinator);

        // Act: Hacer petición GET
        $response = $this->getJson('/api/event/all');

        // Assert: Verificar respuesta
        $response->assertStatus(200)
            ->assertJsonCount(2)
            ->assertJsonFragment(['id' => $event1->id])
            ->assertJsonFragment(['id' => $event2->id]);
    }

    /**
     * Test que listUpcomingEvents retorna solo eventos futuros.
     */
    public function test_list_upcoming_events_returns_only_future_events(): void
    {
        // Arrange: Crear eventos
        $coordinator = User::factory()->create(['role' => 'coordinator']);
        $upcomingEvent = Event::factory()->upcoming()->create();
        $pastEvent = Event::factory()->past()->create();

        Sanctum::actingAs($coordinator);

        // Act: Hacer petición GET
        $response = $this->getJson('/api/event/active');

        // Assert: Verificar respuesta
        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $upcomingEvent->id])
            ->assertJsonMissing(['id' => $pastEvent->id]);
    }

    /**
     * Test que listPastEvents retorna solo eventos pasados.
     */
    public function test_list_past_events_returns_only_past_events(): void
    {
        // Arrange: Crear eventos
        $mentor = User::factory()->create(['role' => 'mentor']);
        $upcomingEvent = Event::factory()->upcoming()->create();
        $pastEvent1 = Event::factory()->past()->create();
        $pastEvent2 = Event::factory()->past()->create();

        Sanctum::actingAs($mentor);

        // Act: Hacer petición GET
        $response = $this->getJson('/api/event/past');

        // Assert: Verificar respuesta
        $response->assertStatus(200)
            ->assertJsonCount(2)
            ->assertJsonFragment(['id' => $pastEvent1->id])
            ->assertJsonFragment(['id' => $pastEvent2->id])
            ->assertJsonMissing(['id' => $upcomingEvent->id]);
    }

    /**
     * Test que updateEvent actualiza un evento correctamente.
     */
    public function test_update_event_updates_event_successfully(): void
    {
        // Arrange: Crear evento y usuario coordinador
        $coordinator = User::factory()->create(['role' => 'coordinator']);
        $event = Event::factory()->create(['name' => 'Original Name']);

        Sanctum::actingAs($coordinator);

        $updateData = [
            'name' => 'Updated Name',
            'description' => 'Updated description',
        ];

        // Act: Hacer petición PATCH
        $response = $this->patchJson("/api/event/{$event->id}", $updateData);

        // Assert: Verificar respuesta
        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'event',
            ])
            ->assertJson([
                'message' => 'Event updated successfully.',
            ]);

        $event->refresh();
        $this->assertEquals('Updated Name', $event->name);
        $this->assertEquals('Updated description', $event->description);
    }

    /**
     * Test que updateEvent requiere rol de mentor o coordinator.
     */
    public function test_update_event_requires_mentor_or_coordinator_role(): void
    {
        // Arrange: Crear evento y usuario sin permisos
        $member = User::factory()->create(['role' => 'member']);
        $event = Event::factory()->create();

        Sanctum::actingAs($member);

        $updateData = [
            'name' => 'Updated Name',
        ];

        // Act: Hacer petición PATCH
        $response = $this->patchJson("/api/event/{$event->id}", $updateData);

        // Assert: Verificar que se rechaza
        $response->assertStatus(403);
    }

    /**
     * Test que listAllEvents requiere permisos.
     */
    public function test_list_all_events_requires_permissions(): void
    {
        // Arrange: Crear usuario sin permisos
        $member = User::factory()->create(['role' => 'member']);
        Sanctum::actingAs($member);

        // Act: Hacer petición GET
        $response = $this->getJson('/api/event/all');

        // Assert: Verificar que se rechaza
        $response->assertStatus(403);
    }
}

