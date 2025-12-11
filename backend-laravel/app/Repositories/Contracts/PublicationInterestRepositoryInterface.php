<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;

interface PublicationInterestRepositoryInterface
{
    /**
     * Check if a publication has a specific interest.
     *
     * @param int $pubId
     * @param int $interestId
     * @return bool
     */
    public function exists(int $pubId, int $interestId): bool;

    /**
     * Associate an interest with a publication.
     *
     * @param int $pubId
     * @param int $interestId
     * @return void
     */
    public function create(int $pubId, int $interestId): void;

    /**
     * Get all interests associated with a publication.
     *
     * @param int $pubId
     * @return Collection<int, \App\Models\Interest>
     */
    public function getByPublication(int $pubId): Collection;

    /**
     * Get IDs of all interests associated with a publication.
     *
     * @param int $pubId
     * @return array
     */
    public function getInterestIds(int $pubId): array;

    /**
     * Remove interests from a publication.
     *
     * @param int $pubId
     * @param array $interestIds
     * @return array
     */
    public function deleteForPublication(int $pubId, array $interestIds): array;

    /**
     * Remove all interests from a publication.
     *
     * @param int $pubId
     * @return int Number of deleted records
     */
    public function deleteAllForPublication(int $pubId): int;
}
