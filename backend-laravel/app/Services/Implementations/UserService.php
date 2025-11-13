<?php

namespace App\Services\Implementations;

use App\Exceptions\InvalidRoleException;
use App\Models\User;
use App\Services\Contracts\UserServiceInterface;
use Illuminate\Database\Eloquent\Collection;
use PharIo\Manifest\InvalidEmailException;

class UserService implements UserServiceInterface
{
    /**
     * Toggle the user's role between 'interested', 'active-member', 'seed', 'coordinator', 'mentor'.
     *
     * @param int $userID ID of the user to toggle.
     * @param string $newRole Role to set for the user.
     * @return string The new role of the user.
     *
     * @throws InvalidRoleException If the role is invalid.
     * @throws InvalidEmailException If the user's email doesn't end with @unicauca.edu.co when required.
     */
    public function toggleRole(int $userID, string $newRole): string
    {
        // Validate role
        $validRoles = ['interested', 'active-member', 'seed', 'coordinator', 'mentor'];
        if (!in_array($newRole, $validRoles)) {
            throw new InvalidRoleException("Invalid role: {$newRole}");
        }

        // Retrieve user
        $user = User::query()->findOrFail($userID);

        // Validate email domain only for specific roles
        $requiresUnicaucaEmail = in_array($newRole, ['seed', 'coordinator', 'mentor']);
        if ($requiresUnicaucaEmail && !str_ends_with($user->email, '@unicauca.edu.co')) {
            throw new InvalidEmailException("Only users with a @unicauca.edu.co email can be assigned the role '{$newRole}'.");
        }

        // Update role
        $user->role = $newRole;
        $user->save();

        return $newRole;
    }



    /**
     * List all active users.
     */
    public function listActiveUsers(): Collection
    {
        return User::query()
            ->whereNull('deleted_at')
            ->orderBy('name')
            ->get();
    }

    /**
     * List all active interested users.
     */
    public function listActiveInterested(): Collection
    {
        return User::query()
            ->where('role', 'interested')
            ->whereNull('deleted_at')
            ->orderBy('name')
            ->get();
    }

    /**
     * List all active members.
     */
    public function listActiveMembers(): Collection
    {
        return User::query()
            ->where('role', 'active-member')
            ->whereNull('deleted_at')
            ->orderBy('name')
            ->get();
    }

    /**
     * List all active seeds.
     */
    public function listActiveSeeds(): Collection
    {
        return User::query()
            ->where('role', 'active-seeds')
            ->whereNull('deleted_at')
            ->orderBy('name')
            ->get();
    }

    /**
     * List all active coordinators.
     */
    public function listActiveCoordinators(): Collection
    {
        return User::query()
            ->where('role', 'coordinator')
            ->whereNull('deleted_at')
            ->orderBy('name')
            ->get();
    }

    /**
     * List all active mentors.
     */
    public function listActiveMentors(): Collection
    {
        return User::query()
            ->where('role', 'mentor')
            ->whereNull('deleted_at')
            ->orderBy('name')
            ->get();
    }

    /**
     * List all inactive (soft deleted) users.
     */
    public function listInactiveUsers(): Collection
    {
        return User::onlyTrashed()
            ->orderBy('deleted_at', 'desc')
            ->get();
    }
}
