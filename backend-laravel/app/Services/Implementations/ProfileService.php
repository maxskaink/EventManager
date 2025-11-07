<?php

namespace App\Services\Implementations;

use App\Models\Profile;
use App\Models\ProfileInterest;
use App\Services\Contracts\ProfileServiceInterface;
use Illuminate\Support\Facades\DB;

class ProfileService implements ProfileServiceInterface
{
    /**
     * Update or create a user profile.
     *
     * @param int $userId
     * @param array $data
     * @return Profile
     */
    public function updateProfile(int $userId, array $data): Profile
    {
        $profile = Profile::query()->firstOrNew(['user_id' => $userId]);

        $profile->fill($data);
        $profile->save();

        return $profile;
    }

    /**
     * Get a user profile or create a new one if not exists.
     *
     * @param int $userId
     * @return Profile
     */
    public function getProfile(int $userId): Profile
    {
        return Profile::query()->firstOrNew(['user_id' => $userId]);
    }

    /**
     * Add interests to a user's profile.
     *
     * @param int $userId
     * @param array $interestIds
     * @return array
     */
    public function addProfileInterests(int $userId, array $interestIds): array
    {
        DB::transaction(function () use ($userId, $interestIds) {
            foreach ($interestIds as $interestId) {
                $exists = ProfileInterest::query()
                    ->where('user_id', $userId)
                    ->where('interest_id', $interestId)
                    ->exists();

                if (!$exists) {
                    ProfileInterest::query()->create([
                        'user_id' => $userId,
                        'interest_id' => $interestId,
                    ]);
                }
            }
        });

        return ProfileInterest::query()
            ->where('user_id', $userId)
            ->with('user')
            ->get()
            ->toArray();
    }
}
