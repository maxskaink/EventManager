<?php

namespace App\Repositories\Contracts;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface UserRepositoryInterface
{
    public function getUsersByRoles(array $roles): Collection;
    public function getUsersByIds(array $userIds): Collection;
    public function getUserInterestIds(int $userId): array;

    public function findById(int $id): ?User;

    public function updateRole(int $id, string $role): User;

    public function listFiltered(array $filters, int $perPage = 15): LengthAwarePaginator;

    public function listInactive(int $perPage = 15): LengthAwarePaginator;
}
