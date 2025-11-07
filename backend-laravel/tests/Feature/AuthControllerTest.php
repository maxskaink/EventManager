<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test que el endpoint /api/user retorna el usuario autenticado.
     */
    public function test_user_endpoint_returns_authenticated_user(): void
    {
        // Arrange: Crear y autenticar usuario
        $user = User::factory()->create(['role' => 'member']);
        Sanctum::actingAs($user);

        // Act: Hacer petición GET
        $response = $this->getJson('/api/user');

        // Assert: Verificar respuesta
        $response->assertStatus(200)
            ->assertJsonStructure([
                'user' => [
                    'id',
                    'name',
                    'email',
                    'role',
                ],
            ])
            ->assertJson([
                'user' => [
                    'id' => $user->id,
                    'email' => $user->email,
                ],
            ]);
    }

    /**
     * Test que el endpoint /api/user requiere autenticación.
     */
    public function test_user_endpoint_requires_authentication(): void
    {
        // Act: Hacer petición sin autenticación
        $response = $this->getJson('/api/user');

        // Assert: Verificar que requiere autenticación
        $response->assertStatus(401);
    }

    /**
     * Test que el endpoint /api/logout cierra sesión correctamente.
     */
    public function test_logout_endpoint_logs_out_successfully(): void
    {
        // Arrange: Crear y autenticar usuario
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        // Act: Hacer petición de logout
        $response = $this->getJson('/api/logout');

        // Assert: Verificar respuesta
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Logged out successfully',
            ]);
    }

    /**
     * Test que el endpoint /api/logout requiere autenticación.
     */
    public function test_logout_endpoint_requires_authentication(): void
    {
        // Act: Hacer petición sin autenticación
        $response = $this->getJson('/api/logout');

        // Assert: Verificar que requiere autenticación
        $response->assertStatus(401);
    }
}

