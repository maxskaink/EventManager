<?php

namespace App\Policies;

use App\Models\Publication;
use App\Models\User;

class PublicationPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['mentor', 'coordinator'], true);
    }

    public function viewByUser(User $authUser, $targetUser): bool
    {
        $targetUserId = $targetUser instanceof User ? $targetUser->id : (int) $targetUser;
        return $authUser->id === $targetUserId || in_array($authUser->role, ['mentor', 'coordinator'], true);
    }

    public function create(User $authUser): bool
    {
        return in_array($authUser->role, ['mentor', 'coordinator'], true);
    }

    public function update(User $authUser, Publication $publication): bool
    {
        return $authUser->id === $publication->author_id || in_array($authUser->role, ['mentor', 'coordinator'], true);
    }

    public function delete(User $authUser, Publication $publication): bool
    {
        return $authUser->id === $publication->author_id || in_array($authUser->role, ['mentor', 'coordinator'], true);
    }

    public function grantAccess(User $authUser): bool
    {
        return in_array($authUser->role, ['mentor', 'coordinator'], true);
    }
}
