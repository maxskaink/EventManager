<?php

namespace Tests\Feature\Controllers;

use App\Http\Controllers\UserController;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    public function test_controller_methods_exist()
    {
        $methods = [
            'toggleRole',
            'listInactiveUsers',
            'listFilteredUsers',
            'getUserById',
        ];
        foreach ($methods as $m) {
            $this->assertTrue(method_exists(UserController::class, $m));
        }
    }

    public function test_user_routes_registered()
    {
        $routes = app('router')->getRoutes();
        $needles = [
            '/user/filter',
            '/user/inactive',
            '/user/{user}',
            '/user/{user}/toggle-role',
        ];
        $uris = array_map(fn($r) => '/' . ltrim($r->uri(), '/'), iterator_to_array($routes));
        foreach ($needles as $n) {
            $this->assertTrue(collect($uris)->contains(fn($u) => str_contains($u, $n)), "Route {$n} should exist");
        }
    }
}
