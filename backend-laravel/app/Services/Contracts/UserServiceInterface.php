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

    public function listFilteredUsers(array $filters, int $perPage = 15): LengthAwarePaginator;

    public function listInactiveUsers(int $perPage = 15): LengthAwarePaginator;

    public function getUserById(int $userId): User;
}
