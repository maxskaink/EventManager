<?php

namespace Tests\Unit\Models;

use App\Models\Publication;
use Tests\TestCase;

class PublicationModelTest extends TestCase
{
    public function test_model_instantiation_without_db()
    {
        $pub = new Publication([
            'author_id' => 1,
            'title' => 'Test Publication',
            'content' => 'Lorem ipsum',
            'type' => 'note',
            'status' => 'active',
            'visibility' => 'public',
        ]);
        $this->assertInstanceOf(Publication::class, $pub);
        $this->assertEquals('Test Publication', $pub->getAttribute('title'));
        $this->assertEquals('note', $pub->getAttribute('type'));
    }

    public function test_fillable_property_defined()
    {
        $ref = new \ReflectionClass(Publication::class);
        $this->assertTrue($ref->hasProperty('fillable'));
    }

    public function test_relationship_methods_exist()
    {
        $this->assertTrue(method_exists(Publication::class, 'author'));
        $this->assertTrue(method_exists(Publication::class, 'event'));
        $this->assertTrue(method_exists(Publication::class, 'interests'));
    }

    public function test_to_string_contains_title()
    {
        $pub = new Publication(['title' => 'Test Publication']);
        $str = (string) $pub;
        $this->assertStringContainsString('Publication #', $str);
        $this->assertStringContainsString('Test Publication', $str);
    }
}
