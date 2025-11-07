<?php

namespace App\Policies;

use App\Models\Certificate;
use App\Models\User;

class CertificatePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role === 'mentor' || $user->role === 'coordinator';
    }

    public function viewByUser(User $authUser, $targetUser): bool
    {
        $targetUserId = $targetUser instanceof User ? $targetUser->id : (int) $targetUser;
        return $authUser->id === $targetUserId || $authUser->role === 'mentor' || $authUser->role === 'coordinator';
    }

    public function create(User $authUser, $targetUser = null): bool
    {
        if (is_null($targetUser)) {
            return true;
        }
        $targetUserId = $targetUser instanceof User ? $targetUser->id : (int) $targetUser;
        return $authUser->id === $targetUserId || $authUser->role === 'mentor' || $authUser->role === 'coordinator';
    }

    public function update(User $authUser, Certificate $certificate): bool
    {
        return $authUser->id === $certificate->user_id || $authUser->role === 'mentor' || $authUser->role === 'coordinator';
    }

    public function delete(User $authUser, Certificate $certificate): bool
    {
        return $authUser->id === $certificate->user_id || $authUser->role === 'mentor' || $authUser->role === 'coordinator';
    }

    public function filterByDateRange(User $authUser): bool
    {
        return $authUser->role === 'mentor' || $authUser->role === 'coordinator';
    }
}
