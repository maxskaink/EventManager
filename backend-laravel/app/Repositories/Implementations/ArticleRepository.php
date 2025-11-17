<?php

namespace App\Repositories\Implementations;

use App\Models\Article;
use App\Repositories\Contracts\ArticleRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ArticleRepository implements ArticleRepositoryInterface
{
    /**
     * Create a new article.
     *
     * @param array $data
     * @return Article
     */
    public function create(array $data): Article
    {
        return Article::query()->create($data);
    }

    /**
     * Update an existing article.
     *
     * @param int $id
     * @param array $data
     * @return Article
     */
    public function update(int $id, array $data): Article
    {
        $article = Article::query()->findOrFail($id);
        $article->update($data);
        return $article;
    }

    /**
     * Find an article by its ID.
     *
     * @param int $id
     * @return Article|null
     */
    public function findById(int $id): ?Article
    {
        return Article::query()->find($id);
    }

    /**
     * Get all articles belonging to a specific user.
     *
     * @param int $userId
     * @return Collection<int, Article>
     */
    public function findByUserId(int $userId): Collection
    {
        return Article::query()
            ->where('user_id', $userId)
            ->orderByDesc('created_at')
            ->get();
    }

    /**
     * Get all articles in the system.
     *
     * @return Collection<int, Article>
     */
    public function findAll(): Collection
    {
        return Article::query()
            ->orderByDesc('created_at')
            ->get();
    }

    /**
     * Get all articles published within a specific date range.
     *
     * @param string $startDate
     * @param string $endDate
     * @return Collection<int, Article>
     */
    public function findByDateRange(string $startDate, string $endDate): Collection
    {
        return Article::query()
            ->whereBetween('created_at', [$startDate, $endDate])
            ->orderByDesc('created_at')
            ->get();
    }

    /**
     * Delete an article by its ID.
     *
     * @param int $id
     * @return bool True if deleted, false otherwise.
     */
    public function delete(int $id): bool
    {
        return Article::query()->where('id', $id)->delete() > 0;
    }

    /**
     * Get all distinct trusted organizations.
     *
     * @return array<int, string>
     */
    public function getAllTrustedOrganizations(): array
    {
        return Article::query()
            ->select('trusted_organization')
            ->distinct()
            ->pluck('trusted_organization')
            ->toArray();
    }
}
