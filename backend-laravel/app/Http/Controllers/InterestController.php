<?php

namespace App\Http\Controllers;

use App\Http\Requests\Interest\AddInterestRequest;
use App\Services\InterestService;
use Illuminate\Http\JsonResponse;

class InterestController extends Controller
{
    protected InterestService $interestService;

    public function __construct(InterestService $interestService)
    {
        $this->interestService = $interestService;
    }

    /**
     * Create a new interest.
     */
    public function addInterest(AddInterestRequest $request): JsonResponse
    {
        $data = $request->validated();

        $newInterest = $this->interestService->addInterest($data);

        return response()->json([
            'message' => "Interest created successfully.",
            'interest' => $newInterest,
        ]);
    }

    /**
     * List all interests.
     */
    public function listAllInterests(): JsonResponse
    {
        $interests = $this->interestService->getAllInterests();

        return response()->json([
            'interests' => $interests,
        ]);
    }

    /**
     * Delete an existing interest.
     */
    public function deleteInterest(int $interestId): JsonResponse
    {
        $this->interestService->deleteInterest($interestId);

        return response()->json([
            'message' => 'Interest deleted successfully.',
        ]);
    }
}
