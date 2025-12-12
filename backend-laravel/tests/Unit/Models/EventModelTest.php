<?php

namespace Tests\Unit\Models;

use App\Models\Event;
use Tests\TestCase;

class EventModelTest extends TestCase
{
    public function test_model_instantiation_without_db()
    {
        $event = new Event([
            'name' => 'Test Event',
            'description' => 'Test Description',
            'event_type' => 'workshop',
            'modality' => 'online',
            'location' => 'Building A, Room 101',
            'virtual_url' => 'https://zoom.us/j/123456789',
            'status' => 'active',
            'capacity' => 100,
            'enrolled_participants' => 0,
        ]);
        $this->assertInstanceOf(Event::class, $event);
        $this->assertEquals('Test Event', $event->getAttribute('name'));
        $this->assertEquals('workshop', $event->getAttribute('event_type'));
        $this->assertEquals('online', $event->getAttribute('modality'));
        $this->assertEquals('https://zoom.us/j/123456789', $event->getAttribute('virtual_url'));
    }

    public function test_fillable_property_defined()
    {
        $ref = new \ReflectionClass(Event::class);
        $this->assertTrue($ref->hasProperty('fillable'));
    }

    public function test_publication_relationship_method_exists()
    {
        $this->assertTrue(method_exists(Event::class, 'publication'));
    }

    public function test_to_string_contains_event_name()
    {
        $event = new Event(['name' => 'Test Event']);
        $toString = (string) $event;
        $this->assertStringContainsString('Test Event', $toString);
    }
}
