<?php

namespace Tests\Unit\Existence;

use Tests\TestCase;

class RepositoriesImplementationsExistenceTest extends TestCase
{
    public function test_article_repo_implementation_exists() { $this->assertTrue(class_exists(\App\Repositories\Implementations\ArticleRepository::class)); }
    public function test_auth_repo_implementation_exists() { $this->assertTrue(class_exists(\App\Repositories\Implementations\AuthRepository::class)); }
    public function test_certificate_repo_implementation_exists() { $this->assertTrue(class_exists(\App\Repositories\Implementations\CertificateRepository::class)); }
    public function test_event_repo_implementation_exists() { $this->assertTrue(class_exists(\App\Repositories\Implementations\EventRepository::class)); }
    public function test_external_event_repo_implementation_exists() { $this->assertTrue(class_exists(\App\Repositories\Implementations\ExternalEventRepository::class)); }
    public function test_interest_repo_implementation_exists() { $this->assertTrue(class_exists(\App\Repositories\Implementations\InterestRepository::class)); }
    public function test_notification_repo_implementation_exists() { $this->assertTrue(class_exists(\App\Repositories\Implementations\NotificationRepository::class)); }
    public function test_participation_repo_implementation_exists() { $this->assertTrue(class_exists(\App\Repositories\Implementations\ParticipationRepository::class)); }
    public function test_profile_repo_implementation_exists() { $this->assertTrue(class_exists(\App\Repositories\Implementations\ProfileRepository::class)); }
    public function test_publication_access_repo_implementation_exists() { $this->assertTrue(class_exists(\App\Repositories\Implementations\PublicationAccessRepository::class)); }
    public function test_publication_interest_repo_implementation_exists() { $this->assertTrue(class_exists(\App\Repositories\Implementations\PublicationInterestRepository::class)); }
    public function test_publication_repo_implementation_exists() { $this->assertTrue(class_exists(\App\Repositories\Implementations\PublicationRepository::class)); }
    public function test_trusted_org_repo_implementation_exists() { $this->assertTrue(class_exists(\App\Repositories\Implementations\TrustedOrgRepository::class)); }
    public function test_user_repo_implementation_exists() { $this->assertTrue(class_exists(\App\Repositories\Implementations\UserRepository::class)); }
}
