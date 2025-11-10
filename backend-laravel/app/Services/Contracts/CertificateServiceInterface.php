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
     * @return Collection<int, Certificate>
     */


    /**
     * @param int $userId
     * @return Collection<int, Certificate>
     */
    public function getCertificatesByUser(int $userId): Collection;

    /**
     * @return Collection<int, Certificate>
     */
    public function getAllCertificates(): Collection;

    /**
     * @param string $startDate
     * @param string $endDate
     * @return Collection<int, Certificate>
     */
    public function getCertificatesByDateRange(string $startDate, string $endDate): Collection;

    public function deleteCertificate(int $certificateId): void;

    public function getAllTrustedOrganizations() : array;
}
