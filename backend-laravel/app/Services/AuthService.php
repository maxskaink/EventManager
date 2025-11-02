<?php

namespace App\Services;

use App\Models\Profile;
use App\Models\User;
use Exception;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Contracts\User as SocialiteUser;
use Laravel\Socialite\Two\GoogleProvider;
use App\Services\Contracts\AuthServiceInterface;

class AuthService implements AuthServiceInterface
{
    /**
     * Generate a stateless Google OAuth redirect URL.
     *
     * @return string The Google authentication URL.
     */
    public function getGoogleAuthUrl(): string
    {
        /** @var GoogleProvider $googleProvider */
        $googleProvider = Socialite::driver('google');

        return $googleProvider
            ->stateless()
            ->redirect()
            ->getTargetUrl();
    }

    /**
     * Handle Google OAuth2 callback and authenticate user.
     *
     * @param string $code The authorization code from Google.
     * @return array An array containing the user and access token.
     *
     * @throws Exception If any step of the process fails.
     */
    public function handleGoogleCallback(string $code): array
    {
        /** @var GoogleProvider $googleProvider */
        $googleProvider = Socialite::driver('google');

        // Step 1: Exchange authorization code for access token
        $tokenResponse = Http::asForm()->post('https://oauth2.googleapis.com/token', [
            'code' => $code,
            'client_id' => env('GOOGLE_CLIENT_ID'),
            'client_secret' => env('GOOGLE_CLIENT_SECRET'),
            'redirect_uri' => env('GOOGLE_REDIRECT_URI'),
            'grant_type' => 'authorization_code',
        ]);

        if ($tokenResponse->failed()) {
            throw new RequestException($tokenResponse);
        }

        $accessToken = $tokenResponse->json()['access_token'] ?? null;

        if (!$accessToken) {
            throw new Exception('Failed to obtain access token from Google');
        }

        // Step 2: Retrieve user info from Google
        /** @var SocialiteUser $googleUser */
        $googleUser = $googleProvider->stateless()->userFromToken($accessToken);

        // Step 3: Create or retrieve the user
        $user = User::query()->firstOrCreate(
            [
                'email' => $googleUser->getEmail(),
            ],
            [
                'email_verified_at' => now(),
                'name' => $googleUser->getName(),
                'google_id' => $googleUser->getId(),
                'avatar' => $googleUser->getAvatar(),
                'role' => 'interested',
            ]
        );

        // Step 3.1: Ensure the user has a profile
        if (!$user->profile) {
            Profile::query()->create([
                'user_id' => $user->id,
                'university' => null,
                'academic_program' => null,
                'phone' => null,
            ]);
        }

        // Step 4: Create a Sanctum token
        $token = $user->createToken('access_token')->plainTextToken;

        return [
            'user' => $user,
            'access_token' => $token,
        ];
    }

    /**
     * Revoke the user's current Sanctum token.
     *
     * @param User|null $user
     * @return void
     *
     * @throws Exception If user is null or unauthenticated.
     */
    public function logout(?User $user): void
    {
        if (!$user) {
            throw new Exception('User not authenticated');
        }

        $token = $user->currentAccessToken();

        if ($token && method_exists($token, 'delete')) {
            $token->delete();
        }
    }
}
