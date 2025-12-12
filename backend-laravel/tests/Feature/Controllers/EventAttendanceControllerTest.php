<?php

namespace Tests\Feature\Controllers;

use App\Http\Controllers\EventController;
use Tests\TestCase;

class EventAttendanceControllerTest extends TestCase
{
    public function test_controller_attendance_methods_exist()
    {
        $this->assertTrue(method_exists(EventController::class, 'markUsersAsAttended'));
        $this->assertTrue(method_exists(EventController::class, 'markUsersAsAbsent'));
    }

    public function test_attendance_routes_registered()
    {
        $routes = app('router')->getRoutes();
        $uris = array_map(fn($r) => '/' . ltrim($r->uri(), '/'), iterator_to_array($routes));
        $hasEvent = collect($uris)->contains(fn($u) => str_contains($u, '/event')) || collect($uris)->contains(fn($u) => str_contains($u, '/events'));
        $hasAttendanceRelated = collect($uris)->contains(fn($u) => str_contains($u, 'participation'))
            || collect($uris)->contains(fn($u) => str_contains($u, 'attend'))
            || collect($uris)->contains(fn($u) => str_contains($u, 'absent'))
            || collect($uris)->contains(fn($u) => str_contains($u, 'attendance'));
        $this->assertTrue($hasEvent);
        $this->assertTrue($hasAttendanceRelated);
    }
}
