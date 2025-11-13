<?php

namespace App\Repositories\Contracts;

use App\Models\ExternalEvent;
use Illuminate\Database\Eloquent\Collection;

interface ExternalEventRepositoryInterface
{
    public function create(array $data): ExternalEvent;
    public function update(int $id, array $data): ExternalEvent;
    public function delete(int $id): void;

    public function findById(int $id): ?ExternalEvent;
    public function findDuplicate(int $userId, string $name, string $start, string $end): ?ExternalEvent;

    public function findByUserId(int $userId): Collection;
    public function findAll(): Collection;
    public function findBetweenDates(string $start, string $end): Collection;
    public function findByNameForUser(int $userId, string $name, ?int $excludeId = null): ?ExternalEvent;
}
