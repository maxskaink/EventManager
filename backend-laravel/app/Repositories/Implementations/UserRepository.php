<?php

namespace App\Repositories\Implementations;

use App\Models\Profile;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
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

    public function listFiltered(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = User::query();

        if (!empty($filters['role'])) {
            $query->where('role', $filters['role']);
        }

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('email', 'like', '%' . $filters['search'] . '%');
            });
        }

        return $query->orderBy('name')->paginate($perPage);
    }

    public function listInactive(int $perPage = 15): LengthAwarePaginator
    {
        return User::onlyTrashed()->orderBy('deleted_at', 'desc')->paginate($perPage);
    }

}
