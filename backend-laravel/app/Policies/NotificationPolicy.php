<?php

namespace App\Policies;

use App\Models\User;

class NotificationPolicy
{
    /**
     * Determine whether the user can view any articles (mentor only).
     */
    public function viewAny(User $user): bool
    {
        return $user->role === 'mentor';
    }

    /**
     * Determine whether the user can view articles of a specific user.
     * The second argument can be a user id or a User instance.
     */
    public function viewByUser(User $authUser,User $targetUser): bool
    {
        $targetUserId =  $targetUser->id;

        return $authUser->id === $targetUserId || $authUser->role === 'mentor';
    }

}
