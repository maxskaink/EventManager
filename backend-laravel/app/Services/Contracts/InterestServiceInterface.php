<?php

namespace App\Services\Contracts;

use App\Models\Interest;
use Illuminate\Database\Eloquent\Collection;

interface InterestServiceInterface
{
    /**
     * Create and store a new interest.
     *
     * @param array $data
     * @return Interest
     */
    public function addInterest(array $data): Interest;

    /**
     * Get all interests in the system.
     *
     * @return Collection<int, Interest>
     */
    public function getAllInterests(): Collection;

    /**
     * Delete an existing interest.
     *
     * @param int $interestId
     * @return void
     */
    public function deleteInterest(int $interestId): void;
}
