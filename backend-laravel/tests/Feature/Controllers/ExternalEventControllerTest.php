<?php

namespace Tests\Feature\Controllers;

use App\Http\Controllers\ExternalEventController;
use Tests\TestCase;

class ExternalEventControllerTest extends TestCase
{
    public function test_controller_methods_exist()
    {
        $methods = [
            'addExternalEvent',
            'updateExternalEvent',
            'deleteExternalEvent',
            'listMyExternalEvents',
            'listExternalEventsByUser',
            'listAllExternalEvents',
            'listExternalEventsByDateRange',
            'getAllTrustedOrganizations',
        ];
        foreach ($methods as $m) {
            $this->assertTrue(method_exists(ExternalEventController::class, $m));
        }
    }

    public function test_external_event_routes_registered()
    {
        $routes = app('router')->getRoutes();
        $needles = [
            '/external-event',
            '/external-event/my',
            '/external-event/all',
            '/external-event/user/{userId}',
            '/external-event/date-range',
        ];
        $uris = array_map(fn($r) => '/' . ltrim($r->uri(), '/'), iterator_to_array($routes));
        foreach ($needles as $n) {
            $this->assertTrue(collect($uris)->contains(fn($u) => str_contains($u, $n)), "Route {$n} should exist");
        }
    }
}
