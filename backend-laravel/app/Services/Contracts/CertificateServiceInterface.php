<?php

namespace App\Services\Contracts;

use App\Models\Certificate;
use Illuminate\Database\Eloquent\Collection;

interface CertificateServiceInterface
{
    /**
     * Create and store a new certificate for a user.
     *
     * @param array $data
     * @return Certificate
     */
    public function addCertificate(array $data): Certificate;

    /**
     * Update an existing certificate.
     *
     * @param int $certificateId
     * @param array $data
     * @return Certificate
     */
    public function updateCertificate(int $certificateId, array $data): Certificate;

    /**
     * Get certificates for a specific user.
     *
     * @param int $userId
     * @return Collection<int, Certificate>
     */
    public function getCertificatesByUser(int $userId): Collection;

    /**
     * Get all certificates in the system.
     *
     * @return Collection<int, Certificate>
     */
    public function getAllCertificates(): Collection;

    /**
     * Get certificates issued within a date range.
     *
     * @param string $startDate
     * @param string $endDate
     * @return Collection<int, Certificate>
     */
    public function getCertificatesByDateRange(string $startDate, string $endDate): Collection;

    /**
     * Delete a certificate by its ID.
     *
     * @param int $certificateId
     * @return void
     */
    public function deleteCertificate(int $certificateId): void;

    /**
     * Get all trusted organizations.
     *
     * @return array<int, string>
     */
    public function getAllTrustedOrganizations(): array;
}
