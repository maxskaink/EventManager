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

    public function __construct(InterestServiceInterface $interestService)
    {
        $this->interestService = $interestService;
    }

    /**
     * Create a new interest.
     *
     * @throws AuthorizationException
     */
    public function addInterest(AddInterestRequest $request): JsonResponse
    {
        $this->authorize('create', Interest::class);

        $data = $request->validated();
        $newInterest = $this->interestService->addInterest($data);

        return response()->json([
            'message' => "Interest created successfully.",
            'interest' => $newInterest,
        ]);
    }

    /**
     * List all interests.
     *
     * @throws AuthorizationException
     */
    public function listAllInterests(): JsonResponse
    {
        $this->authorize('viewAny', Interest::class);

        $interests = $this->interestService->getAllInterests();

        return response()->json([
            'interests' => $interests,
        ]);
    }

    /**
     * Delete an existing interest.
     *
     * @throws AuthorizationException
     */
    public function deleteInterest(int $interestId): JsonResponse
    {
        $this->authorize('delete', Interest::class);

        $this->interestService->deleteInterest($interestId);

        return response()->json([
            'message' => 'Interest deleted successfully.',
        ]);
    }
}
