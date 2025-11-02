<?php

namespace App\Services\Implementations;

use App\Exceptions\DuplicatedResourceException;
use App\Models\Article;
use App\Models\User;
use App\Services\Contracts\ArticleServiceInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Carbon;
use InvalidArgumentException;

class ArticleService implements ArticleServiceInterface
{
    /**
     * Create and store a new article for a user.
     *
     * @param array $data
     * @return Article
     *
     * @throws DuplicatedResourceException
     * @throws ModelNotFoundException
     */
    public function addArticle(array $data): Article
    {
        // Ensure the user exists
        $user = User::query()->find($data['user_id']);
        if (!$user) {
            throw new ModelNotFoundException('The specified user does not exist.');
        }

        // Check if an article with the same title already exists for this user
        $existingArticle = Article::query()
            ->where('user_id', $data['user_id'])
            ->where('title', $data['title'])
            ->first();

        if ($existingArticle) {
            throw new DuplicatedResourceException(
                "An article titled '{$data['title']}' already exists for this user."
            );
        }

        $article = new Article();
        $article->fill($data);
        $article->save();

        return $article;
    }

    /**
     * Update an existing article.
     *
     * @param int $articleId
     * @param array $data
     * @return Article
     *
     * @throws ModelNotFoundException
     * @throws DuplicatedResourceException
     */
    public function updateArticle(int $articleId, array $data): Article
    {
        // Find the article
        $article = Article::query()->find($articleId);
        if (!$article) {
            throw new ModelNotFoundException('The specified article does not exist.');
        }

        // If user_id is being changed, verify existence
        if (isset($data['user_id'])) {
            $newUser = User::query()->find($data['user_id']);
            if (!$newUser) {
                throw new ModelNotFoundException('The specified user does not exist.');
            }
        }

        // Check for duplicate title if it was modified
        if (isset($data['title'])) {
            $duplicate = Article::query()
                ->where('user_id', $data['user_id'] ?? $article->user_id)
                ->where('title', $data['title'])
                ->where('id', '!=', $articleId)
                ->first();

            if ($duplicate) {
                throw new DuplicatedResourceException(
                    "An article titled '{$data['title']}' already exists for this user."
                );
            }
        }

        // Update fields safely
        $article->fill($data);
        $article->save();

        return $article;
    }


    /**
     * Get all articles of a specific user.
     *
     * @param int $userId
     * @return Collection<int, Article>
     */
    public function getArticlesByUser(int $userId): Collection
    {
        return Article::query()
            ->where('user_id', $userId)
            ->orderByDesc('publication_date')
            ->get();
    }

    

    /**
     * Get all articles in the system.
     *
     * @return Collection<int, Article>
     */
    public function getAllArticles(): Collection
    {
        return Article::query()
            ->orderByDesc('publication_date')
            ->get();
    }

    /**
     * Get all articles published within a specific date range.
     *
     * @param string $startDate  (format: Y-m-d)
     * @param string $endDate    (format: Y-m-d)
     * @return Collection<int, Article>
     *
     * @throws InvalidArgumentException
     */
    public function getArticlesByDateRange(string $startDate, string $endDate): Collection
    {
        $start = Carbon::parse($startDate);
        $end = Carbon::parse($endDate);

        if ($end->isBefore($start)) {
            throw new InvalidArgumentException('The end date cannot be earlier than the start date.');
        }

        return Article::query()
            ->whereBetween('publication_date', [$start, $end])
            ->orderBy('publication_date')
            ->get();
    }

    /**
     * Delete an existing article.
     *
     * @param int $articleId
     * @return void
     *
     * @throws ModelNotFoundException
     */
    public function deleteArticle(int $articleId): void
    {
        // Find the article
        $article = Article::query()->find($articleId);
        if (!$article) {
            throw new ModelNotFoundException('The specified article does not exist.');
        }
        // Delete the article
        $article->delete();
    }
}
