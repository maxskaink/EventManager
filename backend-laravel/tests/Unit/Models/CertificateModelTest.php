<?php

namespace Tests\Unit\Models;

use App\Models\Certificate;
use Tests\TestCase;

class CertificateModelTest extends TestCase
{
    public function test_model_instantiation_without_db()
    {
        $cert = new Certificate([
            'user_id' => 1,
            'name' => 'Test Certificate',
            'issuing_organization' => 'Org',
            'credential_id' => 'ABC123',
            'credential_url' => 'https://example.com',
            'does_not_expire' => true,
        ]);
        $this->assertInstanceOf(Certificate::class, $cert);
        $this->assertEquals('Test Certificate', $cert->getAttribute('name'));
        $this->assertTrue($cert->getAttribute('does_not_expire'));
    }

    public function test_fillable_property_defined()
    {
        $ref = new \ReflectionClass(Certificate::class);
        $this->assertTrue($ref->hasProperty('fillable'));
    }

    public function test_user_relationship_and_to_string_exist()
    {
        $this->assertTrue(method_exists(Certificate::class, 'user'));
        $this->assertTrue(method_exists(Certificate::class, '__toString'));
        $cert = new Certificate(['name' => 'X']);
        $this->assertStringContainsString('Certificate', (string) $cert);
    }
}
