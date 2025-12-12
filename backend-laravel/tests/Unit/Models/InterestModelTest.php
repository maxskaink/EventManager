<?php

namespace Tests\Unit\Models;

use App\Models\Interest;
use Tests\TestCase;

class InterestModelTest extends TestCase
{
    public function test_model_instantiation_without_db()
    {
        $interest = new Interest(['keyword' => 'Technology']);
        $this->assertInstanceOf(Interest::class, $interest);
        $this->assertEquals('Technology', $interest->getAttribute('keyword'));
    }

    public function test_fillable_property_defined()
    {
        $ref = new \ReflectionClass(Interest::class);
        $this->assertTrue($ref->hasProperty('fillable'));
    }

    public function test_to_string_contains_keyword()
    {
        $interest = new Interest(['keyword' => 'Tech']);
        $this->assertStringContainsString('Interest #', (string) $interest);
        $this->assertStringContainsString('Tech', (string) $interest);
    }
}
