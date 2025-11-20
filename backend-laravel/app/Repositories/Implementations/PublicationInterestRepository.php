<?php

namespace App\Repositories\Implementations;

use App\Models\PublicationInterest;
use App\Repositories\Contracts\PublicationInterestRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class PublicationInterestRepository implements PublicationInterestRepositoryInterface
{
    public function exists(int $pubId, int $interestId): bool
    {
        return PublicationInterest::query()
            ->where('publication_id', $pubId)
            ->where('interest_id', $interestId)
            ->exists();
    }

    public function create(int $pubId, int $interestId): void
    {
        PublicationInterest::query()->create([
            'publication_id' => $pubId,
            'interest_id' => $interestId
        ]);
    }

    public function getByPublication(int $pubId): Collection
    {
        return PublicationInterest::query()
            ->where('publication_id', $pubId)
            ->get();
    }

    public function getInterestIds(int $pubId): array
    {
        return PublicationInterest::query()
            ->where('publication_id', $pubId)
            ->pluck('interest_id')
            ->toArray();
    }

    public function deleteForPublication(int $pubId, array $interestIds): array
    {
        $deletedIds =  PublicationInterest::query()
            ->where('publication_id', $pubId)
            ->whereIn('interest_id', $interestIds)
            ->pluck('interest_id')
            ->toArray();


        if (!empty($deletedIds)) {
            PublicationInterest::query()
                ->whereIn('interest_id', $deletedIds)
                ->delete();
        }

        return $deletedIds;
    }

}
