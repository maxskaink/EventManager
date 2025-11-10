<?php

namespace App\Services\Contracts;

use App\Models\Article;
use Illuminate\Database\Eloquent\Collection;

interface ArticleServiceInterface
{
    public function addArticle(array $data): Article;

    public function updateArticle(int $articleId, array $data): Article;

    /**
    * Get articles for a specific user id.
    *
    * @param int $userId
    * @return Collection<int, Article>
    */
    public function getArticlesByUser(int $userId): Collection;



    /**
     * @return Collection<int, Article>
     */
    public function getAllArticles(): Collection;

    /**
     * @param string $startDate
     * @param string $endDate
     * @return Collection<int, Article>
     */
    public function getArticlesByDateRange(string $startDate, string $endDate): Collection;

    public function deleteArticle(int $articleId): void;

    public function getAllTrustedOrganizations() : array;
}
