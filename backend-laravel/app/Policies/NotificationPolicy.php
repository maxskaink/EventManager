<?php

namespace App\Policies;

use App\Models\User;

class NotificationPolicy
{
    /**
     * Determine whether the user can view any notifications (mentor only).
     *
     * @param User $user
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        return $user->role === 'mentor';
    }

    /**
     * Determine whether the user can view notifications of a specific user.
     *
     * @param User $authUser The authenticated user
     * @param User $targetUser The target user
     * @return bool
     */
    public function viewByUser(User $authUser, User $targetUser): bool
    {
        $targetUserId = $targetUser->id;

        return $authUser->id === $targetUserId || $authUser->role === 'mentor';
    }
}
