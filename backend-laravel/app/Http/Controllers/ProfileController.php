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

    /**
     * View a profile by user ID.
     *
     * @param int $userId
     * @return JsonResponse

     */
    public function getProfileById(int $userId): JsonResponse
    {
        $authUser = Auth::user();

        $profile = $this->profileService->getProfile($userId);

        return response()->json([
            'profile' => $profile,
        ]);
    }

    /**
     * List all interests of the authenticated user's profile.
     *
     * @return JsonResponse
     */
    public function listProfileInterests(): JsonResponse
    {
        $authUser = Auth::user();
        $this->authorize('view', [Profile::class, $authUser]);

        $interests = $this->profileService->getAllProfileInterests($authUser->id);

        return response()->json([
            'interests' => $interests,
        ]);
    }

    /**
     * Get a specific interest by its ID for the authenticated user's profile.
     *
     * @param int $interestId
     * @return JsonResponse
     */
    public function getProfileInterestByUserId(int $userId): JsonResponse
    {
        $authUser = Auth::user();
        $this->authorize('view', [Profile::class, $authUser]);

        $interest = $this->profileService->getAllProfileInterests($userId);

        return response()->json([
            'interest' => $interest,
        ]);
    }

    /**
     * Remove an interest from the authenticated user's profile.
     *
     * @param int $interestId
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function removeProfileInterest(int $interestId): JsonResponse
    {
        $authUser = Auth::user();
        $this->authorize('update', [Profile::class, $authUser]);

        $deleted = $this->profileService->removeProfileInterest($authUser->id, $interestId);

        if (!$deleted) {
            return response()->json([
                'message' => 'Interest not found or could not be deleted.'
            ], 404);
        }

        return response()->json([
            'message' => 'Interest removed successfully.',
        ]);
    }

}
