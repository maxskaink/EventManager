<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\FilterUserRequest;
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
     * List users with filters.
     */
    public function listFilteredUsers(FilterUserRequest $request): JsonResponse
    {
        $data = $request->validated();
        $perPage = $data['per_page'] ?? 15;

        $filters = [
            'role' => $data['role'] ?? null,
            'search' => $data['search'] ?? null,
        ];

        return response()->json($this->userService->listFilteredUsers($filters, $perPage));
    }

    /**
     * List all inactive users.
     *
     * @throws AuthorizationException
     */
    public function listInactiveUsers(): JsonResponse
    {
        $this->authorize('viewAny', Auth::user());
        $perPage = request()->input('per_page', 15);
        return response()->json($this->userService->listInactiveUsers($perPage));
    }

    /**
     * Get a user by ID.
     *
     * @param int $userId
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function getUserById(int $userId): JsonResponse
    {

        $user = $this->userService->getUserById($userId);

        return response()->json([
            'user' => $user,
        ]);
    }

}
