<?php

namespace Tests\Unit\Models;

use App\Models\Notification;
use Tests\TestCase;

class NotificationModelTest extends TestCase
{
    public function test_model_instantiation_without_db()
    {
        $notif = new Notification([
            'id' => 'abc',
            'user_id' => 1,
            'title' => 'Test Notification',
            'message' => 'Hello',
            'type' => 'info',
            'data' => ['k' => 'v'],
            'status' => 'new',
        ]);
        $this->assertInstanceOf(Notification::class, $notif);
        $this->assertEquals('abc', $notif->getAttribute('id'));
        $this->assertEquals('Test Notification', $notif->getAttribute('title'));
        $this->assertIsArray($notif->getAttribute('data'));
    }

    public function test_fillable_property_defined()
    {
        $ref = new \ReflectionClass(Notification::class);
        $this->assertTrue($ref->hasProperty('fillable'));
    }

    public function test_user_relationship_method_exists()
    {
        $this->assertTrue(method_exists(Notification::class, 'user'));
    }
}
