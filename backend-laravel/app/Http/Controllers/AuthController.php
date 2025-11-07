<?php

namespace App\Http\Controllers;

use App\Services\Contracts\AuthServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    protected AuthServiceInterface $authService;

    public function __construct(AuthServiceInterface $authService)
    {
        $this->authService = $authService;
    }

    public function redirectToAuth(): JsonResponse
    {
        $url = $this->authService->getGoogleAuthUrl();

        return response()->json(['url' => $url]);
    }

    public function handleGoogleCallback(Request $request): JsonResponse
    {
        $code = $request->input('code');

        if (!$code) {
            return response()->json(['error' => 'Missing authorization code'], 422);
        }

        try {
            $data = $this->authService->handleGoogleCallback($code);
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    public function user(): JsonResponse
    {
        return response()->json(['user' => auth()->user()]);
    }

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
