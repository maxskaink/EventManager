<?php

namespace App\Repositories\Implementations;

use App\Models\PublicationAccess;
use App\Repositories\Contracts\PublicationAccessRepositoryInterface;

class PublicationAccessRepository implements PublicationAccessRepositoryInterface
{
    public function exists(int $pubId, int $profileId): bool
    {
        return PublicationAccess::query()
            ->where('publication_id', $pubId)
            ->where('profile_id', $profileId)
            ->exists();
    }

    public function create(int $pubId, int $profileId): void
    {
        PublicationAccess::query()->create([
            'publication_id' => $pubId,
            'profile_id'     => $profileId
        ]);
    }

    public function deleteForUsers(int $pubId, array $userIds): array
    {
        return PublicationAccess::query()
            ->where('publication_id', $pubId)
            ->whereIn('profile_id', $userIds)
            ->delete();
    }
}
