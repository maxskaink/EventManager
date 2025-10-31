<?php

namespace App\Http\Controllers;

use App\Http\Requests\Publication\AddPublicationRequest;
use App\Http\Requests\Publication\UpdatePublicationRequest;
use App\Services\PublicationService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;

class PublicationController extends Controller
{
    protected PublicationService $publicationService;

    public function __construct(PublicationService $publicationService)
    {
        $this->publicationService = $publicationService;
    }

    /**
     * Create a new publication.
     */
    public function addPublication(AddPublicationRequest $request): JsonResponse
    {
        $data = $request->validated();

        $newPublication = $this->publicationService->addPublication($data);

        return response()->json([
            'message' => "Publication created successfully: {$newPublication}"
        ]);
    }

    /**
     * @throws AuthorizationException
     * List all publications.
     */
    public function listAllPublications(): JsonResponse
    {
        return response()->json($this->publicationService->listAllPublications());
    }

    /**
     * @throws AuthorizationException
     * List all published publications.
     */
    public function listPublishedPublications(): JsonResponse
    {
        return response()->json($this->publicationService->listPublishedPublications());
    }

    /**
     * @throws AuthorizationException
     * List all draft publications.
     */
    public function listDraftPublications(): JsonResponse
    {
        return response()->json($this->publicationService->listDraftPublications());
    }

    /**
     * Update a publication by ID.
     */
    public function updatePublication(UpdatePublicationRequest $request, int $id): JsonResponse
    {
        $data = $request->validated();

        $updatedPublication = $this->publicationService->updatePublication($id, $data);

        return response()->json([
            'message' => 'Publication updated successfully.',
            'publication' => $updatedPublication,
        ]);
    }
}
