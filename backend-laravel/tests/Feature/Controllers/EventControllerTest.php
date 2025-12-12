<?php

namespace Tests\Feature\Controllers;

use App\Http\Controllers\EventController;
use Tests\TestCase;

class EventControllerTest extends TestCase
{
    public function test_controller_methods_exist()
    {
        $methods = [
            'addEvent',
            'listAllEvents',
            'listUpcomingEvents',
            'listPastEvents',
            'updateEvent',
            'enrollUser',
            'cancelEnrollment',
            'getEventById',
            'deleteEvent',
            'markUsersAsAttended',
            'markUsersAsAbsent',
            'listAllParticipations',
            'listParticipationsByEvent',
            'listParticipationsByUser',
        ];

        foreach ($methods as $m) {
            $this->assertTrue(method_exists(EventController::class, $m), "Method {$m} should exist");
        }
    }

    public function test_event_routes_registered()
    {
        $routes = app('router')->getRoutes();
        $needles = [
            '/event/all',
            '/event/active',
            '/event/past',
            '/event/{eventId}/participation',
            '/event/{id}',
        ];

        $allUris = array_map(fn($r) => '/' . ltrim($r->uri(), '/'), iterator_to_array($routes));
        foreach ($needles as $n) {
            $found = collect($allUris)->contains(fn($u) => str_contains($u, $n));
            $this->assertTrue($found, "Route containing {$n} should be registered");
        }
    }
}
