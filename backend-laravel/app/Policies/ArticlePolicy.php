<?php

namespace App\Policies;

use App\Models\Article;
use App\Models\User;

class ArticlePolicy
{
    /**
     * Determine whether the user can view any articles (mentor only).
     */
    public function viewAny(User $user): bool
    {
        return $user->role === 'mentor';
    }

    /**
     * Determine whether the user can view articles of a specific user.
     * The second argument can be a user id or a User instance.
     */
    public function viewByUser(User $authUser,User $targetUser): bool
    {
        $targetUserId =  $targetUser->id;

        return $authUser->id === $targetUserId || $authUser->role === 'mentor';
    }

    /**
     * Determine whether the user can create an article for the given user id.
     * The second argument may be the target user's id.
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
     */
    public function update(User $authUser, Article $article): bool
    {
        return $authUser->id === $article->user_id || $authUser->role === 'mentor';
    }

    /**
     * Determine whether the user can delete the article.
     */
    public function delete(User $authUser, Article $article): bool
    {
        return $authUser->id === $article->user_id || $authUser->role === 'mentor';
    }

    /**
     * Determine whether the user can filter articles by date range (mentor only).
     */
    public function filterByDateRange(User $authUser): bool
    {
        return $authUser->role === 'mentor';
    }
}
