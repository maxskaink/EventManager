<?php

namespace App\Services\Contracts;

use App\Models\Publication;
use Illuminate\Database\Eloquent\Collection;

interface PublicationServiceInterface
{
    public function addPublication(array $data): Publication;

    public function addEventPublication(array $data, int $eventId): Publication;

    /**
     * @return Collection<int, Publication>
     */
    public function listAllPublications(): Collection;

    /**
     * @return Collection<int, Publication>
     */
    public function listPublishedPublications(): Collection;

    /**
     * @return Collection<int, Publication>
     */
    public function listDraftPublications(): Collection;

    public function updatePublication(int $id, array $data): Publication;

    public function addPublicationInterests(int $id, array $interestIds): array;

    public function grantPublicationAccess(int $publicationId, array $userIds = [], array $roles = []): array;

    public function revokePublicationAccess(int $publicationId, array $userIds = [], array $roles = []): array;
}
