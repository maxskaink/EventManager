<?php
namespace App\Services;


use App\Exceptions\InvalidRoleException;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ProfileService
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
}
