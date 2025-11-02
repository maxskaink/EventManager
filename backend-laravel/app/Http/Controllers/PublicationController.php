<?php

namespace App\Http\Controllers;

use App\Http\Requests\Publication\AddPublicationInterestRequest;
use App\Http\Requests\Publication\AddPublicationRequest;
use App\Http\Requests\Publication\PublicationAccessRequest;
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
     * Create a new publication about a new event.
     */
    public function addEventPublication(AddPublicationRequest $request, int $eventId): JsonResponse
    {
        $data = $request->validated();

        $newPublication = $this->publicationService->addEventPublication($data, $eventId);

        return response()->json([
            'message' => "Publication created successfully: {$newPublication}"
        ]);
    }


    /**
     * List all publications.
     */
    public function listAllPublications(): JsonResponse
    {
        return response()->json($this->publicationService->listAllPublications());
    }

    /**
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

    public function addPublicationInterests(int $publicationId, AddPublicationInterestRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Allow one or multiple interests
        $interestIds = $data['interests'];

        $addedInterests = $this->publicationService->addPublicationInterests($publicationId,  $interestIds);

        return response()->json([
            'message' => 'Interests added successfully.',
            'interests' => $addedInterests,
        ]);
    }

    /**
     * Grant special access to a private publication.
     * Access can only be granted if the publication visibility is 'private'.
     * @throws AuthorizationException
     */
    public function grantPublicationAccess(int $publicationId, PublicationAccessRequest $request): JsonResponse
    {
        $data = $request->validated();

        $userIds = $data['user_ids'] ?? [];
        $roles = $data['roles'] ?? [];

        // Grant access to multiple users and/or roles
        $grantedAccess = $this->publicationService->grantPublicationAccess(
            $publicationId,
            $userIds,
            $roles
        );

        return response()->json([
            'message' => 'Access granted successfully.',
            'access' => $grantedAccess,
        ]);
    }

    /**
     * Revoke access to a publication.
     * Can revoke access either by user IDs or by roles.
     * @throws AuthorizationException
     */
    public function revokePublicationAccess(int $publicationId, PublicationAccessRequest $request): JsonResponse
    {
        $data = $request->validated();

        $userIds = $data['user_ids'] ?? [];
        $roles = $data['roles'] ?? [];

        // Revoke access from multiple users and/or roles
        $revokedAccess = $this->publicationService->revokePublicationAccess(
            $publicationId,
            $userIds,
            $roles
        );

        return response()->json([
            'message' => 'Access revoked successfully.',
            'revoked' => $revokedAccess,
        ]);
    }

}
