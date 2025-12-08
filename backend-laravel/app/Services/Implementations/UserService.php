<?php

namespace App\Services\Implementations;

use App\Exceptions\InvalidRoleException;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Services\Contracts\UserServiceInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use PharIo\Manifest\InvalidEmailException;

class UserService implements UserServiceInterface
{
    public function __construct(protected UserRepositoryInterface $userRepo)
    {
    }

    /**
     * {@inheritDoc}
     *
     * @throws InvalidRoleException
     * @throws InvalidEmailException
     * @throws \Exception
     */
    /**
     * {@inheritDoc}
     *
     * @throws InvalidRoleException
     * @throws InvalidEmailException
     * @throws \Exception
     */
    public function toggleRole(int $userID, string $newRole): string
    {
        // Validate against allowed roles
        $validRoles = ['interested', 'active-member', 'seed', 'coordinator', 'mentor'];
        if (!in_array($newRole, $validRoles)) {
            throw new InvalidRoleException("Invalid role: {$newRole}");
        }

        $user = $this->userRepo->findById($userID);
        if (!$user) {
            throw new \Exception("User with ID $userID not found.");
        }

        // Enforce email domain restriction for privileged roles
        $requiresUnicaucaEmail = in_array($newRole, ['seed', 'coordinator', 'mentor']);
        if ($requiresUnicaucaEmail && !str_ends_with($user->email, '@unicauca.edu.co')) {
            throw new InvalidEmailException("Only users with a @unicauca.edu.co email can be assigned the role '{$newRole}'.");
        }

        $this->userRepo->updateRole($userID, $newRole);
        return $newRole;
    }

    /**
     * {@inheritDoc}
     */
    public function listFilteredUsers(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        return $this->userRepo->listFiltered($filters, $perPage);
    }

    /**
     * {@inheritDoc}
     */
    public function listInactiveUsers(int $perPage = 15): LengthAwarePaginator
    {
        return $this->userRepo->listInactive($perPage);
    }

    /**
     * {@inheritDoc}
     */
    public function listActiveUsers(): Collection
    {
        return User::query()->get();
    }

    /**
     * {@inheritDoc}
     *
     * @throws \Exception
     */
    public function getUserById(int $userId): User
    {
        $user = $this->userRepo->findById($userId);

        if (!$user) {
            throw new \Exception("User with ID {$userId} not found.");
        }

        return $user;
    }

}
