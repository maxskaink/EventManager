<?php

namespace App\Http\Controllers;

use App\Http\Requests\Publication\AddPublicationInterestRequest;
use App\Http\Requests\Publication\AddPublicationRequest;
use App\Http\Requests\Publication\PublicationAccessRequest;
use App\Http\Requests\Publication\UpdatePublicationRequest;
use App\Models\Publication;
use App\Models\User;
use App\Services\Contracts\PublicationServiceInterface;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class PublicationController extends Controller
{
    protected PublicationServiceInterface $publicationService;

    public function __construct(PublicationServiceInterface $publicationService)
    {
        $this->publicationService = $publicationService;
    }

    /**
     * Create a new publication.
     *
     * @throws AuthorizationException
     */
    public function addPublication(AddPublicationRequest $request): JsonResponse
    {
        $userId = request()->user()->id;
        $data = $request->validated();
        $this->authorize('create', Publication::class);

        $newPublication = $this->publicationService->addPublication($data, $userId);

        return response()->json([
            'message' => 'Publication created successfully.',
            'publication' => $newPublication,
        ]);
    }

    /**
     * Create a new publication related to an event.
     *
     * @throws AuthorizationException
     */
    public function addEventPublication(AddPublicationRequest $request, int $eventId): JsonResponse
    {
        $userId = request()->user()->id;
        $data = $request->validated();
        $this->authorize('create', Publication::class);

        $newPublication = $this->publicationService->addEventPublication($data, $eventId, $userId);

        return response()->json([
            'message' => 'Event publication created successfully.',
            'publication' => $newPublication,
        ]);
    }

    /**
     * List all publications (restricted to mentors/coordinators).
     *
     * @throws AuthorizationException
     */
    public function listAllPublications(): JsonResponse
    {
        $this->authorize('viewAny', Publication::class);

        $publications = $this->publicationService->listAllPublications();

        return response()->json([
            'publications' => $publications,
        ]);
    }

    /**
     * List all published publications.
     */
    public function listPublishedPublications(): JsonResponse
    {
        $user = request()->user();
        // Public — no policy needed
        return response()->json([
            'publications' => $this->publicationService->listPublishedPublications($user),
        ]);
    }

    /**
     * List all draft publications (restricted to mentors/coordinators).
     *
     * @throws AuthorizationException
     */
    public function listDraftPublications(): JsonResponse
    {
        $this->authorize('viewAny', Publication::class);

        $publications = $this->publicationService->listDraftPublications();

        return response()->json([
            'publications' => $publications,
        ]);
    }

    /**
     * Update a publication.
     *
     * @throws AuthorizationException
     */
    public function updatePublication(UpdatePublicationRequest $request, int $id): JsonResponse
    {
        $data = $request->validated();

        $publication = Publication::query()->findOrFail($id);
        $this->authorize('update', $publication);

        $updatedPublication = $this->publicationService->updatePublication($id, $data);

        return response()->json([
            'message' => 'Publication updated successfully.',
            'publication' => $updatedPublication,
        ]);
    }

    /**
     * Add interests to a publication.
     *
     * @throws AuthorizationException
     */
    public function addPublicationInterests(int $publicationId, AddPublicationInterestRequest $request): JsonResponse
    {
        $publication = Publication::query()->findOrFail($publicationId);
        $this->authorize('update', $publication);

        $data = $request->validated();
        $interestIds = $data['interests'];

        $addedInterests = $this->publicationService->addPublicationInterests($publicationId, $interestIds);

        return response()->json([
            'message' => 'Interests added successfully.',
            'interests' => $addedInterests,
        ]);
    }

    /**
     * Grant special access to a private publication.
     *
     * @throws AuthorizationException
     */
    public function grantPublicationAccess(int $publicationId, PublicationAccessRequest $request): JsonResponse
    {
        $this->authorize('grantAccess', Publication::class);

        $data = $request->validated();
        $userIds = $data['user_ids'] ?? [];
        $roles = $data['roles'] ?? [];

        $grantedAccess = $this->publicationService->grantPublicationAccess($publicationId, $userIds, $roles);

        return response()->json([
            'message' => 'Access granted successfully.',
            'access' => $grantedAccess,
        ]);
    }

    /**
     * Revoke access to a publication.
     *
     * @throws AuthorizationException
     */
    public function revokePublicationAccess(int $publicationId, PublicationAccessRequest $request): JsonResponse
    {
        $this->authorize('grantAccess', Publication::class);

        $data = $request->validated();
        $userIds = $data['user_ids'] ?? [];
        $roles = $data['roles'] ?? [];

        $revokedAccess = $this->publicationService->revokePublicationAccess($publicationId, $userIds, $roles);

        return response()->json([
            'message' => 'Access revoked successfully.',
            'revoked' => $revokedAccess,
        ]);
    }

    /**
     * Get a specific publication by ID.
     *
     */
    public function getPublicationById(int $id): JsonResponse
    {

        $user = request()->user();
        $publication = $this->publicationService->getPublicationById($id, $user);

        return response()->json([
            'publication' => $publication,
        ]);
    }

}
