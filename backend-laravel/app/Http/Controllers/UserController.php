<?php

namespace App\Http\Controllers;

use App\Http\Requests\ToggleRoleRequest;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }


    public function toggleRole(ToggleRoleRequest $request): JsonResponse
    {

        $data = $request->validated();

        $userId = $data['user_id'];
        $newRole = $data['new_role'];

        $updatedRole = $this->userService->toggleRole($userId, $newRole);

        return response()->json([
            'message' => "Role changed successfully to {$updatedRole}"
        ]);
    }



}
