<?php

namespace App\Repositories\Implementations;

use App\Models\Certificate;
use App\Repositories\Contracts\CertificateRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CertificateRepository implements CertificateRepositoryInterface
{
    public function create(array $data): Certificate
    {
        return Certificate::query()->create($data);
    }

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

    public function findById(int $id): ?Certificate
    {
        return Certificate::query()->find($id);
    }

    public function findByUserId(int $userId): Collection
    {
        return Certificate::query()
            ->where('user_id', $userId)
            ->where('deleted', false)
            ->orderByDesc('issue_date')
            ->get();
    }

    public function findAll(): Collection
    {
        return Certificate::query()
            ->where('deleted', false)
            ->orderByDesc('issue_date')
            ->get();
    }

    public function findByDateRange(string $startDate, string $endDate): Collection
    {
        return Certificate::query()
            ->whereBetween('issue_date', [$startDate, $endDate])
            ->where('deleted', false)
            ->orderBy('issue_date')
            ->get();
    }

    public function softDelete(int $id): void
    {
        $certificate = Certificate::query()->find($id);
        if (!$certificate) {
            throw new ModelNotFoundException('The specified certificate does not exist.');
        }

        $certificate->update(['deleted' => true]);
    }
}
