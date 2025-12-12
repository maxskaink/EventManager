<?php

namespace Tests\Feature\Controllers;

use App\Http\Controllers\InterestController;
use Tests\TestCase;

class InterestControllerTest extends TestCase
{
    public function test_controller_methods_exist()
    {
        $methods = [
            'listAllInterests',
            'addInterest',
            'deleteInterest',
        ];
        foreach ($methods as $m) {
            $this->assertTrue(method_exists(InterestController::class, $m));
        }
    }

    public function test_interest_routes_registered()
    {
        $routes = app('router')->getRoutes();
        $needles = [
            '/interest/all',
            '/interest',
            '/interest/{interestId}',
        ];
        $uris = array_map(fn($r) => '/' . ltrim($r->uri(), '/'), iterator_to_array($routes));
        foreach ($needles as $n) {
            $this->assertTrue(collect($uris)->contains(fn($u) => str_contains($u, $n)), "Route {$n} should exist");
        }
    }
}
