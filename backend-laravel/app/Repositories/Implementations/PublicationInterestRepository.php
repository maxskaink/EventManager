<?php

namespace App\Repositories\Implementations;

use App\Models\PublicationInterest;
use App\Repositories\Contracts\PublicationInterestRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class PublicationInterestRepository implements PublicationInterestRepositoryInterface
{
    /**
     * {@inheritDoc}
     */
    public function exists(int $pubId, int $interestId): bool
    {
        return PublicationInterest::query()
            ->where('publication_id', $pubId)
            ->where('interest_id', $interestId)
            ->exists();
    }

    /**
     * {@inheritDoc}
     */
    public function create(int $pubId, int $interestId): void
    {
        PublicationInterest::query()->create([
            'publication_id' => $pubId,
            'interest_id' => $interestId
        ]);
    }

    /**
     * {@inheritDoc}
     */
    public function getByPublication(int $pubId): Collection
    {
        return PublicationInterest::query()
            ->where('publication_id', $pubId)
            ->get();
    }

    /**
     * {@inheritDoc}
     */
    public function getInterestIds(int $pubId): array
    {
        // Retrieve just the interest IDs for a publication.
        return PublicationInterest::query()
            ->where('publication_id', $pubId)
            ->pluck('interest_id')
            ->toArray();
    }

    /**
     * {@inheritDoc}
     */
    public function deleteForPublication(int $pubId, array $interestIds): array
    {
        // Identify which interests from the list are actually associated.
        $deletedIds = PublicationInterest::query()
            ->where('publication_id', $pubId)
            ->whereIn('interest_id', $interestIds)
            ->pluck('interest_id')
            ->toArray();

        // Delete the associations.
        if (!empty($deletedIds)) {
            PublicationInterest::query()
                ->whereIn('interest_id', $deletedIds)
                ->delete();
        }

        return $deletedIds;
    }

    /**
     * {@inheritDoc}
     */
    public function deleteAllForPublication(int $pubId): int
    {
        return PublicationInterest::query()
            ->where('publication_id', $pubId)
            ->delete();
    }

}
