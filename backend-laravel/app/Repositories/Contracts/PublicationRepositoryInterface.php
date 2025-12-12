<?php

namespace App\Repositories\Contracts;

use App\Models\Publication;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface PublicationRepositoryInterface
{
    /**
     * Create a new publication.
     *
     * @param array $data
     * @return Publication
     */
    public function create(array $data): Publication;

    /**
     * Find a publication by its ID.
     *
     * @param int $id
     * @return Publication|null
     */
    public function findById(int $id): ?Publication;

    /**
     * Update an existing publication.
     *
     * @param int $id
     * @param array $data
     * @return Publication
     */
    public function update(int $id, array $data): Publication;

    /**
     * Find a publication by its title.
     *
     * @param string $title
     * @return Publication|null
     */
    public function findByTitle(string $title): ?Publication;

    /**
     * List all publications with pagination.
     *
     * @param int $perPage
     * @return LengthAwarePaginator<int, Publication>
     */
    public function listAll(int $perPage = 15): LengthAwarePaginator;

    /**
     * List all published publications with pagination.
     *
     * @param int $perPage
     * @return LengthAwarePaginator<int, Publication>
     */
    public function listPublished(int $perPage = 15): LengthAwarePaginator;

    /**
     * List all draft publications with pagination.
     *
     * @param int $perPage
     * @return LengthAwarePaginator<int, Publication>
     */
    public function listDrafts(int $perPage = 15): LengthAwarePaginator;

    /**
     * List published publications visible to a specific user.
     *
     * @param User|null $user
     * @param int $perPage
     * @return LengthAwarePaginator<int, Publication>
     */
    public function listPublishedForUser(?User $user, int $perPage = 15): LengthAwarePaginator;

    /**
     * List publications based on filters.
     *
     * @param array $filters
     * @param User|null $user
     * @param int $perPage
     * @return LengthAwarePaginator<int, Publication>
     */
    public function listFiltered(array $filters, ?User $user, int $perPage = 15): LengthAwarePaginator;

    /**
     * Get all users who have access to a specific publication.
     *
     * @param int $publicationId
     * @return Collection<int, User>
     */
    public function getUsersWithAccess(int $publicationId): Collection;
}
