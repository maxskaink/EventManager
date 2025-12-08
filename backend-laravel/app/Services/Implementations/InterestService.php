<?php

namespace App\Services\Implementations;

use App\Exceptions\DuplicatedResourceException;
use App\Models\Interest;
use App\Repositories\Contracts\InterestRepositoryInterface;
use App\Services\Contracts\InterestServiceInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class InterestService implements InterestServiceInterface
{
    public function __construct(
        private readonly InterestRepositoryInterface $interestRepository
    ) {
    }

    /**
     * {@inheritDoc}
     *
     * @throws DuplicatedResourceException
     */
    /**
     * {@inheritDoc}
     *
     * @throws DuplicatedResourceException
     */
    public function addInterest(array $data): Interest
    {
        // Check duplicate keyword to ensure uniqueness
        $existing = $this->interestRepository->findByKeyword($data['keyword']);

        if ($existing) {
            throw new DuplicatedResourceException(
                "The interest '{$data['keyword']}' already exists."
            );
        }

        return $this->interestRepository->create($data);
    }

    /**
     * {@inheritDoc}
     */
    public function getAllInterests(): Collection
    {
        return $this->interestRepository->findAll();
    }

    /**
     * {@inheritDoc}
     *
     * @throws ModelNotFoundException
     */
    public function deleteInterest(int $interestId): void
    {
        $interest = $this->interestRepository->findById($interestId);

        if (!$interest) {
            throw new ModelNotFoundException('The specified interest does not exist.');
        }

        $this->interestRepository->delete($interestId);
    }
}
