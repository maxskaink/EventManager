<?php

namespace App\Repositories\Contracts;

use App\Models\Interest;
use Illuminate\Database\Eloquent\Collection;

interface InterestRepositoryInterface
{
    /**
     * Create a new interest.
     *
     * @param array $data
     * @return Interest
     */
    public function create(array $data): Interest;

    /**
     * Find an interest by its keyword.
     *
     * @param string $keyword
     * @return Interest|null
     */
    public function findByKeyword(string $keyword): ?Interest;

    /**
     * Retrieve all interests.
     *
     * @return Collection<int, Interest>
     */
    public function findAll(): Collection;

    /**
     * Find an interest by its ID.
     *
     * @param int $id
     * @return Interest|null
     */
    public function findById(int $id): ?Interest;

    /**
     * Delete an interest by its ID.
     *
     * @param int $id
     * @return void
     */
    public function delete(int $id): void;
}
