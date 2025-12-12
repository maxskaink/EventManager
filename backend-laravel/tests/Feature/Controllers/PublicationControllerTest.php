<?php

namespace Tests\Feature\Controllers;

use App\Http\Controllers\PublicationController;
use Tests\TestCase;

class PublicationControllerTest extends TestCase
{
    public function test_controller_methods_exist()
    {
        $methods = [
            'addPublication',
            'addEventPublication',
            'listAllPublications',
            'listDraftPublications',
            'listPublishedPublications',
            'listFilteredPublications',
            'getPublicationById',
            'updatePublication',
            'deletePublication',
            'addPublicationInterests',
            'removePublicationInterests',
            'getPublicationInterests',
            'setPublicationImage',
            'grantPublicationAccess',
            'revokePublicationAccess',
            'getUsersWithAccess',
        ];
        foreach ($methods as $m) {
            $this->assertTrue(method_exists(PublicationController::class, $m));
        }
    }

    public function test_publication_routes_registered()
    {
        $routes = app('router')->getRoutes();
        $needles = [
            '/publication',
            '/publication/all',
            '/publication/draft',
            '/publication/active',
            '/publication/filter',
            '/publication/{publicationId}',
            '/publication/{publicationId}/interests',
            '/publication/{publicationId}/access',
        ];
        $uris = array_map(fn($r) => '/' . ltrim($r->uri(), '/'), iterator_to_array($routes));
        foreach ($needles as $n) {
            $this->assertTrue(collect($uris)->contains(fn($u) => str_contains($u, $n)), "Route {$n} should exist");
        }
    }
}
