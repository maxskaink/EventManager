<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\CreateUserRequest;
use App\Http\Requests\User\ToggleRoleRequest;
use App\Models\User;
use App\Services\Contracts\UserServiceInterface;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    protected UserServiceInterface $userService;

    public function __construct(UserServiceInterface $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Create a new user manually
     */
    public function createUser(CreateUserRequest $request): JsonResponse
    {
        $data = $request->validated();

        $user = $this->userService->createUser(
            $data['name'],
            $data['email'],
            $data['role']
        );

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user
        ], 201);
    }

     /** Change a user's role.
     *
     * @throws AuthorizationException
     */
    public function toggleRole(ToggleRoleRequest $request, int $userId): JsonResponse
    {
        $targetUser = User::query()->findOrFail($userId);

        $this->authorize('changeRole', $targetUser);

        $data = $request->validated();
        $newRole = $data['new_role'];

        $updatedRole = $this->userService->toggleRole($userId, $newRole);

        return response()->json([
            'message' => "Role changed successfully to {$updatedRole}"
        ]);
    }


    /**
     * List all active interested users.
     *
     * @throws AuthorizationException
     */
    public function listActiveInterested(): JsonResponse
    {
        $this->authorize('viewAny', Auth::user());
        return response()->json($this->userService->listActiveInterested());
    }

    /**
     * List all active members.
     *
     * @throws AuthorizationException
     */
    public function listActiveMembers(): JsonResponse
    {
        $this->authorize('viewAny', Auth::user());
        return response()->json($this->userService->listActiveMembers());
    }

    /**
     * List all active coordinators.
     *
     * @throws AuthorizationException
     */
    public function listActiveCoordinators(): JsonResponse
    {
        $this->authorize('viewAny', Auth::user());
        return response()->json($this->userService->listActiveCoordinators());
    }

    /**
     * List all active mentors.
     *
     * @throws AuthorizationException
     */
    public function listActiveMentors(): JsonResponse
    {
        $this->authorize('viewAny', Auth::user());
        return response()->json($this->userService->listActiveMentors());
    }

    /**
     * List all inactive users.
     *
     * @throws AuthorizationException
     */
    public function listInactiveUsers(): JsonResponse
    {
        $this->authorize('viewAny', Auth::user());
        return response()->json($this->userService->listInactiveUsers());
    }

    /**
     * List all active users.
     *
     * @throws AuthorizationException
     */
    public function listActiveUsers(): JsonResponse
    {
        $this->authorize('viewAny', Auth::user());
        return response()->json($this->userService->listActiveUsers());
    }
}
