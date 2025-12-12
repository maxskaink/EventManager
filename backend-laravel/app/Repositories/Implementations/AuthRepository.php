<?php

namespace App\Repositories\Implementations;

use App\Models\Profile;
use App\Models\User;
use App\Repositories\Contracts\AuthRepositoryInterface;
use Illuminate\Auth\AuthenticationException;
use Laravel\Socialite\Contracts\User as SocialiteUser;

class AuthRepository implements AuthRepositoryInterface
{
    /**
     * {@inheritDoc}
     */
    public function findOrCreateUser(SocialiteUser $googleUser): User
    {
        // Find user by email or create a new one with Google data.
        return User::query()->firstOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'email_verified_at' => now(),
                'name' => $googleUser->getName(),
                'google_id' => $googleUser->getId(),
                'avatar' => $googleUser->getAvatar(),
                'role' => 'interested', // Default role for new users
            ]
        );
    }

    /**
     * {@inheritDoc}
     */
    public function ensureUserProfile(User $user): void
    {
        // Create a profile if it doesn't exist.
        if (!$user->profile) {
            Profile::query()->create([
                'user_id' => $user->id,
                'university' => null,
                'academic_program' => null,
                'phone' => null,
            ]);
        }
    }

    /**
     * {@inheritDoc}
     */
    public function updateLastLogin(User $user): void
    {
        // Update the last_login_at timestamp.
        $user->last_login_at = now();
        $user->save();
    }

    /**
     * {@inheritDoc}
     */
    public function createToken(User $user): string
    {
        // Create a new Sanctum token for the user.
        return $user->createToken('access_token')->plainTextToken;
    }

    /**
     * {@inheritDoc}
     */
    public function revokeToken(?User $user): void
    {
        if (!$user) {
            throw new AuthenticationException('User not authenticated');
        }

        // Revoke the current access token.
        $token = $user->currentAccessToken();

        if ($token && method_exists($token, 'delete')) {
            $token->delete();
        }
    }
}
