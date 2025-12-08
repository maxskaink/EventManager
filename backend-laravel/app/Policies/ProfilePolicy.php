<?php

namespace App\Policies;

use App\Models\User;

class ProfilePolicy
{
    /**
     * Determine whether the user can view a profile.
     *
     * @param User $authUser The authenticated user
     * @param User|int $targetUser The target user or user ID
     * @return bool
     */
    public function view(User $authUser, $targetUser): bool
    {
        $targetUserId = $targetUser instanceof User ? $targetUser->id : (int) $targetUser;
        return $authUser->id === $targetUserId || $authUser->role === 'mentor';
    }

    /**
     * Determine whether the user can update their profile.
     *
     * @param User $authUser The authenticated user
     * @param User|int $targetUser The target user or user ID
     * @return bool
     */
    public function update(User $authUser, $targetUser): bool
    {
        $targetUserId = $targetUser instanceof User ? $targetUser->id : (int) $targetUser;
        return $authUser->id === $targetUserId;
    }
}
