<?php

namespace Tests\Unit\Existence;

use Tests\TestCase;

class PoliciesExistenceTest extends TestCase
{
    public function test_article_policy_exists() { $this->assertTrue(class_exists(\App\Policies\ArticlePolicy::class)); }
    public function test_certificate_policy_exists() { $this->assertTrue(class_exists(\App\Policies\CertificatePolicy::class)); }
    public function test_event_policy_exists() { $this->assertTrue(class_exists(\App\Policies\EventPolicy::class)); }
    public function test_external_event_policy_exists() { $this->assertTrue(class_exists(\App\Policies\ExternalEventPolicy::class)); }
    public function test_interest_policy_exists() { $this->assertTrue(class_exists(\App\Policies\InterestPolicy::class)); }
    public function test_notification_policy_exists() { $this->assertTrue(class_exists(\App\Policies\NotificationPolicy::class)); }
    public function test_profile_policy_exists() { $this->assertTrue(class_exists(\App\Policies\ProfilePolicy::class)); }
    public function test_publication_policy_exists() { $this->assertTrue(class_exists(\App\Policies\PublicationPolicy::class)); }
    public function test_trusted_org_policy_exists() { $this->assertTrue(class_exists(\App\Policies\TrustedOrgPolicy::class)); }
    public function test_user_policy_exists() { $this->assertTrue(class_exists(\App\Policies\UserPolicy::class)); }
}
