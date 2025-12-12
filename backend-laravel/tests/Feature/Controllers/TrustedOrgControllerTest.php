<?php

namespace Tests\Feature\Controllers;

use App\Http\Controllers\TrustedOrgController;
use Tests\TestCase;

class TrustedOrgControllerTest extends TestCase
{
    public function test_controller_methods_exist()
    {
        $methods = [
            'addTrustedOrg',
            'listAllTrustedOrgs',
            'listTrustedOrgsByType',
            'updateTrustedOrg',
            'deleteTrustedOrg',
        ];
        foreach ($methods as $m) {
            $this->assertTrue(method_exists(TrustedOrgController::class, $m));
        }
    }

    public function test_trusted_org_routes_registered()
    {
        $routes = app('router')->getRoutes();
        $needles = [
            '/trusted-org',
            '/trusted-org/all',
            '/trusted-org/type/{type}',
            '/trusted-org/{trustedOrgId}',
        ];
        $uris = array_map(fn($r) => '/' . ltrim($r->uri(), '/'), iterator_to_array($routes));
        foreach ($needles as $n) {
            $this->assertTrue(collect($uris)->contains(fn($u) => str_contains($u, $n)), "Route {$n} should exist");
        }
    }
}
