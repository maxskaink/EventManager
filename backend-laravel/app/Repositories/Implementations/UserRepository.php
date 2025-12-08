<?php

namespace App\Repositories\Implementations;

use App\Models\Profile;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class UserRepository implements UserRepositoryInterface
{
    /**
     * {@inheritDoc}
     */
    public function getUsersByRoles(array $roles): Collection
    {
        return User::query()
            ->whereIn('role', $roles)
            ->get();
    }

    /**
     * {@inheritDoc}
     */
    public function getUsersByIds(array $userIds): Collection
    {
        return User::query()
            ->whereIn('id', $userIds)
            ->get();
    }

    /**
     * {@inheritDoc}
     */
    public function getUserInterestIds(int $userId): array
    {
        // Retrieve the IDs of interests associated with the user's profile.
        return Profile::query()
            ->where('user_id', $userId)
            ->firstOrFail()
            ->interests()
            ->pluck('interests.id')
            ->toArray();
    }

    /**
     * {@inheritDoc}
     */
    public function findById(int $id): ?User
    {
        return User::query()->find($id);
    }

    /**
     * {@inheritDoc}
     */
    public function updateRole(int $id, string $role): User
    {
        $user = $this->findById($id);

        // Update role and save.
        $user->role = $role;
        $user->save();

        return $user;
    }

    /**
     * {@inheritDoc}
     */
    public function listFiltered(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = User::query();

        // Filter by role.
        if (!empty($filters['role'])) {
            $query->where('role', $filters['role']);
        }

        // Search by name or email.
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('email', 'like', '%' . $filters['search'] . '%');
            });
        }

        return $query->orderBy('name')->paginate($perPage);
    }

    /**
     * {@inheritDoc}
     */
    public function listInactive(int $perPage = 15): LengthAwarePaginator
    {
        // List soft-deleted users.
        return User::onlyTrashed()->orderBy('deleted_at', 'desc')->paginate($perPage);
    }

}
