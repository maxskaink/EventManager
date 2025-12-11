<?php

namespace App\Services\Contracts;

use App\Models\Publication;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;

interface PublicationServiceInterface
{
    /**
     * Create a new publication.
     *
     * @param array $data
     * @param int $userId
     * @return Publication
     */
    public function addPublication(array $data, int $userId): Publication;

    /**
     * Create a new publication associated with an event.
     *
     * @param array $data
     * @param int $eventId
     * @param int $userId
     * @return Publication
     */
    public function addEventPublication(array $data, int $eventId, int $userId): Publication;

    /**
     * List all publications (admin view).
     *
     * @param int $perPage
     * @return LengthAwarePaginator<int, Publication>
     */
    public function listAllPublications(int $perPage = 15): LengthAwarePaginator;

    /**
     * Show all active publications visible to the user.
     *
     * @param User $user
     * @param int $perPage
     * @return LengthAwarePaginator<int, Publication>
     */
    public function listPublishedPublications(User $user, int $perPage = 15): LengthAwarePaginator;

    /**
     * List publications based on filters.
     *
     * @param array $filters
     * @param User|null $user
     * @param int $perPage
     * @return LengthAwarePaginator<int, Publication>
     */
    public function listFilteredPublications(array $filters, ?User $user, int $perPage = 15): LengthAwarePaginator;

    /**
     * Get users who have access to a specific publication.
     *
     * @param int $publicationId
     * @return Collection<int, User>
     */
    public function getUsersWithAccess(int $publicationId): Collection;

    /**
     * List draft publications.
     *
     * @param int $perPage
     * @return LengthAwarePaginator<int, Publication>
     */
    public function listDraftPublications(int $perPage = 15): LengthAwarePaginator;

    /**
     * Update an existing publication.
     *
     * @param int $id
     * @param array $data
     * @return Publication
     */
    public function updatePublication(int $id, array $data): Publication;

    /**
     * Associate interests with a publication.
     *
     * @param int $publicationId
     * @param array $interestIds
     * @return array
     */
    public function addPublicationInterests(int $publicationId, array $interestIds): array;

    /**
     * Grant access to a publication for specific users or roles.
     *
     * @param int $publicationId
     * @param array $userIds
     * @param array $roles
     * @return array
     */
    public function grantPublicationAccess(int $publicationId, array $userIds = [], array $roles = []): array;

    /**
     * Revoke access to a publication for specific users or roles.
     *
     * @param int $publicationId
     * @param array $userIds
     * @param array $roles
     * @return array
     */
    public function revokePublicationAccess(int $publicationId, array $userIds = [], array $roles = []): array;

    /**
     * Get a specific publication by ID.
     *
     * @param int $id
     * @param User $user
     * @return Publication
     */
    public function getPublicationById(int $id, User $user): Publication;

    /**
     * Upload and set an image for a publication.
     *
     * @param int $publicationId
     * @param UploadedFile $image
     * @return Publication
     */
    public function setPublicationImage(int $publicationId, UploadedFile $image): Publication;

    /**
     * Remove interests from a publication.
     *
     * @param int $publicationId
     * @param array $interestIds
     * @return array
     */
    public function removePublicationInterests(int $publicationId, array $interestIds): array;

    /**
     * Soft delete a publication and clean up related data.
     *
     * @param int $id
     * @return Publication
     */
    public function deletePublication(int $id): Publication;
}
