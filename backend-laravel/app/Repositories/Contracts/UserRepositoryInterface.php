<?php

namespace App\Repositories\Contracts;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

interface UserRepositoryInterface
{
    public function getUsersByRoles(array $roles): Collection;
    public function getUsersByIds(array $userIds): Collection;
    public function getUserInterestIds(int $userId): array;

    public function findById(int $id): ?User;

    public function updateRole(int $id, string $role): User;

    public function listByRole(?string $role = null, bool $onlyActive = true): Collection;

    public function listInactive(): Collection;
}
