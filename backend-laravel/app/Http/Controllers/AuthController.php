<?php

namespace App\Http\Controllers;

use App\Services\Contracts\AuthServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    protected AuthServiceInterface $authService;

    /**
     * Create a new instance of AuthController.
     *
     * @param AuthServiceInterface $authService The service to handle authentication logic.
     */
    public function __construct(AuthServiceInterface $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Get the Google OAuth redirection URL.
     *
     * @return JsonResponse The Google authentication URL.
     */
    public function redirectToAuth(): JsonResponse
    {
        $url = $this->authService->getGoogleAuthUrl();

        return response()->json(['url' => $url]);
    }

    /**
     * Handle the Google OAuth callback.
     *
     * @param Request $request The request containing the authorization code.
     * @return JsonResponse The authentication result (user and token) or an error message.
     */
    public function handleGoogleCallback(Request $request): JsonResponse
    {
        $code = $request->input('code');

        if (!$code) {
            return response()->json(['error' => 'Missing authorization code'], 422);
        }

        try {
            // Exchange code for token and get user info
            $data = $this->authService->handleGoogleCallback($code);
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    /**
     * Get the authenticated user.
     *
     * @return JsonResponse The authenticated user's data.
     */
    public function user(): JsonResponse
    {
        return response()->json(['user' => auth()->user()]);
    }

    /**
     * Log the user out.
     *
     * @param Request $request The request containing the user.
     * @return JsonResponse A success message or an error message.
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            $this->authService->logout($request->user());
            return response()->json(['message' => 'Logged out successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 401);
        }
    }
}
