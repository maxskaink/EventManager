<?php

namespace Tests\Feature\Controllers;

use App\Http\Controllers\ProfileController;
use Tests\TestCase;

class ProfileExtrasControllerTest extends TestCase
{
    public function test_profile_extra_methods_exist()
    {
        $methods = [
            'listAllProfiles',
            'listProfileInterests',
            'addProfileInterests',
            'removeProfileInterest',
        ];
        foreach ($methods as $m) {
            $this->assertTrue(method_exists(ProfileController::class, $m));
        }
    }

    public function test_profile_extra_routes_registered()
    {
        $routes = app('router')->getRoutes();
        $uris = array_map(fn($r) => '/' . ltrim($r->uri(), '/'), iterator_to_array($routes));
        $hasProfile = collect($uris)->contains(fn($u) => str_contains($u, '/profile'));
        $hasInterests = collect($uris)->contains(fn($u) => str_contains($u, 'interests'));
        $this->assertTrue($hasProfile);
        $this->assertTrue($hasInterests);
    }
}
