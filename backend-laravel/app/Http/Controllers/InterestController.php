<?php

namespace App\Http\Controllers;

use App\Http\Requests\Interest\AddInterestRequest;
use App\Models\Interest;
use App\Services\Contracts\InterestServiceInterface;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;

class InterestController extends Controller
{
    protected InterestServiceInterface $interestService;

    /**
     * Create a new instance of InterestController.
     *
     * @param InterestServiceInterface $interestService The service to handle interest logic.
     */
    public function __construct(InterestServiceInterface $interestService)
    {
        $this->interestService = $interestService;
    }

    /**
     * Create a new interest.
     *
     * @param AddInterestRequest $request The request containing interest data.
     * @return JsonResponse The created interest and a success message.
     * @throws AuthorizationException If the user is not authorized.
     */
    public function addInterest(AddInterestRequest $request): JsonResponse
    {
        // Authorization: check if the user can create interests
        $this->authorize('create', Interest::class);

        $data = $request->validated();
        $newInterest = $this->interestService->addInterest($data);

        return response()->json([
            'message' => "Interest created successfully.",
            'interest' => $newInterest,
        ], 201);
    }

    /**
     * List all interests.
     *
     * @return JsonResponse A list of all interests.
     * @throws AuthorizationException If the user is not authorized.
     */
    public function listAllInterests(): JsonResponse
    {
        // Authorization: check if the user can view interests
        $this->authorize('viewAny', Interest::class);

        $interests = $this->interestService->getAllInterests();

        return response()->json([
            'interests' => $interests,
        ]);
    }

    /**
     * Delete an existing interest.
     *
     * @param int $interestId The ID of the interest to delete.
     * @return JsonResponse A success message.
     * @throws AuthorizationException If the user is not authorized.
     */
    public function deleteInterest(int $interestId): JsonResponse
    {
        // Authorization: check if the user can delete interests
        $this->authorize('delete', Interest::class);

        $this->interestService->deleteInterest($interestId);

        return response()->json([
            'message' => 'Interest deleted successfully.',
        ]);
    }
}
