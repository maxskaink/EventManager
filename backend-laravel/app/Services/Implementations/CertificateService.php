<?php

namespace App\Services\Implementations;

use App\Exceptions\DuplicatedResourceException;
use App\Models\Certificate;
use App\Models\User;
use App\Services\Contracts\CertificateServiceInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Carbon;
use InvalidArgumentException;

class CertificateService implements CertificateServiceInterface
{
    /**
     * Create and store a new certificate for a user.
     *
     * @param array $data
     * @return Certificate
     *
     * @throws DuplicatedResourceException
     * @throws ModelNotFoundException
     */
    public function addCertificate(array $data): Certificate
    {
        // Ensure the user exists
        $user = User::query()->find($data['user_id']);
        if (!$user) {
            throw new ModelNotFoundException('The specified user does not exist.');
        }

        // Check if a certificate with the same name already exists for this user
        $existingCertificate = Certificate::query()
            ->where('user_id', $data['user_id'])
            ->where('name', $data['name'])
            ->where('deleted', false)
            ->first();

        if ($existingCertificate) {
            throw new DuplicatedResourceException(
                "A certificate named '{$data['name']}' already exists for this user."
            );
        }

        $certificate = new Certificate();
        $certificate->fill($data);
        $certificate->save();

        return $certificate;
    }

    /**
     * Update an existing certificate.
     *
     * @param int $certificateId
     * @param array $data
     * @return Certificate
     *
     * @throws ModelNotFoundException
     * @throws DuplicatedResourceException
     */
    public function updateCertificate(int $certificateId, array $data): Certificate
    {
        // Find the certificate
        $certificate = Certificate::query()->find($certificateId);
        if (!$certificate) {
            throw new ModelNotFoundException('The specified certificate does not exist.');
        }

        // If user_id is being changed, verify existence
        if (isset($data['user_id'])) {
            $newUser = User::query()->find($data['user_id']);
            if (!$newUser) {
                throw new ModelNotFoundException('The specified user does not exist.');
            }
        }

        // Check for duplicate name if it was modified
        if (isset($data['name'])) {
            $duplicate = Certificate::query()
                ->where('user_id', $data['user_id'] ?? $certificate->user_id)
                ->where('name', $data['name'])
                ->where('id', '!=', $certificateId)
                ->where('deleted', false)
                ->first();

            if ($duplicate) {
                throw new DuplicatedResourceException(
                    "A certificate named '{$data['name']}' already exists for this user."
                );
            }
        }

        // Update fields safely
        $certificate->fill($data);
        $certificate->save();

        return $certificate;
    }

    /**
     * Get all certificates of a specific user.
     *
     * @param int $userId
     * @return Collection<int, Certificate>
     */
    public function getCertificatesByUser(int $userId): Collection
    {
        return Certificate::query()
            ->where('user_id', $userId)
            ->where('deleted', false)
            ->orderByDesc('issue_date')
            ->get();
    }

    /**
     * Get all certificates in the system.
     *
     * @return Collection<int, Certificate>
     */
    public function getAllCertificates(): Collection
    {
        return Certificate::query()
            ->where('deleted', false)
            ->orderByDesc('issue_date')
            ->get();
    }

    /**
     * Get all certificates issued within a specific date range.
     *
     * @param string $startDate  (format: Y-m-d)
     * @param string $endDate    (format: Y-m-d)
     * @return Collection<int, Certificate>
     *
     * @throws InvalidArgumentException
     */
    public function getCertificatesByDateRange(string $startDate, string $endDate): Collection
    {
        $start = Carbon::parse($startDate);
        $end = Carbon::parse($endDate);

        if ($end->isBefore($start)) {
            throw new InvalidArgumentException('The end date cannot be earlier than the start date.');
        }

        return Certificate::query()
            ->whereBetween('issue_date', [$start, $end])
            ->where('deleted', false)
            ->orderBy('issue_date')
            ->get();
    }

    /**
     * Delete an existing certificate.
     *
     * @param int $certificateId
     * @return void
     *
     * @throws ModelNotFoundException
     */
    public function deleteCertificate(int $certificateId): void
    {
        $certificate = Certificate::query()->find($certificateId);
        if (!$certificate) {
            throw new ModelNotFoundException('The specified certificate does not exist.');
        }

        $certificate->delete();
    }
}
