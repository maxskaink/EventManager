<?php

namespace App\Services\Contracts;

use App\Models\Article;
use Illuminate\Database\Eloquent\Collection;

interface ArticleServiceInterface
{
    /**
     * Create a new article.
     *
     * @param array $data
     * @return Article
     */
    public function addArticle(array $data): Article;

    /**
     * Update an existing article.
     *
     * @param int $articleId
     * @param array $data
     * @return Article
     */
    public function updateArticle(int $articleId, array $data): Article;

    /**
     * Get articles for a specific user id.
     *
     * @param int $userId
     * @return Collection<int, Article>
     */
    public function getArticlesByUser(int $userId): Collection;

    /**
     * Get all articles in the system.
     *
     * @return Collection<int, Article>
     */
    public function getAllArticles(): Collection;

    /**
     * Get articles published within a date range.
     *
     * @param string $startDate
     * @param string $endDate
     * @return Collection<int, Article>
     */
    public function getArticlesByDateRange(string $startDate, string $endDate): Collection;

    /**
     * Delete an article by its ID.
     *
     * @param int $articleId
     * @return void
     */
    public function deleteArticle(int $articleId): void;

    /**
     * Get all trusted organizations.
     *
     * @return array<int, string>
     */
    public function getAllTrustedOrganizations(): array;
}
