<?php

namespace App\Services\Implementations;

use App\Exceptions\InvalidRoleException;
use App\Models\User;
use App\Services\Contracts\UserServiceInterface;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;

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
        /** @var User|null $authUser */
        $authUser = Auth::user();

        if ($authUser && $authUser->id === $userID) {
            throw new InvalidRoleException('You cannot modify your own role.');
        }

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
     * @throws AuthorizationException
     */
    public function listActiveUsers(): Collection
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        if ($authUser && !in_array($authUser->role, ['mentor', 'coordinator'])) {
            throw new AuthorizationException('You are not allowed to view all events.');
        }

        return User::query()
            ->whereNull('deleted_at')
            ->orderBy('name')
            ->get();
    }

    /**
     * List all active interested users.
     * @throws AuthorizationException
     */
    public function listActiveInterested(): Collection
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        if ($authUser && !in_array($authUser->role, ['mentor', 'coordinator'])) {
            throw new AuthorizationException('You are not allowed to view all events.');
        }

        return User::query()->where('role', 'interested')
            ->whereNull('deleted_at')
            ->orderBy('name')
            ->get();
    }

    /**
     * List all active members.
     * @throws AuthorizationException
     */
    public function listActiveMembers(): Collection
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        if ($authUser && !in_array($authUser->role, ['mentor', 'coordinator'])) {
            throw new AuthorizationException('You are not allowed to view all events.');
        }

        return User::query()->where('role', 'member')
            ->whereNull('deleted_at')
            ->orderBy('name')
            ->get();
    }

    /**
     * List all active coordinators.
     * @throws AuthorizationException
     */
    public function listActiveCoordinators(): Collection
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        if ($authUser && !in_array($authUser->role, ['mentor', 'coordinator'])) {
            throw new AuthorizationException('You are not allowed to view all events.');
        }

        return User::query()->where('role', 'coordinator')
            ->whereNull('deleted_at')
            ->orderBy('name')
            ->get();
    }

    /**
     * List all active mentors.
     * @throws AuthorizationException
     */
    public function listActiveMentors(): Collection
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        if ($authUser && !in_array($authUser->role, ['mentor', 'coordinator'])) {
            throw new AuthorizationException('You are not allowed to view all events.');
        }

        return User::query()->where('role', 'mentor')
            ->whereNull('deleted_at')
            ->orderBy('name')
            ->get();
    }

    /**
     * List all inactive (soft deleted) users.
     * @throws AuthorizationException
     */
    public function listInactiveUsers(): Collection
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        if ($authUser && !in_array($authUser->role, ['mentor', 'coordinator'])) {
            throw new AuthorizationException('You are not allowed to view all events.');
        }

        return User::onlyTrashed()
            ->orderBy('deleted_at', 'desc')
            ->get();
    }
}
