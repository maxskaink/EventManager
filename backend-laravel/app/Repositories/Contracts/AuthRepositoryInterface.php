<?php

namespace App\Repositories\Contracts;

use App\Models\User;
use Laravel\Socialite\Contracts\User as SocialiteUser;

interface AuthRepositoryInterface
{
    /**
     * Find or create a user based on Google Socialite data.
     *
     * @param SocialiteUser $googleUser
     * @return User
     */
    public function findOrCreateUser(SocialiteUser $googleUser): User;

    /**
     * Ensure the user has an associated profile.
     *
     * @param User $user
     * @return void
     */
    public function ensureUserProfile(User $user): void;

    /**
     * Update the last login timestamp for the user.
     *
     * @param User $user
     * @return void
     */
    public function updateLastLogin(User $user): void;

    /**
     * Create a new API token for the user.
     *
     * @param User $user
     * @return string
     */
    public function createToken(User $user): string;

    /**
     * Revoke the user's current API token.
     *
     * @param User|null $user
     * @return void
     */
    public function revokeToken(?User $user): void;
}
