<?php
namespace App\Services\Implementations;


use App\Exceptions\InvalidRoleException;
use App\Models\Profile;
use App\Models\ProfileInterest;
use App\Models\User;
use App\Services\Contracts\ProfileServiceInterface;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ProfileService implements ProfileServiceInterface
{

    public function updateProfile(int $userId, array $data): Profile
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        if ($authUser && $authUser->id !== $userId) {
            throw new InvalidRoleException('You cannot modify other users.');
        }

        $profile = Profile::query()->firstOrNew(['user_id' => $userId]);
        $profile->fill($data);
        $profile->save();

        return $profile;
    }

    public function getProfile(int $userId): Profile
    {
        return Profile::query()->firstOrNew(['user_id' => $userId]);
    }

    public function addProfileInterests(array $interestIds): array
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        if (!$authUser) {
            throw new InvalidRoleException('You cannot modify other users.');
        }

        $userId = Auth::id();

        // Use a transaction to ensure atomicity
        DB::transaction(function () use ($userId, $interestIds) {
            foreach ($interestIds as $interestId) {
                // Avoid duplicates
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

        // Return updated list of interests
        return ProfileInterest::query()
            ->where('user_id', $userId)
            ->with('user')
            ->get()
            ->toArray();
    }
}
