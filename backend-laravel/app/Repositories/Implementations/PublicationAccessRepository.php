<?php

namespace App\Repositories\Implementations;

use App\Models\PublicationAccess;
use App\Repositories\Contracts\PublicationAccessRepositoryInterface;

class PublicationAccessRepository implements PublicationAccessRepositoryInterface
{
    /**
     * {@inheritDoc}
     */
    public function exists(int $pubId, int $profileId): bool
    {
        return PublicationAccess::query()
            ->where('publication_id', $pubId)
            ->where('profile_id', $profileId)
            ->exists();
    }

    /**
     * {@inheritDoc}
     */
    public function create(int $pubId, int $profileId): void
    {
        PublicationAccess::query()->create([
            'publication_id' => $pubId,
            'profile_id' => $profileId
        ]);
    }

    /**
     * {@inheritDoc}
     */
    public function deleteForUsers(int $pubId, array $userIds): array
    {
        // Identify which users from the list actually have access.
        $deletedIds = PublicationAccess::query()
            ->where('publication_id', $pubId)
            ->whereIn('profile_id', $userIds)
            ->pluck('profile_id')
            ->toArray();

        // Delete access for those users.
        if (!empty($deletedIds)) {
            PublicationAccess::query()
                ->whereIn('profile_id', $deletedIds)
                ->delete();
        }

        return $deletedIds;
    }

    /**
     * {@inheritDoc}
     */
    public function deleteAllForPublication(int $pubId): int
    {
        return PublicationAccess::query()
            ->where('publication_id', $pubId)
            ->delete();
    }


}
