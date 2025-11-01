<?php

namespace App\Http\Controllers;

use App\Http\Requests\Profile\AddProfileInterestsRequest;
use App\Http\Requests\Profile\UpdateProfileRequest;
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

    public function addProfileInterests(AddProfileInterestsRequest $request): JsonResponse
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        $data = $request->validated();

        // Allow one or multiple interests
        $interestIds = $data['interests'];

        $addedInterests = $this->profileService->addProfileInterests( $interestIds);

        return response()->json([
            'message' => 'Interests added successfully.',
            'interests' => $addedInterests,
        ]);
    }
}
