<?php

namespace Tests\Feature\Controllers;

use App\Http\Controllers\EventController;
use Tests\TestCase;

class EventParticipationControllerTest extends TestCase
{
    public function test_controller_participation_methods_exist()
    {
        $methods = [
            'listAllParticipations',
            'listParticipationsByUser',
            'listParticipationsByEvent',
        ];
        foreach ($methods as $m) {
            $this->assertTrue(method_exists(EventController::class, $m));
        }
    }

    public function test_participation_routes_registered()
    {
        $routes = app('router')->getRoutes();
        $uris = array_map(fn($r) => '/' . ltrim($r->uri(), '/'), iterator_to_array($routes));
        $hasEvent = collect($uris)->contains(fn($u) => str_contains($u, '/event')) || collect($uris)->contains(fn($u) => str_contains($u, '/events'));
        $hasParticipations = collect($uris)->contains(fn($u) => str_contains($u, 'participations')) || collect($uris)->contains(fn($u) => str_contains($u, 'participation'));
        $this->assertTrue($hasEvent);
        $this->assertTrue($hasParticipations);
    }
}
