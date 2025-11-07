<?php

namespace Tests\Feature;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProfileControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test que updateProfile actualiza el perfil correctamente.
     */
    public function test_update_profile_updates_profile_successfully(): void
    {
        // Arrange: Crear usuario autenticado
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $data = [
            'university' => 'Test University',
            'academic_program' => 'Computer Science',
            'phone' => '+1234567890',
        ];

        // Act: Hacer petición PUT
        $response = $this->putJson('/api/profile', $data);

        // Assert: Verificar respuesta
        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'profile' => [
                    'user_id',
                    'university',
                    'academic_program',
                    'phone',
                ],
            ])
            ->assertJson([
                'message' => 'Profile updated successfully.',
                'profile' => [
                    'user_id' => $user->id,
                    'university' => 'Test University',
                    'academic_program' => 'Computer Science',
                    'phone' => '+1234567890',
                ],
            ]);
    }

    /**
     * Test que updateProfile requiere autenticación.
     */
    public function test_update_profile_requires_authentication(): void
    {
        // Act: Hacer petición sin autenticación
        $response = $this->putJson('/api/profile', [
            'university' => 'Test University',
        ]);

        // Assert: Verificar que requiere autenticación
        $response->assertStatus(401);
    }

    /**
     * Test que getProfile retorna el perfil del usuario autenticado.
     */
    public function test_get_profile_returns_user_profile(): void
    {
        // Arrange: Crear usuario con perfil
        $user = User::factory()->create();
        $profile = Profile::factory()->create(['user_id' => $user->id]);
        Sanctum::actingAs($user);

        // Act: Hacer petición GET
        $response = $this->getJson('/api/profile');

        // Assert: Verificar respuesta
        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment([
                'user_id' => $user->id,
                'university' => $profile->university,
            ]);
    }

    /**
     * Test que getProfile retorna perfil vacío si no existe.
     */
    public function test_get_profile_returns_empty_profile_if_not_exists(): void
    {
        // Arrange: Crear usuario sin perfil
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        // Act: Hacer petición GET
        $response = $this->getJson('/api/profile');

        // Assert: Verificar respuesta
        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment([
                'user_id' => $user->id,
            ]);
    }

    /**
     * Test que getProfile requiere autenticación.
     */
    public function test_get_profile_requires_authentication(): void
    {
        // Act: Hacer petición sin autenticación
        $response = $this->getJson('/api/profile');

        // Assert: Verificar que requiere autenticación
        $response->assertStatus(401);
    }
}

