<?php

namespace App\Policies;

use App\Models\Publication;
use App\Models\User;

class PublicationPolicy
{
    /**
     * Determine whether the user can view any publications.
     *
     * @param User $user
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['mentor', 'coordinator'], true);
    }

    /**
     * Determine whether the user can view publications of a specific user.
     *
     * @param User $authUser The authenticated user
     * @param User|int $targetUser The target user or user ID
     * @return bool
     */
    public function viewByUser(User $authUser, $targetUser): bool
    {
        $targetUserId = $targetUser instanceof User ? $targetUser->id : (int) $targetUser;
        return $authUser->id === $targetUserId || in_array($authUser->role, ['mentor', 'coordinator'], true);
    }

    /**
     * Determine whether the user can create a publication.
     *
     * @param User $authUser The authenticated user
     * @return bool
     */
    public function create(User $authUser): bool
    {
        return in_array($authUser->role, ['mentor', 'coordinator'], true);
    }

    /**
     * Determine whether the user can update the publication.
     *
     * @param User $authUser The authenticated user
     * @param Publication $publication The publication to update
     * @return bool
     */
    public function update(User $authUser, Publication $publication): bool
    {
        return $authUser->id === $publication->author_id || in_array($authUser->role, ['mentor', 'coordinator'], true);
    }

    /**
     * Determine whether the user can delete the publication.
     *
     * @param User $authUser The authenticated user
     * @param Publication $publication The publication to delete
     * @return bool
     */
    public function delete(User $authUser, Publication $publication): bool
    {
        return $authUser->id === $publication->author_id || in_array($authUser->role, ['mentor', 'coordinator'], true);
    }

    /**
     * Determine whether the user can grant access to a publication.
     *
     * @param User $authUser The authenticated user
     * @return bool
     */
    public function grantAccess(User $authUser): bool
    {
        return in_array($authUser->role, ['mentor', 'coordinator'], true);
    }

    /**
     * Determine whether the user can view publication access records.
     *
     * @param User $authUser The authenticated user
     * @return bool
     */
    public function viewAccess(User $authUser): bool
    {
        return in_array($authUser->role, ['mentor', 'coordinator'], true);
    }
}
