<?php

namespace App\Repositories\Implementations;

use App\Models\Profile;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class UserRepository implements UserRepositoryInterface
{
    public function getUsersByRoles(array $roles): Collection
    {
        return User::query()
            ->whereIn('role', $roles)
            ->get();
    }

    public function getUsersByIds(array $userIds): Collection
    {
        return User::query()
            ->whereIn('id', $userIds)
            ->get();
    }

    public function getUserInterestIds(int $userId): array
    {
        return Profile::query()
            ->where('user_id', $userId)
            ->firstOrFail()
            ->interests()
            ->pluck('interests.id')
            ->toArray();
    }

    public function findById(int $id): ?User
    {
        return User::query()->find($id);
    }

    public function updateRole(int $id, string $role): User
    {
        $user = $this->findById($id);
        $user->role = $role;
        $user->save();
        return $user;
    }

    public function listByRole(?string $role = null, bool $onlyActive = true): Collection
    {
        $query = User::query();
        if ($onlyActive) {
            $query->whereNull('deleted_at');
        }
        if ($role) {
            $query->where('role', $role);
        }
        return $query->orderBy('name')->get();
    }

    public function listInactive(): Collection
    {
        return User::onlyTrashed()->orderBy('deleted_at', 'desc')->get();
    }
}
