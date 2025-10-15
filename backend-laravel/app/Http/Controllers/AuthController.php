<?php

namespace App\Http\Controllers;

use App\Models\User;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
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

    public function handleGoogleCallback(Request $request): JsonResponse
    {
        try {
            $code = $request->input('code');
            if (!$code) {
                return response()->json(['error' => 'Missing authorization code'], 422);
            }
            /** @var GoogleProvider $googleProvider */
            $googleProvider = Socialite::driver('google');

            $tokenResponse = Http::asForm()->post('https://oauth2.googleapis.com/token', [
                'code' => $code,
                'client_id' => env('GOOGLE_CLIENT_ID'),
                'client_secret' => env('GOOGLE_CLIENT_SECRET'),
                'redirect_uri' => env('GOOGLE_REDIRECT_URI'),
                'grant_type' => 'authorization_code',
            ]);

            $accessToken = $tokenResponse->json()['access_token'];

            /** @var GoogleProvider $googleProvider */
            $googleProvider = Socialite::driver('google');

            $googleUser = $googleProvider->stateless()->userFromToken($accessToken);

            $user = User::query()
                ->firstOrCreate(
                    [
                        'email' => $googleUser->getEmail(),
                    ],
                    [
                        'email_verified_at' => now(),
                        'name' => $googleUser->getName(),
                        'google_id' => $googleUser->getId(),
                        'avatar' => $googleUser->getAvatar(),
                        'role' => 'interested'
                    ]
                );

            // Crear token de Sanctum
            $token = $user->createToken('access_token')->plainTextToken;

            return response()->json([
                'user' => $user,
                'access_token' => $token,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 422);
        }
    }

    #TEST METHOD NOT FULLY ENDED
    public function user(): JsonResponse
    {
        return response()->json([
            'user' => auth()->user(),
        ]);
    }

    #NOT FULLY ENDED
    public function logout(): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();

        // Eliminar el token actual
        $user->currentAccessToken()->can('delete');

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

}
