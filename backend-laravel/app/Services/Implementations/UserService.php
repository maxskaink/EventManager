<?php

namespace App\Services\Implementations;

use App\Exceptions\InvalidRoleException;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Services\Contracts\UserServiceInterface;
use Illuminate\Database\Eloquent\Collection;
use PharIo\Manifest\InvalidEmailException;

class UserService implements UserServiceInterface
{
    public function __construct(protected UserRepositoryInterface $userRepo) {}

    public function toggleRole(int $userID, string $newRole): string
    {
        $validRoles = ['interested', 'active-member', 'seed', 'coordinator', 'mentor'];
        if (!in_array($newRole, $validRoles)) {
            throw new InvalidRoleException("Invalid role: {$newRole}");
        }

        $user = $this->userRepo->findById($userID);
        if (!$user) {
            throw new \Exception("User with ID $userID not found.");
        }

        $requiresUnicaucaEmail = in_array($newRole, ['seed', 'coordinator', 'mentor']);
        if ($requiresUnicaucaEmail && !str_ends_with($user->email, '@unicauca.edu.co')) {
            throw new InvalidEmailException("Only users with a @unicauca.edu.co email can be assigned the role '{$newRole}'.");
        }

        $this->userRepo->updateRole($userID, $newRole);
        return $newRole;
    }

    public function listActiveUsers(): Collection
    {
        return $this->userRepo->listByRole();
    }

    public function listActiveInterested(): Collection
    {
        return $this->userRepo->listByRole('interested');
    }

    public function listActiveMembers(): Collection
    {
        return $this->userRepo->listByRole('active-member');
    }

    public function listActiveSeeds(): Collection
    {
        return $this->userRepo->listByRole('active-seeds');
    }

    public function listActiveCoordinators(): Collection
    {
        return $this->userRepo->listByRole('coordinator');
    }

    public function listActiveMentors(): Collection
    {
        return $this->userRepo->listByRole('mentor');
    }

    public function listInactiveUsers(): Collection
    {
        return $this->userRepo->listInactive();
    }
}
