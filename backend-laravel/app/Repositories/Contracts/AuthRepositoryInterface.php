<?php

namespace App\Repositories\Contracts;

use App\Models\User;
use Laravel\Socialite\Contracts\User as SocialiteUser;

interface AuthRepositoryInterface
{
    public function findOrCreateUser(SocialiteUser $googleUser): User;
    public function ensureUserProfile(User $user): void;
    public function updateLastLogin(User $user): void;
    public function createToken(User $user): string;
    public function revokeToken(?User $user): void;
}
