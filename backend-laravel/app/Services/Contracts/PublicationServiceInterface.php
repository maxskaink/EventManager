<?php

namespace App\Services\Contracts;

use App\Models\Publication;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;

interface PublicationServiceInterface
{
    public function addPublication(array $data, int $userId): Publication;

    public function addEventPublication(array $data, int $eventId, int $userId): Publication;

    /**
     * @return LengthAwarePaginator<int, Publication>
     */
    public function listAllPublications(int $perPage = 15): LengthAwarePaginator;

    /**
     * Show All active publications visibile to the user
     * @return LengthAwarePaginator<int, Publication>
     */
    public function listPublishedPublications(User $user, int $perPage = 15): LengthAwarePaginator;

    public function listFilteredPublications(array $filters, ?User $user, int $perPage = 15): LengthAwarePaginator;

    public function getUsersWithAccess(int $publicationId): Collection;

    /**
     * @return LengthAwarePaginator<int, Publication>
     */
    public function listDraftPublications(int $perPage = 15): LengthAwarePaginator;

    public function updatePublication(int $id, array $data): Publication;

    public function addPublicationInterests(int $publicationId, array $interestIds): array;

    public function grantPublicationAccess(int $publicationId, array $userIds = [], array $roles = []): array;

    public function revokePublicationAccess(int $publicationId, array $userIds = [], array $roles = []): array;

    /**
     * Get a specific publication by ID.
     *
     * @param int $id
     * @param User $user
     * @return Publication
     */
    public function getPublicationById(int $id, User $user): Publication;

    public function setPublicationImage(int $publicationId, UploadedFile $image): Publication;

    public function removePublicationInterests(int $publicationId, array $interestIds): array;

}
