<?php

namespace App\Http\Controllers;

use App\Models\User;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Http\JsonResponse;
use Laravel\Socialite\Contracts\User as SocialiteUser;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\GoogleProvider;

class AuthController extends Controller
{
    //use stateless() since we are using this Laravel app as API and we are not keeping state at any time.
    public function redirectToAuth(): JsonResponse
    {
        /** @var GoogleProvider $googleProvider */
        $googleProvider = Socialite::driver('google');

        return response()->json([
            'url' => $googleProvider
                ->stateless()
                ->redirect()
                ->getTargetUrl(),
        ]);

    }

    public function handleAuthCallback(): JsonResponse
    {
        try {
            /** @var GoogleProvider $googleProvider */
            $googleProvider = Socialite::driver('google');

            /** @var SocialiteUser $socialiteUser */
            $socialiteUser = $googleProvider->stateless()->user();
        } catch (ClientException $e) {
            return response()->json(['error' => 'Invalid credentials provided.'], 422);
        }

        /** @var User $user */
        $user = User::query()
            ->firstOrCreate(
                [
                    'email' => $socialiteUser->getEmail(),
                ],
                [
                    'email_verified_at' => now(),
                    'name' => $socialiteUser->getName(),
                    'google_id' => $socialiteUser->getId(),
                    'avatar' => $socialiteUser->getAvatar(),
                ]
            );

        return response()->json([
            'user' => $user,
            'access_token' => $user->createToken('google-token')->plainTextToken,
            'token_type' => 'Bearer',
        ]);
    }

}
