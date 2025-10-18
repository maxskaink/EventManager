<?php

namespace App\Http\Controllers;

use App\Exceptions\InvalidRoleException;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProfileRequest;
use App\Models\Profile;
use App\Models\User;
use App\Services\ProfileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    protected ProfileService $profileService;

    public function __construct(ProfileService $profileService)
    {
        $this->profileService = $profileService;
    }

    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        $data = $request->validated();


        $updatedProfile = $this->profileService->updateProfile($authUser->id, $data);

        return response()->json([
            'message' => 'Profile updated successfully.',
            'profile' => $updatedProfile,
        ]);
    }

    public function getProfile(): JsonResponse
    {
        return response()->json([$this->profileService->getProfile(Auth::id())]);
    }
}
