<?php

namespace App\Services\Implementations;

use App\Exceptions\InvalidRoleException;
use App\Models\User;
use App\Services\Contracts\UserServiceInterface;
use Illuminate\Database\Eloquent\Collection;

class UserService implements UserServiceInterface
{
    /**
     * Toggle the user's role between 'interested' and 'organizer'.
     *
     * @param int $userID ID of the user to toggle.
     * @param string $newRole Role to set for the user.
     * @return string The new role of the user.
     */
    public function toggleRole(int $userID, string $newRole): string
    {
        if (!in_array($newRole, ['interested', 'member', 'coordinator', 'mentor'])) {
            throw new InvalidRoleException("Invalid role: {$newRole}");
        }

        $user = User::query()->findOrFail($userID);
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
            ->where('role', 'member')
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
