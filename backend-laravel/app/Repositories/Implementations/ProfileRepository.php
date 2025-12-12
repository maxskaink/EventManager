<?php

namespace App\Repositories\Implementations;

use App\Models\Profile;
use App\Models\ProfileInterest;
use App\Repositories\Contracts\ProfileRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ProfileRepository implements ProfileRepositoryInterface
{
    /**
     * {@inheritDoc}
     */
    public function updateOrCreateProfile(int $userId, array $data): Profile
    {
        // Find existing profile or instantiate a new one.
        $profile = Profile::query()->firstOrNew(['user_id' => $userId]);

        // Fill with data and save.
        $profile->fill($data);
        $profile->save();

        return $profile;
    }

    /**
     * {@inheritDoc}
     */
    public function getOrCreateProfile(int $userId): Profile
    {
        // Return existing profile or a new instance (without saving).
        return Profile::query()->firstOrNew(['user_id' => $userId]);
    }

    /**
     * {@inheritDoc}
     */
    public function existsProfileInterest(int $userId, int $interestId): bool
    {
        // Check existence of a specific interest for a user.
        return ProfileInterest::query()
            ->where('user_id', $userId)
            ->where('interest_id', $interestId)
            ->exists();
    }

    /**
     * {@inheritDoc}
     */
    public function createProfileInterest(int $userId, int $interestId): void
    {
        ProfileInterest::query()->create([
            'user_id' => $userId,
            'interest_id' => $interestId,
        ]);
    }

    /**
     * {@inheritDoc}
     */
    public function getAllProfileInterests(int $userId): Collection
    {
        // Retrieve all interests for a user, eager loading the user relationship.
        return ProfileInterest::query()
            ->where('user_id', $userId)
            ->with('user')
            ->get();
    }

    /**
     * {@inheritDoc}
     */
    public function getProfileInterestById(int $userId, int $interestId): ?ProfileInterest
    {
        return ProfileInterest::query()
            ->where('user_id', $userId)
            ->where('interest_id', $interestId)
            ->with('user')
            ->first();
    }

    /**
     * {@inheritDoc}
     */
    public function deleteProfileInterest(int $userId, int $interestId): bool
    {
        $interest = ProfileInterest::query()
            ->where('user_id', $userId)
            ->where('interest_id', $interestId)
            ->first();

        if (!$interest) {
            return false;
        }

        return (bool) $interest->delete();
    }

    /**
     * {@inheritDoc}
     */
    public function getAllProfiles(): Collection
    {
        // Retrieve all profiles with their associated users.
        return Profile::query()->with('user')->get();
    }

}
