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

    /**
     * Create a new instance of ProfileController.
     *
     * @param ProfileServiceInterface $profileService The service to handle profile logic.
     */
    public function __construct(ProfileServiceInterface $profileService)
    {
        $this->profileService = $profileService;
    }

    /**
     * Update the authenticated user's profile.
     *
     * @param UpdateProfileRequest $request The request containing updated profile data.
     * @return JsonResponse The updated profile and a success message.
     * @throws AuthorizationException If the user is not authorized.
     */
    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        // Authorization: ensure the user can update their own profile
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
     * @return JsonResponse The user's profile.
     * @throws AuthorizationException If the user is not authorized.
     */
    public function getProfile(): JsonResponse
    {
        $authUser = Auth::user();

        // Authorization: ensure the user can view their own profile
        $this->authorize('view', [Profile::class, $authUser]);

        $profile = $this->profileService->getProfile($authUser->id);

        return response()->json([
            'profile' => $profile,
        ]);
    }

    /**
     * Add interests to the authenticated user's profile.
     *
     * @param AddProfileInterestsRequest $request The request containing interest IDs.
     * @return JsonResponse The added interests and a success message.
     * @throws AuthorizationException If the user is not authorized.
     */
    public function addProfileInterests(AddProfileInterestsRequest $request): JsonResponse
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        // Authorization: ensure the user can update their own profile (adding interests is an update)
        $this->authorize('update', [Profile::class, $authUser]);

        $data = $request->validated();
        $interestIds = $data['interests'];

        $addedInterests = $this->profileService->addProfileInterests($authUser->id, $interestIds);

        return response()->json([
            'message' => 'Interests added successfully.',
            'interests' => $addedInterests,
        ]);
    }

    /**
     * View a profile by user ID.
     *
     * @param int $userId The ID of the user whose profile to view.
     * @return JsonResponse The requested profile.
     */
    public function getProfileById(int $userId): JsonResponse
    {
        // Note: This endpoint seems to be public or accessible by authenticated users without specific checks on the target user
        // Consider adding authorization if needed, e.g., only mentors can view other profiles
        $authUser = Auth::user();

        $profile = $this->profileService->getProfile($userId);

        return response()->json([
            'profile' => $profile,
        ]);
    }

    /**
     * List all interests of the authenticated user's profile.
     *
     * @return JsonResponse A list of the user's interests.
     * @throws AuthorizationException If the user is not authorized.
     */
    public function listProfileInterests(): JsonResponse
    {
        $authUser = Auth::user();

        // Authorization: ensure the user can view their own profile interests
        $this->authorize('view', [Profile::class, $authUser]);

        $interests = $this->profileService->getAllProfileInterests($authUser->id);

        return response()->json([
            'interests' => $interests,
        ]);
    }

    /**
     * Get a specific interest by its ID for the authenticated user's profile.
     *
     * @param int $userId The ID of the user.
     * @return JsonResponse The user's interests.
     * @throws AuthorizationException If the user is not authorized.
     */
    public function getProfileInterestByUserId(int $userId): JsonResponse
    {
        $authUser = Auth::user();

        // Authorization: ensure the user can view their own profile interests
        $this->authorize('view', [Profile::class, $authUser]);

        $interest = $this->profileService->getAllProfileInterests($userId);

        return response()->json([
            'interest' => $interest,
        ]);
    }

    /**
     * Remove an interest from the authenticated user's profile.
     *
     * @param int $interestId The ID of the interest to remove.
     * @return JsonResponse A success message or error if not found.
     * @throws AuthorizationException If the user is not authorized.
     */
    public function removeProfileInterest(int $interestId): JsonResponse
    {
        $authUser = Auth::user();

        // Authorization: ensure the user can update their own profile
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

    /**
     * List all profiles in the system.
     *
     * @return JsonResponse A list of all profiles.
     */
    public function listAllProfiles(): JsonResponse
    {
        $profiles = $this->profileService->getAllProfiles();

        return response()->json([
            'profiles' => $profiles,
        ]);
    }


}
