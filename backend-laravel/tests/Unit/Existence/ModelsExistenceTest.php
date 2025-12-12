<?php

namespace Tests\Unit\Existence;

use Tests\TestCase;

class ModelsExistenceTest extends TestCase
{
    public function test_article_model_exists() { $this->assertTrue(class_exists(\App\Models\Article::class)); }
    public function test_certificate_model_exists() { $this->assertTrue(class_exists(\App\Models\Certificate::class)); }
    public function test_event_model_exists() { $this->assertTrue(class_exists(\App\Models\Event::class)); }
    public function test_external_event_model_exists() { $this->assertTrue(class_exists(\App\Models\ExternalEvent::class)); }
    public function test_interest_model_exists() { $this->assertTrue(class_exists(\App\Models\Interest::class)); }
    public function test_notification_model_exists() { $this->assertTrue(class_exists(\App\Models\Notification::class)); }
    public function test_participation_model_exists() { $this->assertTrue(class_exists(\App\Models\Participation::class)); }
    public function test_profile_model_exists() { $this->assertTrue(class_exists(\App\Models\Profile::class)); }
    public function test_profile_interest_model_exists() { $this->assertTrue(class_exists(\App\Models\ProfileInterest::class)); }
    public function test_publication_model_exists() { $this->assertTrue(class_exists(\App\Models\Publication::class)); }
    public function test_publication_access_model_exists() { $this->assertTrue(class_exists(\App\Models\PublicationAccess::class)); }
    public function test_publication_interest_model_exists() { $this->assertTrue(class_exists(\App\Models\PublicationInterest::class)); }
    public function test_trusted_org_model_exists() { $this->assertTrue(class_exists(\App\Models\TrustedOrg::class)); }
    public function test_user_model_exists() { $this->assertTrue(class_exists(\App\Models\User::class)); }
}
