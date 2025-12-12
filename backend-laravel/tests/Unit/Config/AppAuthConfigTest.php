<?php

namespace Tests\Unit\Config;

use Tests\TestCase;

class AppAuthConfigTest extends TestCase
{
    public function test_app_name_config_present() { $this->assertNotEmpty(config('app.name')); }
    public function test_auth_guards_include_sanctum() { $this->assertArrayHasKey('sanctum', config('auth.guards')); }
    public function test_queue_default_config_present() { $this->assertNotEmpty(config('queue.default')); }
    public function test_mail_default_config_present() { $this->assertNotEmpty(config('mail.default')); }
    public function test_logging_channels_present() { $this->assertIsArray(config('logging.channels')); }
}
