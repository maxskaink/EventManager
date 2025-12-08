<?php

namespace App\Repositories\Contracts;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface UserRepositoryInterface
{
    /**
     * Get users by their roles.
     *
     * @param array $roles
     * @return Collection<int, User>
     */
    public function getUsersByRoles(array $roles): Collection;

    /**
     * Get users by their IDs.
     *
     * @param array $userIds
     * @return Collection<int, User>
     */
    public function getUsersByIds(array $userIds): Collection;

    /**
     * Get interest IDs associated with a user.
     *
     * @param int $userId
     * @return array
     */
    public function getUserInterestIds(int $userId): array;

    /**
     * Find a user by their ID.
     *
     * @param int $id
     * @return User|null
     */
    public function findById(int $id): ?User;

    /**
     * Update a user's role.
     *
     * @param int $id
     * @param string $role
     * @return User
     */
    public function updateRole(int $id, string $role): User;

    /**
     * List users based on filters with pagination.
     *
     * @param array $filters
     * @param int $perPage
     * @return LengthAwarePaginator<int, User>
     */
    public function listFiltered(array $filters, int $perPage = 15): LengthAwarePaginator;

    /**
     * List inactive users with pagination.
     *
     * @param int $perPage
     * @return LengthAwarePaginator<int, User>
     */
    public function listInactive(int $perPage = 15): LengthAwarePaginator;
}
