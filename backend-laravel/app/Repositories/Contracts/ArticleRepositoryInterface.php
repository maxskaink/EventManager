<?php

namespace App\Repositories\Contracts;

use App\Models\Article;
use Illuminate\Database\Eloquent\Collection;

interface ArticleRepositoryInterface
{
    /**
     * Create a new article.
     *
     * @param array $data
     * @return Article
     */
    public function create(array $data): Article;

    /**
     * Update an existing article.
     *
     * @param int $id
     * @param array $data
     * @return Article
     */
    public function update(int $id, array $data): Article;

    /**
     * Find an article by its ID.
     *
     * @param int $id
     * @return Article|null
     */
    public function findById(int $id): ?Article;

    /**
     * Get all articles belonging to a specific user.
     *
     * @param int $userId
     * @return Collection<int, Article>
     */
    public function findByUserId(int $userId): Collection;

    /**
     * Get all articles in the system.
     *
     * @return Collection<int, Article>
     */
    public function findAll(): Collection;

    /**
     * Get all articles published within a specific date range.
     *
     * @param string $startDate
     * @param string $endDate
     * @return Collection<int, Article>
     */
    public function findByDateRange(string $startDate, string $endDate): Collection;

    /**
     * Delete an article by its ID.
     *
     * @param int $id
     * @return bool True if deleted, false otherwise.
     */
    public function delete(int $id): bool;

    /**
     * Get all trusted organizations (distinct values).
     *
     * @return array<int, string>
     */
    public function getAllTrustedOrganizations(): array;
}
