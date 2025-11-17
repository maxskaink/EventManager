<?php

namespace App\Repositories\Contracts;

use App\Models\Certificate;
use Illuminate\Database\Eloquent\Collection;

interface CertificateRepositoryInterface
{
    public function create(array $data): Certificate;
    public function update(int $id, array $data): Certificate;
    public function findById(int $id): ?Certificate;
    public function findByUserId(int $userId): Collection;
    public function findAll(): Collection;
    public function findByDateRange(string $startDate, string $endDate): Collection;
    public function softDelete(int $id): void;
}
