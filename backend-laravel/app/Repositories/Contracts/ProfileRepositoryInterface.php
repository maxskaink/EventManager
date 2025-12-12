<?php

namespace App\Repositories\Contracts;

use App\Models\Profile;
use App\Models\ProfileInterest;
use Illuminate\Database\Eloquent\Collection;

interface ProfileRepositoryInterface
{
    /**
     * Update or create a profile for a user.
     *
     * @param int $userId
     * @param array $data
     * @return Profile
     */
    public function updateOrCreateProfile(int $userId, array $data): Profile;

    /**
     * Get an existing profile or create a new one for a user.
     *
     * @param int $userId
     * @return Profile
     */
    public function getOrCreateProfile(int $userId): Profile;

    /**
     * Check if a user has a specific interest.
     *
     * @param int $userId
     * @param int $interestId
     * @return bool
     */
    public function existsProfileInterest(int $userId, int $interestId): bool;

    /**
     * Associate an interest with a user profile.
     *
     * @param int $userId
     * @param int $interestId
     * @return void
     */
    public function createProfileInterest(int $userId, int $interestId): void;

    /**
     * Get all interests associated with a user profile.
     *
     * @param int $userId
     * @return Collection<int, \App\Models\Interest>
     */
    public function getAllProfileInterests(int $userId): Collection;

    /**
     * Get a specific profile interest relationship by ID.
     *
     * @param int $userId
     * @param int $interestId
     * @return ProfileInterest|null
     */
    public function getProfileInterestById(int $userId, int $interestId): ?ProfileInterest;

    /**
     * Remove an interest from a user profile.
     *
     * @param int $userId
     * @param int $interestId
     * @return bool
     */
    public function deleteProfileInterest(int $userId, int $interestId): bool;

    /**
     * Retrieve all profiles.
     *
     * @return Collection<int, Profile>
     */
    public function getAllProfiles(): Collection;
}
