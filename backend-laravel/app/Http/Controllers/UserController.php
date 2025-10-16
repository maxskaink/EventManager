<?php

namespace App\Http\Controllers;

use App\Exceptions\InvalidRoleException;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }


    public function toggleRole(Request $request): JsonResponse
    {
        /** @var User|null $user */
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $newRole = $request->input('new_role');

        $updatedRole = $this->userService->toggleRole($newRole);

        return response()->json([
            'message' => "Role changed successfully to {$updatedRole}"
        ]);
    }
}
