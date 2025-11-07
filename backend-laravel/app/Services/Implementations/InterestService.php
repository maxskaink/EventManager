<?php

namespace App\Services\Implementations;

use App\Exceptions\DuplicatedResourceException;
use App\Models\Interest;
use App\Services\Contracts\InterestServiceInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class InterestService implements InterestServiceInterface
{
    /**
     * Create and store a new interest.
     *
     * @param array $data
     * @return Interest
     *
     * @throws DuplicatedResourceException
     */
    public function addInterest(array $data): Interest
    {
        // Check if the keyword already exists (case-insensitive)
        $existingInterest = Interest::query()
            ->whereRaw('LOWER(keyword) = ?', [strtolower($data['keyword'])])
            ->first();

        if ($existingInterest) {
            throw new DuplicatedResourceException(
                "The interest '{$data['keyword']}' already exists."
            );
        }

        $interest = new Interest();
        $interest->fill($data);
        $interest->save();

        return $interest;
    }

    /**
     * Get all interests in the system.
     *
     * @return Collection<int, Interest>
     */
    public function getAllInterests(): Collection
    {
        return Interest::query()
            ->orderBy('keyword')
            ->get();
    }

    /**
     * Delete an existing interest.
     *
     * @param int $interestId
     * @return void
     *
     * @throws ModelNotFoundException
     */
    public function deleteInterest(int $interestId): void
    {
        $interest = Interest::query()->find($interestId);

        if (!$interest) {
            throw new ModelNotFoundException('The specified interest does not exist.');
        }

        $interest->delete();
    }
}
