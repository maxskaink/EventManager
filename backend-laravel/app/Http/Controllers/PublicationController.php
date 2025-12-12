<?php

namespace App\Http\Controllers;

use App\Http\Requests\Publication\AddPublicationInterestRequest;
use App\Http\Requests\Publication\AddPublicationRequest;
use App\Http\Requests\Publication\FilterPublicationRequest;
use App\Http\Requests\Publication\PublicationAccessRequest;
use App\Http\Requests\Publication\SetPublicationImageRequest;
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

    /**
     * Create a new instance of PublicationController.
     *
     * @param PublicationServiceInterface $publicationService The service to handle publication logic.
     */
    public function __construct(PublicationServiceInterface $publicationService)
    {
        $this->publicationService = $publicationService;
    }

    /**
     * Create a new publication.
     *
     * @param AddPublicationRequest $request The request containing publication data.
     * @return JsonResponse The created publication and a success message.
     * @throws AuthorizationException If the user is not authorized.
     */
    public function addPublication(AddPublicationRequest $request): JsonResponse
    {
        $userId = request()->user()->id;
        $data = $request->validated();

        // Authorization: check if the user can create publications
        $this->authorize('create', Publication::class);

        $newPublication = $this->publicationService->addPublication($data, $userId);

        return response()->json([
            'message' => 'Publication created successfully.',
            'publication' => $newPublication,
        ], 201);
    }

    /**
     * Create a new publication related to an event.
     *
     * @param AddPublicationRequest $request The request containing publication data.
     * @param int $eventId The ID of the event.
     * @return JsonResponse The created publication and a success message.
     * @throws AuthorizationException If the user is not authorized.
     */
    public function addEventPublication(AddPublicationRequest $request, int $eventId): JsonResponse
    {
        $userId = request()->user()->id;
        $data = $request->validated();

        // Authorization: check if the user can create publications
        $this->authorize('create', Publication::class);

        $newPublication = $this->publicationService->addEventPublication($data, $eventId, $userId);

        return response()->json([
            'message' => 'Event publication created successfully.',
            'publication' => $newPublication,
        ], 201);
    }

    /**
     * List all publications (restricted to mentors/coordinators).
     *
     * @return JsonResponse A list of all publications.
     * @throws AuthorizationException If the user is not authorized.
     */
    public function listAllPublications(): JsonResponse
    {
        // Authorization: only mentors/coordinators can view all publications
        $this->authorize('viewAny', Publication::class);

        $perPage = request()->input('per_page', 15);
        $publications = $this->publicationService->listAllPublications($perPage);

        return response()->json([
            'publications' => $publications,
        ]);
    }

    /**
     * List all published publications.
     *
     * @return JsonResponse A list of published publications.
     */
    public function listPublishedPublications(): JsonResponse
    {
        // Try to get authenticated user via Sanctum token
        $user = \Laravel\Sanctum\PersonalAccessToken::findToken(
            request()->bearerToken()
        )?->tokenable;
        
        $perPage = request()->input('per_page', 15);

        // Public endpoint — no policy needed, service handles visibility logic
        return response()->json([
            'publications' => $this->publicationService->listPublishedPublications($user, $perPage),
        ]);
    }

    /**
     * List publications with filters.
     *
     * @param FilterPublicationRequest $request The request containing filters.
     * @return JsonResponse A list of filtered publications.
     */
    public function listFilteredPublications(FilterPublicationRequest $request): JsonResponse
    {
        // Try to get authenticated user via Sanctum token
        $user = \Laravel\Sanctum\PersonalAccessToken::findToken(
            request()->bearerToken()
        )?->tokenable;
        
        // DEBUG: Log user information
        \Log::info('PublicationController::listFilteredPublications - User info', [
            'user_is_null' => $user === null,
            'user_id' => $user?->id,
            'user_role' => $user?->role,
            'has_auth_header' => request()->hasHeader('Authorization'),
        ]);
        
        $data = $request->validated();
        $perPage = $data['per_page'] ?? 15;

        $filters = [
            'type' => $data['type'] ?? null,
            'date_from' => $data['date_from'] ?? null,
            'date_to' => $data['date_to'] ?? null,
            'search' => $data['search'] ?? null,
        ];

        return response()->json([
            'publications' => $this->publicationService->listFilteredPublications($filters, $user, $perPage),
        ]);
    }

    /**
     * List all draft publications (restricted to mentors/coordinators).
     *
     * @return JsonResponse A list of draft publications.
     * @throws AuthorizationException If the user is not authorized.
     */
    public function listDraftPublications(): JsonResponse
    {
        // Authorization: only mentors/coordinators can view drafts
        $this->authorize('viewAny', Publication::class);

        $perPage = request()->input('per_page', 15);
        $publications = $this->publicationService->listDraftPublications($perPage);

        return response()->json([
            'publications' => $publications,
        ]);
    }

    /**
     * Update a publication.
     *
     * @param UpdatePublicationRequest $request The request containing updated publication data.
     * @param int $id The ID of the publication to update.
     * @return JsonResponse The updated publication and a success message.
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException If the publication is not found.
     * @throws AuthorizationException If the user is not authorized.
     */
    public function updatePublication(UpdatePublicationRequest $request, int $id): JsonResponse
    {
        $data = $request->validated();

        $publication = Publication::query()->findOrFail($id);

        // Authorization: check if the user can update this publication
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
     * @param int $publicationId The ID of the publication.
     * @param AddPublicationInterestRequest $request The request containing interest IDs.
     * @return JsonResponse The added interests and a success message.
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException If the publication is not found.
     * @throws AuthorizationException If the user is not authorized.
     */
    public function addPublicationInterests(int $publicationId, AddPublicationInterestRequest $request): JsonResponse
    {
        $publication = Publication::query()->findOrFail($publicationId);

        // Authorization: check if the user can update this publication
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
     * Get all interests associated with a publication.
     *
     * @param int $publicationId The ID of the publication.
     * @return JsonResponse A list of interests.
     */
    public function getPublicationInterests(int $publicationId): JsonResponse
    {
        $interests = $this->publicationService->getPublicationInterests($publicationId);

        return response()->json([
            'interests' => $interests,
        ]);
    }

    /**
     * Grant special access to a private publication.
     *
     * @param int $publicationId The ID of the publication.
     * @param PublicationAccessRequest $request The request containing user IDs or roles.
     * @return JsonResponse The granted access details and a success message.
     * @throws AuthorizationException If the user is not authorized.
     */
    public function grantPublicationAccess(int $publicationId, PublicationAccessRequest $request): JsonResponse
    {
        // Authorization: check if the user can grant access
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
     * @param int $publicationId The ID of the publication.
     * @param PublicationAccessRequest $request The request containing user IDs or roles.
     * @return JsonResponse The revoked access details and a success message.
     * @throws AuthorizationException If the user is not authorized.
     */
    public function revokePublicationAccess(int $publicationId, PublicationAccessRequest $request): JsonResponse
    {
        // Authorization: check if the user can revoke access
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
     * Public endpoint - authentication is optional.
     * If authenticated, user can see private publications they have access to.
     * If not authenticated, only public publications are visible.
     *
     * @param int $id The ID of the publication.
     * @return JsonResponse The publication data.
     */
    public function getPublicationById(int $id): JsonResponse
    {
        // Try to get authenticated user via Sanctum token (optional authentication)
        $user = \Laravel\Sanctum\PersonalAccessToken::findToken(
            request()->bearerToken()
        )?->tokenable;

        $publication = $this->publicationService->getPublicationById($id, $user);

        return response()->json([
            'publication' => $publication,
        ]);
    }

    /**
     * Set the image for a publication.
     *
     * @param SetPublicationImageRequest $request The request containing the image file.
     * @param int $id The ID of the publication.
     * @return JsonResponse The updated publication and a success message.
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException If the publication is not found.
     * @throws AuthorizationException If the user is not authorized.
     */
    public function setPublicationImage(SetPublicationImageRequest $request, int $id): JsonResponse
    {
        $publication = Publication::query()->findOrFail($id);

        // Authorization: check if the user can update this publication
        $this->authorize('update', $publication);

        $image = $request->file('image');
        $updatedPublication = $this->publicationService->setPublicationImage($id, $image);

        return response()->json([
            'message' => 'Publication image updated successfully.',
            'publication' => $updatedPublication,
        ]);
    }

    /**
     * Remove interests from a publication.
     *
     * @param int $publicationId The ID of the publication.
     * @param AddPublicationInterestRequest $request The request containing interest IDs.
     * @return JsonResponse The removed interests and a success message.
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException If the publication is not found.
     * @throws AuthorizationException If the user is not authorized.
     */
    public function removePublicationInterests(int $publicationId, AddPublicationInterestRequest $request): JsonResponse
    {
        $publication = Publication::query()->findOrFail($publicationId);

        // Authorization: check if the user can update this publication
        $this->authorize('update', $publication);

        $data = $request->validated();
        $interestIds = $data['interests'];

        $removedInterests = $this->publicationService->removePublicationInterests($publicationId, $interestIds);

        return response()->json([
            'message' => 'Interests removed successfully.',
            'removed interests' => $removedInterests,
        ]);
    }

    /**
     * Get users with access to a publication.
     *
     * @param int $publicationId The ID of the publication.
     * @return JsonResponse A list of users with access.
     * @throws AuthorizationException If the user is not authorized.
     */
    public function getUsersWithAccess(int $publicationId): JsonResponse
    {
        // Authorization: check if the user can view access details
        $this->authorize('viewAccess', Publication::class);

        return response()->json([
            'users' => $this->publicationService->getUsersWithAccess($publicationId),
        ]);
    }

    /**
     * Soft delete a publication.
     *
     * @param int $id The ID of the publication to delete.
     * @return JsonResponse The deleted publication and a success message.
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException If the publication is not found.
     * @throws AuthorizationException If the user is not authorized.
     */
    public function deletePublication(int $id): JsonResponse
    {
        $publication = Publication::query()->findOrFail($id);

        // Authorization: check if the user can delete this publication
        $this->authorize('delete', $publication);

        $deletedPublication = $this->publicationService->deletePublication($id);

        return response()->json([
            'message' => 'Publication deleted successfully.',
            'publication' => $deletedPublication,
        ]);
    }



}

