<?php

namespace App\Services\Implementations;

use App\Models\User;
use App\Repositories\Contracts\AuthRepositoryInterface;
use App\Services\Contracts\AuthServiceInterface;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Laravel\Socialite\Contracts\User as SocialiteUser;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\GoogleProvider;

class AuthService implements AuthServiceInterface
{
    protected AuthRepositoryInterface $authRepository;

    public function __construct(AuthRepositoryInterface $authRepository)
    {
        $this->authRepository = $authRepository;
    }

    /**
     * Generate a stateless Google OAuth redirect URL.
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
     * @throws ConnectionException|RequestException
     * @throws AuthenticationException
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
            throw new AuthenticationException('Failed to obtain access token from Google');
        }

        // Step 2: Retrieve user info from Google
        /** @var SocialiteUser $googleUser */
        $googleUser = $googleProvider->stateless()->userFromToken($accessToken);

        // Step 3: Use repository to create or retrieve user
        $user = $this->authRepository->findOrCreateUser($googleUser);

        // Step 3.1: Ensure profile and update last login
        $this->authRepository->ensureUserProfile($user);
        $this->authRepository->updateLastLogin($user);

        // Step 4: Create Sanctum token
        $token = $this->authRepository->createToken($user);

        return [
            'user' => $user,
            'access_token' => $token,
        ];
    }

    /**
     * Revoke the user's current Sanctum token.
     */
    public function logout(?User $user): void
    {
        $this->authRepository->revokeToken($user);
    }
}
