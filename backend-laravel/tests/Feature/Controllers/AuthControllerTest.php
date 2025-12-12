<?php

namespace Tests\Feature\Controllers;

use App\Http\Controllers\AuthController;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    public function test_controller_methods_exist()
    {
        $methods = [
            'redirectToAuth',
            'handleGoogleCallback',
            'logout',
            'user',
        ];
        foreach ($methods as $m) {
            $this->assertTrue(method_exists(AuthController::class, $m));
        }
    }

    public function test_auth_routes_registered()
    {
        $routes = app('router')->getRoutes();
        $needles = [
            '/auth',
            '/auth/callback',
            '/user',
            '/logout',
        ];
        $uris = array_map(fn($r) => '/' . ltrim($r->uri(), '/'), iterator_to_array($routes));
        foreach ($needles as $n) {
            $this->assertTrue(collect($uris)->contains(fn($u) => str_contains($u, $n)), "Route {$n} should exist");
        }
    }
}
