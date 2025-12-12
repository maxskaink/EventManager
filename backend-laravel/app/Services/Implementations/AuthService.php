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
     * {@inheritDoc}
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
     * {@inheritDoc}
     *
     * @throws ConnectionException|RequestException
     * @throws AuthenticationException
     */
    /**
     * {@inheritDoc}
     *
     * @throws ConnectionException|RequestException
     * @throws AuthenticationException
     */
    public function handleGoogleCallback(string $code): array
    {
        /** @var GoogleProvider $googleProvider */
        $googleProvider = Socialite::driver('google');

        // Step 1: Exchange authorization code for access token
        // We manually request the token to handle potential errors more gracefully
        $tokenResponse = Http::asForm()->post('https://oauth2.googleapis.com/token', [
            'code' => $code,
            'client_id' => config('services.google.client_id'),
            'client_secret' => config('services.google.client_secret'),
            'redirect_uri' => config('services.google.redirect'),
            'grant_type' => 'authorization_code',
        ]);

        if ($tokenResponse->failed()) {
            \Log::error('Google OAuth token exchange failed', [
                'status' => $tokenResponse->status(),
                'body' => $tokenResponse->body(),
            ]);
            throw new RequestException($tokenResponse);
        }

        \Log::info('Google OAuth token exchange success');

        $accessToken = $tokenResponse->json()['access_token'] ?? null;
        if (!$accessToken) {
            throw new AuthenticationException('Failed to obtain access token from Google');
        }

        // Step 2: Retrieve user info from Google using the access token
        /** @var SocialiteUser $googleUser */
        $googleUser = $googleProvider->stateless()->userFromToken($accessToken);

        // Step 3: Use repository to create or retrieve user based on Google info
        $user = $this->authRepository->findOrCreateUser($googleUser);

        // Step 3.1: Ensure profile exists and update last login timestamp
        $this->authRepository->ensureUserProfile($user);
        $this->authRepository->updateLastLogin($user);

        // Step 4: Create Sanctum token for API authentication
        $token = $this->authRepository->createToken($user);

        return [
            'user' => $user,
            'access_token' => $token,
        ];
    }

    /**
     * {@inheritDoc}
     */
    public function logout(?User $user): void
    {
        $this->authRepository->revokeToken($user);
    }
}
