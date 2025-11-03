<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test que listActiveUsers retorna usuarios activos para mentor.
     */
    public function test_list_active_users_returns_active_users_for_mentor(): void
    {
        // Arrange: Crear usuarios
        $mentor = User::factory()->create(['role' => 'mentor']);
        $user1 = User::factory()->create(['role' => 'member']);
        $user2 = User::factory()->create(['role' => 'interested']);
        $deletedUser = User::factory()->create(['role' => 'member']);
        $deletedUser->delete();

        Sanctum::actingAs($mentor);

        // Act: Hacer petición
        $response = $this->getJson('/api/user/active');

        // Assert: Verificar respuesta
        $response->assertStatus(200)
            ->assertJsonCount(3) // mentor + user1 + user2
            ->assertJsonFragment(['id' => $user1->id])
            ->assertJsonFragment(['id' => $user2->id]);
    }

    /**
     * Test que listActiveUsers requiere permisos de mentor o coordinator.
     */
    public function test_list_active_users_requires_permissions(): void
    {
        // Arrange: Crear usuario sin permisos
        $member = User::factory()->create(['role' => 'member']);
        Sanctum::actingAs($member);

        // Act: Hacer petición
        $response = $this->getJson('/api/user/active');

        // Assert: Verificar que se rechaza
        $response->assertStatus(403);
    }

    /**
     * Test que toggleRole cambia el rol de un usuario.
     */
    public function test_toggle_role_changes_user_role(): void
    {
        // Arrange: Crear usuarios
        $mentor = User::factory()->create(['role' => 'mentor']);
        $userToChange = User::factory()->create(['role' => 'interested']);

        Sanctum::actingAs($mentor);

        // Act: Cambiar rol
        $response = $this->patchJson("/api/user/{$userToChange->id}/toggle-role", [
            'new_role' => 'member',
        ]);

        // Assert: Verificar respuesta
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Role changed successfully to member',
            ]);

        $userToChange->refresh();
        $this->assertEquals('member', $userToChange->role);
    }

    /**
     * Test que toggleRole no permite cambiar el propio rol.
     */
    public function test_toggle_role_prevents_changing_own_role(): void
    {
        // Arrange: Crear usuario
        $user = User::factory()->create(['role' => 'interested']);
        Sanctum::actingAs($user);

        // Act: Intentar cambiar propio rol
        $response = $this->patchJson("/api/user/{$user->id}/toggle-role", [
            'new_role' => 'member',
        ]);

        // Assert: Verificar que se rechaza
        $response->assertStatus(403);
    }

    /**
     * Test que listActiveMembers retorna solo miembros activos.
     */
    public function test_list_active_members_returns_only_members(): void
    {
        // Arrange: Crear usuarios
        $coordinator = User::factory()->create(['role' => 'coordinator']);
        $member1 = User::factory()->create(['role' => 'member']);
        $member2 = User::factory()->create(['role' => 'member']);
        $interested = User::factory()->create(['role' => 'interested']);

        Sanctum::actingAs($coordinator);

        // Act: Hacer petición
        $response = $this->getJson('/api/user/member');

        // Assert: Verificar respuesta
        $response->assertStatus(200)
            ->assertJsonCount(2)
            ->assertJsonFragment(['id' => $member1->id])
            ->assertJsonFragment(['id' => $member2->id])
            ->assertJsonMissing(['id' => $interested->id]);
    }

    /**
     * Test que listActiveInterested retorna solo usuarios interested.
     */
    public function test_list_active_interested_returns_only_interested(): void
    {
        // Arrange: Crear usuarios
        $mentor = User::factory()->create(['role' => 'mentor']);
        $interested1 = User::factory()->create(['role' => 'interested']);
        $interested2 = User::factory()->create(['role' => 'interested']);
        $member = User::factory()->create(['role' => 'member']);

        Sanctum::actingAs($mentor);

        // Act: Hacer petición
        $response = $this->getJson('/api/user/interested');

        // Assert: Verificar respuesta
        $response->assertStatus(200)
            ->assertJsonCount(2)
            ->assertJsonFragment(['id' => $interested1->id])
            ->assertJsonFragment(['id' => $interested2->id])
            ->assertJsonMissing(['id' => $member->id]);
    }

    /**
     * Test que listActiveCoordinators retorna solo coordinadores.
     */
    public function test_list_active_coordinators_returns_only_coordinators(): void
    {
        // Arrange: Crear usuarios
        $mentor = User::factory()->create(['role' => 'mentor']);
        $coordinator1 = User::factory()->create(['role' => 'coordinator']);
        $coordinator2 = User::factory()->create(['role' => 'coordinator']);

        Sanctum::actingAs($mentor);

        // Act: Hacer petición
        $response = $this->getJson('/api/user/coordinator');

        // Assert: Verificar respuesta
        $response->assertStatus(200)
            ->assertJsonCount(2)
            ->assertJsonFragment(['id' => $coordinator1->id])
            ->assertJsonFragment(['id' => $coordinator2->id]);
    }

    /**
     * Test que listActiveMentors retorna solo mentores.
     */
    public function test_list_active_mentors_returns_only_mentors(): void
    {
        // Arrange: Crear usuarios
        $coordinator = User::factory()->create(['role' => 'coordinator']);
        $mentor1 = User::factory()->create(['role' => 'mentor']);
        $mentor2 = User::factory()->create(['role' => 'mentor']);

        Sanctum::actingAs($coordinator);

        // Act: Hacer petición
        $response = $this->getJson('/api/user/mentor');

        // Assert: Verificar respuesta
        $response->assertStatus(200)
            ->assertJsonCount(2)
            ->assertJsonFragment(['id' => $mentor1->id])
            ->assertJsonFragment(['id' => $mentor2->id]);
    }

    /**
     * Test que listInactiveUsers retorna solo usuarios inactivos.
     */
    public function test_list_inactive_users_returns_only_deleted_users(): void
    {
        // Arrange: Crear usuarios
        $mentor = User::factory()->create(['role' => 'mentor']);
        $activeUser = User::factory()->create(['role' => 'member']);
        $deletedUser1 = User::factory()->create(['role' => 'member']);
        $deletedUser2 = User::factory()->create(['role' => 'interested']);
        $deletedUser1->delete();
        $deletedUser2->delete();

        Sanctum::actingAs($mentor);

        // Act: Hacer petición
        $response = $this->getJson('/api/user/inactive');

        // Assert: Verificar respuesta
        $response->assertStatus(200)
            ->assertJsonCount(2)
            ->assertJsonFragment(['id' => $deletedUser1->id])
            ->assertJsonFragment(['id' => $deletedUser2->id])
            ->assertJsonMissing(['id' => $activeUser->id]);
    }
}

