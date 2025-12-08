<?php

namespace App\Repositories\Implementations;

use App\Models\Article;
use App\Repositories\Contracts\ArticleRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ArticleRepository implements ArticleRepositoryInterface
{
    /**
     * {@inheritDoc}
     */
    public function create(array $data): Article
    {
        // Mass assignment using the fillable attributes defined in the Article model.
        return Article::query()->create($data);
    }

    /**
     * {@inheritDoc}
     */
    public function update(int $id, array $data): Article
    {
        // Find the article or throw ModelNotFoundException if not found.
        $article = Article::query()->findOrFail($id);

        // Update attributes and save.
        $article->update($data);

        return $article;
    }

    /**
     * {@inheritDoc}
     */
    public function findById(int $id): ?Article
    {
        // Retrieve article by primary key, return null if not found.
        return Article::query()->find($id);
    }

    /**
     * {@inheritDoc}
     */
    public function findByUserId(int $userId): Collection
    {
        // Filter articles by author ID and order by creation date (newest first).
        return Article::query()
            ->where('user_id', $userId)
            ->orderByDesc('created_at')
            ->get();
    }

    /**
     * {@inheritDoc}
     */
    public function findAll(): Collection
    {
        // Retrieve all articles ordered by creation date (newest first).
        return Article::query()
            ->orderByDesc('created_at')
            ->get();
    }

    /**
     * {@inheritDoc}
     */
    public function findByDateRange(string $startDate, string $endDate): Collection
    {
        // Filter articles where publication_date is within the given range (inclusive).
        return Article::query()
            ->whereBetween('publication_date', [$startDate, $endDate])
            ->orderByDesc('publication_date')
            ->get();
    }

    /**
     * {@inheritDoc}
     */
    public function delete(int $id): bool
    {
        // Delete the article and return true if at least one row was affected.
        return Article::query()->where('id', $id)->delete() > 0;
    }

    /**
     * {@inheritDoc}
     */
    public function getAllTrustedOrganizations(): array
    {
        // Retrieve distinct 'trusted_organization' values from the articles table.
        return Article::query()
            ->select('trusted_organization')
            ->distinct()
            ->pluck('trusted_organization')
            ->toArray();
    }
}
