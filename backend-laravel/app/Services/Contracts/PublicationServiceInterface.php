<?php

namespace App\Services\Contracts;

use App\Models\Publication;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

interface PublicationServiceInterface
{
    public function addPublication(array $data, int $userId): Publication;

    public function addEventPublication(array $data, int $eventId, int $userId): Publication;

    /**
     * @return Collection<int, Publication>
     */
    public function listAllPublications(): Collection;

    /**
     * Show All active publications visibile to the user
     * @return Collection<int, Publication>
     */
    public function listPublishedPublications(User $user): Collection;

    /**
     * @return Collection<int, Publication>
     */
    public function listDraftPublications(): Collection;

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

}
