<?php

namespace App\Services\Implementations;

use App\Exceptions\DuplicatedResourceException;
use App\Exceptions\InvalidRoleException;
use App\Models\Article;
use App\Models\User;
use App\Services\Contracts\ArticleServiceInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use InvalidArgumentException;

class ArticleService implements ArticleServiceInterface
{
    /**
     * Create and store a new article for a user.
     *
     * @param array $data
     * @return Article
     *
     * @throws InvalidRoleException
     * @throws DuplicatedResourceException
     * @throws ModelNotFoundException
     */
    public function addArticle(array $data): Article
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        // Ensure the authenticated user exists
        if (!$authUser) {
            throw new InvalidRoleException('You must be logged in to add an article.');
        }

        // Ensure the user exists
        $user = User::query()->find($data['user_id']);
        if (!$user) {
            throw new ModelNotFoundException('The specified user does not exist.');
        }

        // Restrict actions: only the same user or a mentor can add an article
        if ($authUser->id !== $user->id && $authUser->role !== 'mentor') {
            throw new InvalidRoleException('You are not allowed to create articles for other users.');
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
     * @throws InvalidRoleException
     * @throws ModelNotFoundException
     * @throws DuplicatedResourceException
     */
    public function updateArticle(int $articleId, array $data): Article
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        // Ensure the authenticated user exists
        if (!$authUser) {
            throw new InvalidRoleException('You must be logged in to update an article.');
        }

        // Find the article
        $article = Article::query()->find($articleId);
        if (!$article) {
            throw new ModelNotFoundException('The specified article does not exist.');
        }

        // Only the article owner or a mentor can update it
        if ($authUser->id !== $article->user_id && $authUser->role !== 'mentor') {
            throw new InvalidRoleException('You are not allowed to update this article.');
        }

        // If user_id is being changed, verify permissions and existence
        if (isset($data['user_id'])) {
            $newUser = User::query()->find($data['user_id']);
            if (!$newUser) {
                throw new ModelNotFoundException('The specified user does not exist.');
            }

            // Only mentors can reassign articles to other users
            if ($authUser->role !== 'mentor' && $data['user_id'] !== $authUser->id) {
                throw new InvalidRoleException('You cannot assign this article to another user.');
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
     * Get all articles of the currently authenticated user.
     *
     * @return Collection<int, Article>
     *
     * @throws InvalidRoleException
     */
    public function getArticlesOfActiveUser(): Collection
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        if (!$authUser) {
            throw new InvalidRoleException('You must be logged in to view your articles.');
        }

        return Article::query()
            ->where('user_id', $authUser->id)
            ->orderByDesc('publication_date')
            ->get();
    }

    /**
     * Get all articles of a specific user.
     *
     * @param int $userId
     * @return Collection<int, Article>
     *
     * @throws InvalidRoleException
     * @throws ModelNotFoundException
     */
    public function getArticlesByUser(int $userId): Collection
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        if (!$authUser) {
            throw new InvalidRoleException('You must be logged in to view user articles.');
        }

        $user = User::query()->find($userId);
        if (!$user) {
            throw new ModelNotFoundException('The specified user does not exist.');
        }

        // Allow viewing only your own articles or if you're a mentor
        if ($authUser->id !== $userId && $authUser->role !== 'mentor') {
            throw new InvalidRoleException('You are not allowed to view articles of other users.');
        }

        return Article::query()
            ->where('user_id', $userId)
            ->orderByDesc('publication_date')
            ->get();
    }

    /**
     * Get all articles in the system (only mentors can access this).
     *
     * @return Collection<int, Article>
     *
     * @throws InvalidRoleException
     */
    public function getAllArticles(): Collection
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        if (!$authUser || $authUser->role !== 'mentor') {
            throw new InvalidRoleException('Only mentors can view all articles.');
        }

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
     * @throws InvalidRoleException
     * @throws InvalidArgumentException
     */
    public function getArticlesByDateRange(string $startDate, string $endDate): Collection
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        if (!$authUser || $authUser->role !== 'mentor') {
            throw new InvalidRoleException('Only mentors can filter articles by date range.');
        }

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
     * @throws InvalidRoleException
     * @throws ModelNotFoundException
     */
    public function deleteArticle(int $articleId): void
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        // Ensure the authenticated user exists
        if (!$authUser) {
            throw new InvalidRoleException('You must be logged in to delete an article.');
        }

        // Find the article
        $article = Article::query()->find($articleId);
        if (!$article) {
            throw new ModelNotFoundException('The specified article does not exist.');
        }

        // Only the article owner or a mentor can delete it
        if ($authUser->id !== $article->user_id && $authUser->role !== 'mentor') {
            throw new InvalidRoleException('You are not allowed to delete this article.');
        }

        // Delete the article
        $article->delete();
    }
}
