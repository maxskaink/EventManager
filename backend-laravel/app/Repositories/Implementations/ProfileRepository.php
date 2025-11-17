<?php

namespace App\Repositories\Implementations;

use App\Models\Profile;
use App\Models\ProfileInterest;
use App\Repositories\Contracts\ProfileRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ProfileRepository implements ProfileRepositoryInterface
{
    public function updateOrCreateProfile(int $userId, array $data): Profile
    {
        $profile = Profile::query()->firstOrNew(['user_id' => $userId]);
        $profile->fill($data);
        $profile->save();

        return $profile;
    }

    public function getOrCreateProfile(int $userId): Profile
    {
        return Profile::query()->firstOrNew(['user_id' => $userId]);
    }

    public function existsProfileInterest(int $userId, int $interestId): bool
    {
        return ProfileInterest::query()
            ->where('user_id', $userId)
            ->where('interest_id', $interestId)
            ->exists();
    }

    public function createProfileInterest(int $userId, int $interestId): void
    {
        ProfileInterest::query()->create([
            'user_id' => $userId,
            'interest_id' => $interestId,
        ]);
    }

    public function getAllProfileInterests(int $userId): Collection
    {
        return ProfileInterest::query()
            ->where('user_id', $userId)
            ->with('user')
            ->get();
    }
}
