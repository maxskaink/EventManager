<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\ToggleRoleRequest;
use App\Services\UserService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }


    public function toggleRole(ToggleRoleRequest $request, int $userId): JsonResponse
    {
        $data = $request->validated();
        $newRole = $data['new_role'];

        $updatedRole = $this->userService->toggleRole($userId, $newRole);

        return response()->json([
            'message' => "Role changed successfully to {$updatedRole}"
        ]);
    }


    /**
     * @throws AuthorizationException
     */
    public function listActiveInterested(): JsonResponse
    {
        return response()->json($this->userService->listActiveInterested());
    }


    /**
     * @throws AuthorizationException
     */
    public function listActiveMembers(): JsonResponse
    {
        return response()->json($this->userService->listActiveMembers());
    }

    /**
     * @throws AuthorizationException
     */
    public function listActiveCoordinators(): JsonResponse
    {
        return response()->json($this->userService->listActiveCoordinators());
    }

    /**
     * @throws AuthorizationException
     */
    public function listActiveMentors(): JsonResponse
    {
        return response()->json($this->userService->listActiveMentors());
    }

    /**
     * @throws AuthorizationException
     */
    public function listInactiveUsers(): JsonResponse
    {
        return response()->json($this->userService->listInactiveUsers());
    }

    /**
     * @throws AuthorizationException
     */
    public function listActiveUsers(): JsonResponse
    {
        return response()->json($this->userService->listActiveUsers());
    }
}
