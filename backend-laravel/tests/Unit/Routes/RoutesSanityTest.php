<?php

namespace Tests\Unit\Routes;

use Tests\TestCase;

class RoutesSanityTest extends TestCase
{
    public function test_router_has_many_routes()
    {
        $routes = app('router')->getRoutes();
        $this->assertGreaterThan(10, count($routes));
    }

    public function test_api_route_prefixes_exist()
    {
        $routes = collect(iterator_to_array(app('router')->getRoutes()))->map(fn($r) => '/' . ltrim($r->uri(), '/'));
        $this->assertTrue($routes->contains(fn($u) => str_contains($u, '/event')));
        $this->assertTrue($routes->contains(fn($u) => str_contains($u, '/publication')));
        $this->assertTrue($routes->contains(fn($u) => str_contains($u, '/profile')));
        $this->assertTrue($routes->contains(fn($u) => str_contains($u, '/article')));
        $this->assertTrue($routes->contains(fn($u) => str_contains($u, '/certificate')));
        $this->assertTrue($routes->contains(fn($u) => str_contains($u, '/trusted-org')));
        $this->assertTrue($routes->contains(fn($u) => str_contains($u, '/external-event')));
    }
}
