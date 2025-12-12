<?php

namespace Tests\Feature\Controllers;

use App\Http\Controllers\NotificationController;
use Tests\TestCase;

class NotificationControllerTest extends TestCase
{
    public function test_controller_methods_exist()
    {
        $methods = [
            'listMyNotifications',
            'listNotificationsByUser',
            'listAllNotification',
        ];
        foreach ($methods as $m) {
            $this->assertTrue(method_exists(NotificationController::class, $m));
        }
    }

    public function test_notification_routes_registered()
    {
        $routes = app('router')->getRoutes();
        $needles = [
            '/notification/my',
            '/notification/user/{userId}',
            '/notification/all',
        ];
        $uris = array_map(fn($r) => '/' . ltrim($r->uri(), '/'), iterator_to_array($routes));
        foreach ($needles as $n) {
            $this->assertTrue(collect($uris)->contains(fn($u) => str_contains($u, $n)), "Route {$n} should exist");
        }
    }
}
