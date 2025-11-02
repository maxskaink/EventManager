<?php

namespace App\Services\Contracts;

use App\Models\User;

interface AuthServiceInterface
{
    /**
     * Generate a stateless Google OAuth redirect URL.
     *
     * @return string The Google authentication URL.
     */
    public function getGoogleAuthUrl(): string;

    /**
     * Handle Google OAuth2 callback and authenticate user.
     *
     * @param string $code The authorization code from Google.
     * @return array An array containing the user and access token.
     *
     * @throws \Exception
     */
    public function handleGoogleCallback(string $code): array;

    /**
     * Revoke the user's current Sanctum token.
     *
     * @param User|null $user
     * @return void
     *
     * @throws \Exception
     */
    public function logout(?User $user): void;
}
