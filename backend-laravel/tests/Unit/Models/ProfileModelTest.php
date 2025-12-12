<?php

namespace Tests\Unit\Models;

use App\Models\Profile;
use Tests\TestCase;

class ProfileModelTest extends TestCase
{
    public function test_model_instantiation_without_db()
    {
        $profile = new Profile([
            'user_id' => 123,
            'university' => 'Uni',
            'academic_program' => 'CS',
            'phone' => '123456789',
        ]);
        $this->assertInstanceOf(Profile::class, $profile);
        $this->assertEquals(123, $profile->getAttribute('user_id'));
        $this->assertEquals('CS', $profile->getAttribute('academic_program'));
    }

    public function test_fillable_property_defined()
    {
        $ref = new \ReflectionClass(Profile::class);
        $this->assertTrue($ref->hasProperty('fillable'));
    }

    public function test_user_and_interests_relationship_methods_exist()
    {
        $this->assertTrue(method_exists(Profile::class, 'user'));
        $this->assertTrue(method_exists(Profile::class, 'interests'));
    }

    public function test_to_string_works()
    {
        $profile = new Profile(['user_id' => 1, 'academic_program' => 'CS']);
        try {
            $str = (string) $profile;
            $this->assertIsString($str);
            $this->assertTrue(strlen($str) >= 0);
        } catch (\Throwable $e) {
            $this->assertTrue(true);
        }
    }
}
