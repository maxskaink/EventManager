<?php

namespace App\Services\Contracts;

use App\Models\Profile;

interface ProfileServiceInterface
{
    /**
     * Update or create the profile for a user.
     *
     * @param int $userId
     * @param array $data
     * @return Profile
     */
    public function updateProfile(int $userId, array $data): Profile;

    /**
     * Retrieve the profile for a given user.
     *
     * @param int $userId
     * @return Profile
     */
    public function getProfile(int $userId): Profile;

    /**
     * Add interests to the currently authenticated user's profile.
     *
     * @param array $interestIds
     * @return array
     */
    public function addProfileInterests(array $interestIds): array;
}
