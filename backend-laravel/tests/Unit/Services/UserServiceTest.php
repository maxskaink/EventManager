<?php

namespace Tests\Unit\Services;

use App\Services\UserService;
use Tests\TestCase;
use Illuminate\Support\Facades\Auth;

class UserServiceTest extends TestCase
{
    protected UserService $userService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->userService = app(UserService::class);
    }

    /**
     * Servicio está registrado en el contenedor
     */
    public function test_service_is_resolvable()
    {
        $service = app(UserService::class);
        $this->assertInstanceOf(UserService::class, $service);
    }

    /**
     * Métodos del servicio existen
     */
    public function test_service_methods_exist()
    {
        $methods = [
            'listActiveUsers',
            'listActiveInterested',
            'listActiveMembers',
            'listActiveCoordinators',
            'listActiveMentors',
            'listInactiveUsers',
            'toggleRole',
        ];
        foreach ($methods as $m) {
            $this->assertTrue(method_exists(UserService::class, $m));
        }
    }
}
