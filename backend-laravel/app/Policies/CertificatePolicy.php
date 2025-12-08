<?php

namespace App\Policies;

use App\Models\Certificate;
use App\Models\User;

class CertificatePolicy
{
    /**
     * Determine whether the user can view any certificates.
     *
     * @param User $user
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        return $user->role === 'mentor' || $user->role === 'coordinator';
    }

    /**
     * Determine whether the user can view certificates of a specific user.
     *
     * @param User $authUser The authenticated user
     * @param User|int $targetUser The target user or user ID
     * @return bool
     */
    public function viewByUser(User $authUser, $targetUser): bool
    {
        $targetUserId = $targetUser instanceof User ? $targetUser->id : (int) $targetUser;
        return $authUser->id === $targetUserId || $authUser->role === 'mentor' || $authUser->role === 'coordinator';
    }

    /**
     * Determine whether the user can create a certificate.
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
        return $authUser->id === $targetUserId || $authUser->role === 'mentor' || $authUser->role === 'coordinator';
    }

    /**
     * Determine whether the user can update the certificate.
     *
     * @param User $authUser The authenticated user
     * @param Certificate $certificate The certificate to update
     * @return bool
     */
    public function update(User $authUser, Certificate $certificate): bool
    {
        return $authUser->id === $certificate->user_id || $authUser->role === 'mentor' || $authUser->role === 'coordinator';
    }

    /**
     * Determine whether the user can delete the certificate.
     *
     * @param User $authUser The authenticated user
     * @param Certificate $certificate The certificate to delete
     * @return bool
     */
    public function delete(User $authUser, Certificate $certificate): bool
    {
        return $authUser->id === $certificate->user_id || $authUser->role === 'mentor' || $authUser->role === 'coordinator';
    }

    /**
     * Determine whether the user can filter certificates by date range.
     *
     * @param User $authUser The authenticated user
     * @return bool
     */
    public function filterByDateRange(User $authUser): bool
    {
        return $authUser->role === 'mentor' || $authUser->role === 'coordinator';
    }
}
