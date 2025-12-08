<?php

namespace App\Policies;

use App\Models\ExternalEvent;
use App\Models\User;

class ExternalEventPolicy
{
    /**
     * Determine whether the user can view any external events.
     *
     * @param User $user
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        return $user->role === 'mentor';
    }

    /**
     * Determine whether the user can view external events of a specific user.
     *
     * @param User $authUser The authenticated user
     * @param User|int $targetUser The target user or user ID
     * @return bool
     */
    public function viewByUser(User $authUser, $targetUser): bool
    {
        $targetUserId = $targetUser instanceof User ? $targetUser->id : (int) $targetUser;
        return $authUser->id === $targetUserId || $authUser->role === 'mentor';
    }

    /**
     * Determine whether the user can create an external event.
     *
     * @param User $authUser The authenticated user
     * @param User|int|null $targetUser The target user or user ID
     * @return bool
     */
    public function create(User $authUser, $targetUser = null): bool
    {
        if (is_null($targetUser)) {
            return true;
        }
        $targetUserId = $targetUser instanceof User ? $targetUser->id : (int) $targetUser;
        return $authUser->id === $targetUserId || $authUser->role === 'mentor';
    }

    /**
     * Determine whether the user can update the external event.
     *
     * @param User $authUser The authenticated user
     * @param ExternalEvent $event The external event to update
     * @return bool
     */
    public function update(User $authUser, ExternalEvent $event): bool
    {
        return $authUser->id === $event->user_id || $authUser->role === 'mentor';
    }

    /**
     * Determine whether the user can delete the external event.
     *
     * @param User $authUser The authenticated user
     * @param ExternalEvent $event The external event to delete
     * @return bool
     */
    public function delete(User $authUser, ExternalEvent $event): bool
    {
        return $authUser->id === $event->user_id || $authUser->role === 'mentor';
    }

    /**
     * Determine whether the user can filter external events by date range.
     *
     * @param User $authUser The authenticated user
     * @return bool
     */
    public function filterByDateRange(User $authUser): bool
    {
        return $authUser->role === 'mentor';
    }
}
