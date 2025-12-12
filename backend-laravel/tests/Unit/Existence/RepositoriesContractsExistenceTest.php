<?php

namespace Tests\Unit\Existence;

use Tests\TestCase;

class RepositoriesContractsExistenceTest extends TestCase
{
    private function assertContractOrImplementation(string $contractFqn, string $implementationFqn)
    {
        $exists = class_exists($contractFqn) || class_exists($implementationFqn);
        $this->assertTrue($exists);
    }

    public function test_article_repo_interface_exists() { $this->assertContractOrImplementation(\App\Repositories\Contracts\ArticleRepositoryInterface::class, \App\Repositories\Implementations\ArticleRepository::class); }
    public function test_auth_repo_interface_exists() { $this->assertContractOrImplementation(\App\Repositories\Contracts\AuthRepositoryInterface::class, \App\Repositories\Implementations\AuthRepository::class); }
    public function test_certificate_repo_interface_exists() { $this->assertContractOrImplementation(\App\Repositories\Contracts\CertificateRepositoryInterface::class, \App\Repositories\Implementations\CertificateRepository::class); }
    public function test_event_repo_interface_exists() { $this->assertContractOrImplementation(\App\Repositories\Contracts\EventRepositoryInterface::class, \App\Repositories\Implementations\EventRepository::class); }
    public function test_external_event_repo_interface_exists() { $this->assertContractOrImplementation(\App\Repositories\Contracts\ExternalEventRepositoryInterface::class, \App\Repositories\Implementations\ExternalEventRepository::class); }
    public function test_interest_repo_interface_exists() { $this->assertContractOrImplementation(\App\Repositories\Contracts\InterestRepositoryInterface::class, \App\Repositories\Implementations\InterestRepository::class); }
    public function test_notification_repo_interface_exists() { $this->assertContractOrImplementation(\App\Repositories\Contracts\NotificationRepositoryInterface::class, \App\Repositories\Implementations\NotificationRepository::class); }
    public function test_participation_repo_interface_exists() { $this->assertContractOrImplementation(\App\Repositories\Contracts\ParticipationRepositoryInterface::class, \App\Repositories\Implementations\ParticipationRepository::class); }
    public function test_profile_repo_interface_exists() { $this->assertContractOrImplementation(\App\Repositories\Contracts\ProfileRepositoryInterface::class, \App\Repositories\Implementations\ProfileRepository::class); }
    public function test_publication_access_repo_interface_exists() { $this->assertContractOrImplementation(\App\Repositories\Contracts\PublicationAccessRepositoryInterface::class, \App\Repositories\Implementations\PublicationAccessRepository::class); }
    public function test_publication_interest_repo_interface_exists() { $this->assertContractOrImplementation(\App\Repositories\Contracts\PublicationInterestRepositoryInterface::class, \App\Repositories\Implementations\PublicationInterestRepository::class); }
    public function test_publication_repo_interface_exists() { $this->assertContractOrImplementation(\App\Repositories\Contracts\PublicationRepositoryInterface::class, \App\Repositories\Implementations\PublicationRepository::class); }
    public function test_trusted_org_repo_interface_exists() { $this->assertContractOrImplementation(\App\Repositories\Contracts\TrustedOrgRepositoryInterface::class, \App\Repositories\Implementations\TrustedOrgRepository::class); }
    public function test_user_repo_interface_exists() { $this->assertContractOrImplementation(\App\Repositories\Contracts\UserRepositoryInterface::class, \App\Repositories\Implementations\UserRepository::class); }
}
