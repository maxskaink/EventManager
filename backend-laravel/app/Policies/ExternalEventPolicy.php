<?php

namespace App\Policies;

use App\Models\ExternalEvent;
use App\Models\User;

class ExternalEventPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role === 'mentor';
    }

    public function viewByUser(User $authUser, $targetUser): bool
    {
        $targetUserId = $targetUser instanceof User ? $targetUser->id : (int) $targetUser;
        return $authUser->id === $targetUserId || $authUser->role === 'mentor';
    }

    public function create(User $authUser, $targetUser = null): bool
    {
        if (is_null($targetUser)) {
            return true;
        }
        $targetUserId = $targetUser instanceof User ? $targetUser->id : (int) $targetUser;
        return $authUser->id === $targetUserId || $authUser->role === 'mentor';
    }

    public function update(User $authUser, ExternalEvent $event): bool
    {
        return $authUser->id === $event->user_id || $authUser->role === 'mentor';
    }

    public function delete(User $authUser, ExternalEvent $event): bool
    {
        return $authUser->id === $event->user_id || $authUser->role === 'mentor';
    }

    public function filterByDateRange(User $authUser): bool
    {
        return $authUser->role === 'mentor';
    }
}
