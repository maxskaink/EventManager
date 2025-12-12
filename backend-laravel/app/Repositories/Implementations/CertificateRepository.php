<?php

namespace App\Repositories\Implementations;

use App\Models\Certificate;
use App\Repositories\Contracts\CertificateRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CertificateRepository implements CertificateRepositoryInterface
{
    /**
     * {@inheritDoc}
     */
    public function create(array $data): Certificate
    {
        return Certificate::query()->create($data);
    }

    /**
     * {@inheritDoc}
     */
    public function update(int $id, array $data): Certificate
    {
        $certificate = Certificate::query()->find($id);
        if (!$certificate) {
            throw new ModelNotFoundException('The specified certificate does not exist.');
        }

        $certificate->fill($data);
        $certificate->save();

        return $certificate;
    }

    /**
     * {@inheritDoc}
     */
    public function findById(int $id): ?Certificate
    {
        return Certificate::query()->find($id);
    }

    /**
     * {@inheritDoc}
     */
    public function findByUserId(int $userId): Collection
    {
        // Retrieve non-deleted certificates for a user, ordered by issue date.
        return Certificate::query()
            ->where('user_id', $userId)
            ->where('deleted', false)
            ->orderByDesc('issue_date')
            ->get();
    }

    /**
     * {@inheritDoc}
     */
    public function findAll(): Collection
    {
        // Retrieve all non-deleted certificates.
        return Certificate::query()
            ->where('deleted', false)
            ->orderByDesc('issue_date')
            ->get();
    }

    /**
     * {@inheritDoc}
     */
    public function findByDateRange(string $startDate, string $endDate): Collection
    {
        // Filter certificates by issue date range.
        return Certificate::query()
            ->whereBetween('issue_date', [$startDate, $endDate])
            ->where('deleted', false)
            ->orderBy('issue_date')
            ->get();
    }

    /**
     * {@inheritDoc}
     */
    public function softDelete(int $id): void
    {
        $certificate = Certificate::query()->find($id);
        if (!$certificate) {
            throw new ModelNotFoundException('The specified certificate does not exist.');
        }

        // Perform a soft delete by setting the 'deleted' flag.
        $certificate->update(['deleted' => true]);
    }
}
