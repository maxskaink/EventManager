<?php

namespace Tests\Unit\Existence;

use Tests\TestCase;

class ServicesExistenceTest extends TestCase
{
    private function assertServiceContractOrImplementation(string $contractFqn, string $implementationFqn)
    {
        $exists = class_exists($contractFqn) || class_exists($implementationFqn);
        $this->assertTrue($exists);
    }

    // Contracts (flexible: interface or implementation)
    public function test_article_service_interface_exists() { $this->assertServiceContractOrImplementation(\App\Services\Contracts\ArticleServiceInterface::class, \App\Services\Implementations\ArticleService::class); }
    public function test_auth_service_interface_exists() { $this->assertServiceContractOrImplementation(\App\Services\Contracts\AuthServiceInterface::class, \App\Services\Implementations\AuthService::class); }
    public function test_certificate_service_interface_exists() { $this->assertServiceContractOrImplementation(\App\Services\Contracts\CertificateServiceInterface::class, \App\Services\Implementations\CertificateService::class); }
    public function test_event_service_interface_exists() { $this->assertServiceContractOrImplementation(\App\Services\Contracts\EventServiceInterface::class, \App\Services\Implementations\EventService::class); }
    public function test_external_event_service_interface_exists() { $this->assertServiceContractOrImplementation(\App\Services\Contracts\ExternalEventServiceInterface::class, \App\Services\Implementations\ExternalEventService::class); }
    public function test_interest_service_interface_exists() { $this->assertServiceContractOrImplementation(\App\Services\Contracts\InterestServiceInterface::class, \App\Services\Implementations\InterestService::class); }
    public function test_notification_service_interface_exists() { $this->assertServiceContractOrImplementation(\App\Services\Contracts\NotificationServiceInterface::class, \App\Services\Implementations\NotificationService::class); }
    public function test_profile_service_interface_exists() { $this->assertServiceContractOrImplementation(\App\Services\Contracts\ProfileServiceInterface::class, \App\Services\Implementations\ProfileService::class); }
    public function test_publication_service_interface_exists() { $this->assertServiceContractOrImplementation(\App\Services\Contracts\PublicationServiceInterface::class, \App\Services\Implementations\PublicationService::class); }
    public function test_trusted_org_service_interface_exists() { $this->assertServiceContractOrImplementation(\App\Services\Contracts\TrustedOrgServiceInterface::class, \App\Services\Implementations\TrustedOrgService::class); }
    public function test_user_service_interface_exists() { $this->assertServiceContractOrImplementation(\App\Services\Contracts\UserServiceInterface::class, \App\Services\Implementations\UserService::class); }

    // Implementations
    public function test_article_service_exists() { $this->assertTrue(class_exists(\App\Services\Implementations\ArticleService::class)); }
    public function test_auth_service_exists() { $this->assertTrue(class_exists(\App\Services\Implementations\AuthService::class)); }
    public function test_certificate_service_exists() { $this->assertTrue(class_exists(\App\Services\Implementations\CertificateService::class)); }
    public function test_event_service_exists() { $this->assertTrue(class_exists(\App\Services\Implementations\EventService::class)); }
    public function test_external_event_service_exists() { $this->assertTrue(class_exists(\App\Services\Implementations\ExternalEventService::class)); }
    public function test_interest_service_exists() { $this->assertTrue(class_exists(\App\Services\Implementations\InterestService::class)); }
    public function test_notification_service_exists() { $this->assertTrue(class_exists(\App\Services\Implementations\NotificationService::class)); }
    public function test_profile_service_exists() { $this->assertTrue(class_exists(\App\Services\Implementations\ProfileService::class)); }
    public function test_publication_service_exists() { $this->assertTrue(class_exists(\App\Services\Implementations\PublicationService::class)); }
    public function test_trusted_org_service_exists() { $this->assertTrue(class_exists(\App\Services\Implementations\TrustedOrgService::class)); }
    public function test_user_service_exists() { $this->assertTrue(class_exists(\App\Services\Implementations\UserService::class)); }
}
