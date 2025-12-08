<?php

namespace App\Policies;

use App\Models\Article;
use App\Models\User;

class ArticlePolicy
{
    /**
     * Determine whether the user can view any articles (mentor only).
     *
     * @param User $user
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        return $user->role === 'mentor';
    }

    /**
     * Determine whether the user can view articles of a specific user.
     *
     * @param User $authUser The authenticated user
     * @param User $targetUser The user whose articles are being viewed
     * @return bool
     */
    public function viewByUser(User $authUser, User $targetUser): bool
    {
        $targetUserId = $targetUser->id;

        return $authUser->id === $targetUserId || $authUser->role === 'mentor';
    }

    /**
     * Determine whether the user can create an article for the given user id.
     *
     * @param User $authUser The authenticated user
     * @param User|int|null $targetUser The target user or user ID
     * @return bool
     */
    public function create(User $authUser, $targetUser = null): bool
    {
        if (is_null($targetUser)) {
            // Default: allow authenticated user to create for themselves
            return true;
        }

        $targetUserId = $targetUser instanceof User ? $targetUser->id : (int) $targetUser;

        return $authUser->id === $targetUserId || $authUser->role === 'mentor';
    }

    /**
     * Determine whether the user can update the article.
     *
     * @param User $authUser The authenticated user
     * @param Article $article The article to update
     * @return bool
     */
    public function update(User $authUser, Article $article): bool
    {
        return $authUser->id === $article->user_id || $authUser->role === 'mentor';
    }

    /**
     * Determine whether the user can delete the article.
     *
     * @param User $authUser The authenticated user
     * @param Article $article The article to delete
     * @return bool
     */
    public function delete(User $authUser, Article $article): bool
    {
        return $authUser->id === $article->user_id || $authUser->role === 'mentor';
    }

    /**
     * Determine whether the user can filter articles by date range (mentor only).
     *
     * @param User $authUser The authenticated user
     * @return bool
     */
    public function filterByDateRange(User $authUser): bool
    {
        return $authUser->role === 'mentor';
    }
}
