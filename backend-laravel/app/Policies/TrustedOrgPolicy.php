<?php

namespace App\Policies;

use App\Models\TrustedOrg;
use App\Models\User;

class TrustedOrgPolicy
{
    /**
     * Determine whether the user can view any trusted organizations.
     *
     * @param User $user
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        // All authenticated users can view trusted organizations
        return true;
    }

    /**
     * Determine whether the user can create a trusted organization.
     *
     * @param User $user
     * @return bool
     */
    public function create(User $user): bool
    {
        // Only mentors or coordinators can create new trusted organizations
        return in_array($user->role, ['mentor', 'coordinator']);
    }

    /**
     * Determine whether the user can update a trusted organization.
     *
     * @param User $user
     * @param TrustedOrg|null $trustedOrg
     * @return bool
     */
    public function update(User $user, ?TrustedOrg $trustedOrg = null): bool
    {
        // Only mentors or coordinators can update trusted organizations
        return in_array($user->role, ['mentor', 'coordinator']);
    }

    /**
     * Determine whether the user can delete a trusted organization.
     *
     * @param User $user
     * @param TrustedOrg|null $trustedOrg
     * @return bool
     */
    public function delete(User $user, ?TrustedOrg $trustedOrg = null): bool
    {
        // Only mentors or coordinators can delete trusted organizations
        return in_array($user->role, ['mentor', 'coordinator']);
    }
}
