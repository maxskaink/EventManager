<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role === 'mentor' || $user->role === 'coordinator';
    }

    public function view(User $authUser, User $user): bool
    {
        return $authUser->id === $user->id || $authUser->role === 'mentor' || $authUser->role === 'coordinator';
    }

    public function update(User $authUser, User $user): bool
    {
        // Users can update their own account; only mentors/coordinators can update others
        return $authUser->id === $user->id || in_array($authUser->role, ['mentor', 'coordinator'], true);
    }

    public function changeRole(User $authUser, User $targetUser): bool
    {
        return $authUser->id !== $targetUser->id
            && in_array($authUser->role, ['mentor', 'coordinator'], true);
    }

}
