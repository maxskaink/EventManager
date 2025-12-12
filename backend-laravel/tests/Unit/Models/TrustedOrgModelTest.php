<?php

namespace Tests\Unit\Models;

use App\Models\TrustedOrg;
use Tests\TestCase;

class TrustedOrgModelTest extends TestCase
{
    public function test_model_instantiation_without_db()
    {
        $org = new TrustedOrg([
            'org' => 'example.org',
            'trusted_for_certificate' => true,
            'trusted_for_event' => false,
            'trusted_for_article' => true,
        ]);
        $this->assertInstanceOf(TrustedOrg::class, $org);
        $this->assertEquals('example.org', $org->getAttribute('org'));
        $this->assertTrue($org->getAttribute('trusted_for_certificate'));
    }

    public function test_fillable_property_defined()
    {
        $ref = new \ReflectionClass(TrustedOrg::class);
        $this->assertTrue($ref->hasProperty('fillable'));
    }

    public function test_scope_methods_exist()
    {
        $this->assertTrue(method_exists(TrustedOrg::class, 'scopeTrustedForCertificate'));
        $this->assertTrue(method_exists(TrustedOrg::class, 'scopeTrustedForEvent'));
        $this->assertTrue(method_exists(TrustedOrg::class, 'scopeTrustedForArticle'));
    }
}
