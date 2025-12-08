<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Determine whether the user can view any users.
     *
     * @param User $user
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        return $user->role === 'mentor' || $user->role === 'coordinator';
    }

    /**
     * Determine whether the user can view a specific user.
     *
     * @param User $authUser The authenticated user
     * @param User $user The user to view
     * @return bool
     */
    public function view(User $authUser, User $user): bool
    {
        return $authUser->id === $user->id || $authUser->role === 'mentor' || $authUser->role === 'coordinator';
    }

    /**
     * Determine whether the user can update a user account.
     *
     * @param User $authUser The authenticated user
     * @param User $user The user to update
     * @return bool
     */
    public function update(User $authUser, User $user): bool
    {
        // Users can update their own account; only mentors/coordinators can update others
        return $authUser->id === $user->id || in_array($authUser->role, ['mentor', 'coordinator'], true);
    }

    /**
     * Determine whether the user can change another user's role.
     *
     * @param User $authUser The authenticated user
     * @param User $targetUser The user whose role is being changed
     * @return bool
     */
    public function changeRole(User $authUser, User $targetUser): bool
    {
        return $authUser->id !== $targetUser->id
            && in_array($authUser->role, ['mentor', 'coordinator'], true);
    }
}
