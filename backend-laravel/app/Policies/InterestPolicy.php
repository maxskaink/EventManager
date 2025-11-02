<?php

namespace App\Policies;

use App\Models\Interest;
use App\Models\User;

class InterestPolicy
{
    /**
     * Determine whether the user can view any interests.
     */
    public function viewAny(User $user): bool
    {
        // All authenticated users can view interests
        return true;
    }

    /**
     * Determine whether the user can create an interest.
     */
    public function create(User $user): bool
    {
        // Only mentors or admins can create new interests
        return in_array($user->role, ['mentor', 'admin']);
    }

    /**
     * Determine whether the user can delete an interest.
     */
    public function delete(User $user): bool
    {
        // Only mentors or admins can delete interests
        return in_array($user->role, ['mentor', 'admin']);
    }
}
