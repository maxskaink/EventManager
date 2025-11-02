<?php

namespace App\Services\Implementations;

use App\Exceptions\DuplicatedResourceException;
use App\Exceptions\InvalidRoleException;
use App\Models\Interest;
use App\Models\User;
use App\Services\Contracts\InterestServiceInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;

class InterestService implements InterestServiceInterface
{
    /**
     * Create and store a new interest.
     *
     * @param array $data
     * @return Interest
     *
     * @throws InvalidRoleException
     * @throws DuplicatedResourceException
     */
    public function addInterest(array $data): Interest
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        // Ensure the authenticated user exists
        if (!$authUser) {
            throw new InvalidRoleException('You must be logged in to add a keyword.');
        }

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
     *
     * @throws InvalidRoleException
     */
    public function getAllInterests(): Collection
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        if (!$authUser) {
            throw new InvalidRoleException('You must be logged in to view interests.');
        }

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
     * @throws InvalidRoleException
     * @throws ModelNotFoundException
     */
    public function deleteInterest(int $interestId): void
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        if (!$authUser) {
            throw new InvalidRoleException('You must be logged in to delete an interest.');
        }

        // Allow only mentors or admins to delete interests
        if (!in_array($authUser->role, ['mentor', 'coordinator'])) {
            throw new InvalidRoleException('You are not allowed to delete interests.');
        }

        $interest = Interest::query()->find($interestId);

        if (!$interest) {
            throw new ModelNotFoundException('The specified interest does not exist.');
        }

        $interest->delete();
    }
}
