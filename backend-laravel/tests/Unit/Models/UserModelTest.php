<?php

namespace Tests\Unit\Models;

use App\Models\User;
use Tests\TestCase;

class UserModelTest extends TestCase
{
    public function test_model_instantiation_without_db()
    {
        $user = new User(['name' => 'John Doe', 'email' => 'john@example.com', 'role' => 'interested']);
        $this->assertInstanceOf(User::class, $user);
        $this->assertEquals('John Doe', $user->getAttribute('name'));
        $this->assertEquals('john@example.com', $user->getAttribute('email'));
        $this->assertEquals('interested', $user->getAttribute('role'));
    }

    public function test_fillable_property_defined()
    {
        $ref = new \ReflectionClass(User::class);
        $this->assertTrue($ref->hasProperty('fillable'));
    }

    public function test_base_model_methods_exist()
    {
        $methods = ['save', 'delete', 'toArray', 'getAttribute', 'setAttribute'];
        foreach ($methods as $m) {
            $this->assertTrue(method_exists(User::class, $m));
        }
    }

    public function test_role_accessor_and_mutator_exist()
    {
        $this->assertTrue(method_exists(User::class, 'getRoleAttribute'));
        $this->assertTrue(method_exists(User::class, 'setRoleAttribute'));
    }

    public function test_profile_relationship_method_exists()
    {
        $this->assertTrue(method_exists(User::class, 'profile'));
    }

    public function test_to_string_contains_user_name()
    {
        $user = new User(['name' => 'Test User', 'email' => 'x@y.z']);
        $toString = (string) $user;
        $this->assertStringContainsString('Test User', $toString);
    }
}
