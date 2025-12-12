<?php

namespace App\Services\Contracts;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface UserServiceInterface
{
    /**
     * Toggle the user's role.
     *
     * @param int $userID
     * @param string $newRole
     * @return string The new role.
     */
    public function toggleRole(int $userID, string $newRole): string;

    /**
     * List users based on filters.
     *
     * @param array $filters
     * @param int $perPage
     * @return LengthAwarePaginator<int, User>
     */
    public function listFilteredUsers(array $filters, int $perPage = 15): LengthAwarePaginator;

    /**
     * List inactive (soft-deleted) users.
     *
     * @param int $perPage
     * @return LengthAwarePaginator<int, User>
     */
    public function listInactiveUsers(int $perPage = 15): LengthAwarePaginator;

    /**
     * List all active users.
     *
     * @return Collection<int, User>
     */
    public function listActiveUsers(): Collection;

    /**
     * Get a specific user by ID.
     *
     * @param int $userId
     * @return User
     */
    public function getUserById(int $userId): User;
}
