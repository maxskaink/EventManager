<?php

namespace App\Http\Controllers;

use App\Http\Requests\Profile\AddProfileInterestsRequest;
use App\Http\Requests\Profile\UpdateProfileRequest;
use App\Models\User;
use App\Models\Profile;
use App\Services\Contracts\ProfileServiceInterface;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    protected ProfileServiceInterface $profileService;

    public function __construct(ProfileServiceInterface $profileService)
    {
        $this->profileService = $profileService;
    }

    /**
     * Update the authenticated user's profile.
     *
     * @throws AuthorizationException
     */
    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();
        $this->authorize('update', [Profile::class, $authUser]);

        $data = $request->validated();
        $updatedProfile = $this->profileService->updateProfile($authUser->id, $data);

        return response()->json([
            'message' => 'Profile updated successfully.',
            'profile' => $updatedProfile,
        ]);
    }

    /**
     * View the authenticated user's profile.
     *
     * @throws AuthorizationException
     */
    public function getProfile(): JsonResponse
    {
        $authUser = Auth::user();
        $this->authorize('view', [Profile::class, $authUser]);

        $profile = $this->profileService->getProfile($authUser->id);

        return response()->json([
            'profile' => $profile,
        ]);
    }

    /**
     * Add interests to the authenticated user's profile.
     *
     * @throws AuthorizationException
     */
    public function addProfileInterests(AddProfileInterestsRequest $request): JsonResponse
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();
        $this->authorize('update', [Profile::class, $authUser]);

        $data = $request->validated();
        $interestIds = $data['interests'];

        $addedInterests = $this->profileService->addProfileInterests($authUser->id,$interestIds);

        return response()->json([
            'message' => 'Interests added successfully.',
            'interests' => $addedInterests,
        ]);
    }
}
