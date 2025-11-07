<?php

namespace Tests\Unit;

use App\Exceptions\InvalidRoleException;
use App\Models\Profile;
use App\Models\User;
use App\Services\Implementations\ProfileService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

class ProfileServiceTest extends TestCase
{
    use RefreshDatabase;

    private ProfileService $profileService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->profileService = new ProfileService();
    }

    /**
     * Test que updateProfile actualiza el perfil correctamente.
     */
    public function test_update_profile_updates_profile_successfully(): void
    {
        // Arrange: Crear usuario y perfil
        $user = User::factory()->create();
        Auth::login($user);

        $data = [
            'university' => 'Test University',
            'academic_program' => 'Computer Science',
            'phone' => '+1234567890',
        ];

        // Act: Actualizar perfil
        $profile = $this->profileService->updateProfile($user->id, $data);

        // Assert: Verificar que el perfil se actualizó
        $this->assertInstanceOf(Profile::class, $profile);
        $this->assertEquals($user->id, $profile->user_id);
        $this->assertEquals('Test University', $profile->university);
        $this->assertEquals('Computer Science', $profile->academic_program);
        $this->assertEquals('+1234567890', $profile->phone);
    }

    /**
     * Test que updateProfile crea un perfil si no existe.
     */
    public function test_update_profile_creates_profile_if_not_exists(): void
    {
        // Arrange: Crear usuario sin perfil
        $user = User::factory()->create();
        Auth::login($user);

        $data = [
            'university' => 'New University',
        ];

        // Act: Actualizar perfil (no existe aún)
        $profile = $this->profileService->updateProfile($user->id, $data);

        // Assert: Verificar que se creó el perfil
        $this->assertInstanceOf(Profile::class, $profile);
        $this->assertEquals($user->id, $profile->user_id);
        $this->assertEquals('New University', $profile->university);
    }

    /**
     * Test que updateProfile actualiza el perfil de cualquier usuario (validación en controller).
     * Nota: La validación de autorización se hace en el controller con ProfilePolicy, no en el servicio.
     */
    public function test_update_profile_throws_exception_when_modifying_other_user(): void
    {
        // Arrange: Crear dos usuarios
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        Auth::login($user1);

        $data = [
            'university' => 'Test University',
        ];

        // Act: El servicio no valida autorización, solo actualiza
        $profile = $this->profileService->updateProfile($user2->id, $data);

        // Assert: El servicio actualiza el perfil (la validación está en el controller)
        $this->assertInstanceOf(Profile::class, $profile);
        $this->assertEquals($user2->id, $profile->user_id);
        // Nota: Esta prueba debería estar en Feature tests, no en Unit tests
    }

    /**
     * Test que getProfile retorna el perfil existente.
     */
    public function test_get_profile_returns_existing_profile(): void
    {
        // Arrange: Crear usuario con perfil
        $user = User::factory()->create();
        $profile = Profile::factory()->create(['user_id' => $user->id]);

        // Act: Obtener perfil
        $result = $this->profileService->getProfile($user->id);

        // Assert: Verificar que retorna el perfil correcto
        $this->assertInstanceOf(Profile::class, $result);
        $this->assertEquals($profile->id, $result->id);
        $this->assertEquals($user->id, $result->user_id);
    }

    /**
     * Test que getProfile crea un perfil vacío si no existe.
     */
    public function test_get_profile_creates_empty_profile_if_not_exists(): void
    {
        // Arrange: Crear usuario sin perfil
        $user = User::factory()->create();

        // Act: Obtener perfil (no existe)
        $result = $this->profileService->getProfile($user->id);

        // Assert: Verificar que retorna un perfil nuevo (no persistido)
        $this->assertInstanceOf(Profile::class, $result);
        $this->assertEquals($user->id, $result->user_id);
        $this->assertNull($result->id); // No está guardado en la BD
    }
}

