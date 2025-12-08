<?php

namespace App\Policies;

use App\Models\Interest;
use App\Models\User;

class InterestPolicy
{
    /**
     * Determine whether the user can view any interests.
     *
     * @param User $user
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        // All authenticated users can view interests
        return true;
    }

    /**
     * Determine whether the user can create an interest.
     *
     * @param User $user
     * @return bool
     */
    public function create(User $user): bool
    {
        // Only mentors or coordinators can create new interests
        return in_array($user->role, ['mentor', 'coordinator']);
    }

    /**
     * Determine whether the user can delete an interest.
     *
     * @param User $user
     * @return bool
     */
    public function delete(User $user): bool
    {
        // Only mentors or coordinators can delete interests
        return in_array($user->role, ['mentor', 'coordinator']);
    }
}
