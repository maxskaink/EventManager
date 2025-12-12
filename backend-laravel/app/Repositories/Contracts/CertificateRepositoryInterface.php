<?php

namespace App\Repositories\Contracts;

use App\Models\Certificate;
use Illuminate\Database\Eloquent\Collection;

interface CertificateRepositoryInterface
{
    /**
     * Create a new certificate.
     *
     * @param array $data
     * @return Certificate
     */
    public function create(array $data): Certificate;

    /**
     * Update an existing certificate.
     *
     * @param int $id
     * @param array $data
     * @return Certificate
     */
    public function update(int $id, array $data): Certificate;

    /**
     * Find a certificate by its ID.
     *
     * @param int $id
     * @return Certificate|null
     */
    public function findById(int $id): ?Certificate;

    /**
     * Find all certificates associated with a user.
     *
     * @param int $userId
     * @return Collection<int, Certificate>
     */
    public function findByUserId(int $userId): Collection;

    /**
     * Retrieve all certificates.
     *
     * @return Collection<int, Certificate>
     */
    public function findAll(): Collection;

    /**
     * Find certificates within a date range.
     *
     * @param string $startDate
     * @param string $endDate
     * @return Collection<int, Certificate>
     */
    public function findByDateRange(string $startDate, string $endDate): Collection;

    /**
     * Soft delete a certificate.
     *
     * @param int $id
     * @return void
     */
    public function softDelete(int $id): void;
}
