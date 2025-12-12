<?php

namespace Tests\Feature\Controllers;

use App\Http\Controllers\CertificateController;
use Tests\TestCase;

class CertificateControllerTest extends TestCase
{
    public function test_controller_methods_exist()
    {
        $methods = [
            'addCertificate',
            'updateCertificate',
            'deleteCertificate',
            'listMyCertificates',
            'listCertificatesByUser',
            'listAllCertificates',
            'listCertificatesByDateRange',
            'getAllTrustedOrganizations',
        ];
        foreach ($methods as $m) {
            $this->assertTrue(method_exists(CertificateController::class, $m));
        }
    }

    public function test_certificate_routes_registered()
    {
        $routes = app('router')->getRoutes();
        $needles = [
            '/certificate',
            '/certificate/all',
            '/certificate/my',
            '/certificate/user/{userId}',
            '/certificate/date-range',
        ];
        $uris = array_map(fn($r) => '/' . ltrim($r->uri(), '/'), iterator_to_array($routes));
        foreach ($needles as $n) {
            $this->assertTrue(collect($uris)->contains(fn($u) => str_contains($u, $n)), "Route {$n} should exist");
        }
    }
}
