<?php

namespace Tests\Unit\Existence;

use Tests\TestCase;

class ControllersExistenceTest extends TestCase
{
    public function test_article_controller_exists() { $this->assertTrue(class_exists(\App\Http\Controllers\ArticleController::class)); }
    public function test_auth_controller_exists() { $this->assertTrue(class_exists(\App\Http\Controllers\AuthController::class)); }
    public function test_certificate_controller_exists() { $this->assertTrue(class_exists(\App\Http\Controllers\CertificateController::class)); }
    public function test_event_controller_exists() { $this->assertTrue(class_exists(\App\Http\Controllers\EventController::class)); }
    public function test_external_event_controller_exists() { $this->assertTrue(class_exists(\App\Http\Controllers\ExternalEventController::class)); }
    public function test_interest_controller_exists() { $this->assertTrue(class_exists(\App\Http\Controllers\InterestController::class)); }
    public function test_notification_controller_exists() { $this->assertTrue(class_exists(\App\Http\Controllers\NotificationController::class)); }
    public function test_profile_controller_exists() { $this->assertTrue(class_exists(\App\Http\Controllers\ProfileController::class)); }
    public function test_publication_controller_exists() { $this->assertTrue(class_exists(\App\Http\Controllers\PublicationController::class)); }
    public function test_trusted_org_controller_exists() { $this->assertTrue(class_exists(\App\Http\Controllers\TrustedOrgController::class)); }
    public function test_user_controller_exists() { $this->assertTrue(class_exists(\App\Http\Controllers\UserController::class)); }
}
