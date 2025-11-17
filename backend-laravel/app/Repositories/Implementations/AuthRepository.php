<?php

namespace App\Repositories\Implementations;

use App\Models\Profile;
use App\Models\User;
use App\Repositories\Contracts\AuthRepositoryInterface;
use Illuminate\Auth\AuthenticationException;
use Laravel\Socialite\Contracts\User as SocialiteUser;

class AuthRepository implements AuthRepositoryInterface
{
    public function findOrCreateUser(SocialiteUser $googleUser): User
    {
        return User::query()->firstOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'email_verified_at' => now(),
                'name' => $googleUser->getName(),
                'google_id' => $googleUser->getId(),
                'avatar' => $googleUser->getAvatar(),
                'role' => 'interested',
            ]
        );
    }

    public function ensureUserProfile(User $user): void
    {
        if (!$user->profile) {
            Profile::query()->create([
                'user_id' => $user->id,
                'university' => null,
                'academic_program' => null,
                'phone' => null,
            ]);
        }
    }

    public function updateLastLogin(User $user): void
    {
        $user->last_login_at = now();
        $user->save();
    }

    public function createToken(User $user): string
    {
        return $user->createToken('access_token')->plainTextToken;
    }

    /**
     * @throws AuthenticationException
     */
    public function revokeToken(?User $user): void
    {
        if (!$user) {
            throw new AuthenticationException('User not authenticated');
        }

        $token = $user->currentAccessToken();

        if ($token && method_exists($token, 'delete')) {
            $token->delete();
        }
    }
}
