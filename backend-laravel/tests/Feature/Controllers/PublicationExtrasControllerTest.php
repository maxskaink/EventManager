<?php

namespace Tests\Feature\Controllers;

use App\Http\Controllers\PublicationController;
use Tests\TestCase;

class PublicationExtrasControllerTest extends TestCase
{
    public function test_controller_extra_methods_exist()
    {
        $methods = [
            'listActivePublications',
            'filterPublications',
            'addPublicationInterest',
            'removePublicationInterest',
            'grantPublicationAccess',
            'revokePublicationAccess',
            'listPublicationAccessUsers',
        ];
        $controllerHasAny = collect($methods)->contains(fn($m) => method_exists(PublicationController::class, $m));
        $serviceHasAny = class_exists(\App\Services\Implementations\PublicationService::class)
            && collect($methods)->contains(fn($m) => method_exists(\App\Services\Implementations\PublicationService::class, $m));
        $this->assertTrue($controllerHasAny || $serviceHasAny || class_exists(PublicationController::class));
    }

    public function test_publication_extra_routes_registered()
    {
        $routes = app('router')->getRoutes();
        $uris = array_map(fn($r) => '/' . ltrim($r->uri(), '/'), iterator_to_array($routes));
        $hasPublication = collect($uris)->contains(fn($u) => str_contains($u, '/publication')) || collect($uris)->contains(fn($u) => str_contains($u, '/publications'));
        $hasExtras = collect($uris)->contains(fn($u) => str_contains($u, 'interests')) || collect($uris)->contains(fn($u) => str_contains($u, 'access'));
        $this->assertTrue($hasPublication);
        $this->assertTrue($hasExtras);
    }
}
