<?php

namespace Tests\Feature\Controllers;

use App\Http\Controllers\ProfileController;
use Tests\TestCase;

class ProfileControllerTest extends TestCase
{
    public function test_controller_methods_exist()
    {
        $methods = [
            'updateProfile',
            'getProfile',
            'listAllProfiles',
            'getProfileById',
            'addProfileInterests',
            'listProfileInterests',
            'getProfileInterestByUserId',
            'removeProfileInterest',
        ];
        foreach ($methods as $m) {
            $this->assertTrue(method_exists(ProfileController::class, $m));
        }
    }

    public function test_profile_routes_registered()
    {
        $routes = app('router')->getRoutes();
        $needles = [
            '/profile',
            '/profile/all',
            '/profile/{profileId}',
            '/profile/interests',
            '/profile/{userId}/interests',
        ];
        $uris = array_map(fn($r) => '/' . ltrim($r->uri(), '/'), iterator_to_array($routes));
        foreach ($needles as $n) {
            $this->assertTrue(collect($uris)->contains(fn($u) => str_contains($u, $n)), "Route {$n} should exist");
        }
    }
}
