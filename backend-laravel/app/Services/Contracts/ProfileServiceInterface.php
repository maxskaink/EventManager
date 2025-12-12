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
     * @param int $userId
     * @param array $interestIds
     * @return array
     */
    public function addProfileInterests(int $userId, array $interestIds): array;

    /**
     * Get all interests associated with a user's profile.
     *
     * @param int $userId
     * @return array
     */
    public function getAllProfileInterests(int $userId): array;

    /**
     * Get a specific interest from a user's profile.
     *
     * @param int $userId
     * @param int $interestId
     * @return array|null
     */
    public function getProfileInterestById(int $userId, int $interestId): ?array;

    /**
     * Remove an interest from a user's profile.
     *
     * @param int $userId
     * @param int $interestId
     * @return bool
     */
    public function removeProfileInterest(int $userId, int $interestId): bool;

    /**
     * Get all profiles in the system.
     *
     * @return array
     */
    public function getAllProfiles(): array;
}
