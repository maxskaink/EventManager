<?php

namespace App\Http\Controllers;

use App\Http\Requests\Article\AddArticleRequest;
use App\Http\Requests\Article\ListArticlesByDateRangeRequest;
use App\Http\Requests\Article\UpdateArticleRequest;

use App\Services\Contracts\ArticleServiceInterface;
use App\Models\Article;
use App\Models\User;
use App\Services\Implementations\ArticleService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ArticleController extends Controller
{
    protected ArticleServiceInterface $articleService;

    public function __construct(ArticleServiceInterface $articleService)
    {
        $this->articleService = $articleService;
    }

    /**
     * Create a new article for a user.
     */
    public function addArticle(AddArticleRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Authorization: allow user to create for themselves or mentor to create for others
        $this->authorize('create', [Article::class, $data['user_id']]);

        $newArticle = $this->articleService->addArticle($data);

        return response()->json([
            'message' => 'Article created successfully.',
            'article' => $newArticle,
        ]);
    }

    /**
     * Update an existing article.
     */
    public function updateArticle(UpdateArticleRequest $request, int $articleId): JsonResponse
    {
        $data = $request->validated();

        $article = Article::query()->find($articleId);
        if (!$article) {
            throw new NotFoundHttpException('Article not found.');
        }

        $this->authorize('update', $article);

        $updatedArticle = $this->articleService->updateArticle($articleId, $data);

        return response()->json([
            'message' => 'Article updated successfully.',
            'article' => $updatedArticle,
        ]);
    }

    /**
     * List all articles of the authenticated user.
     */
    public function listMyArticles(): JsonResponse
    {
        $userId = request()->user()->id;
        $user = request()->user();
        $this->authorize('viewByUser', [Article::class, $user, $user]);

        $articles = $this->articleService->getArticlesByUser($userId);

        return response()->json([
            'articles' => $articles,
        ]);
    }

    /**
     * List all articles of a specific user.
     */
    public function listArticlesByUser(int $userId): JsonResponse
    {
        $targetUser = User::query()->find($userId);

        if (!$targetUser) {
            throw new NotFoundHttpException('User not found.');
        }

        $this->authorize('viewByUser', [Article::class, $targetUser]);

        $articles = $this->articleService->getArticlesByUser($userId);

        return response()->json([
            'articles' => $articles,
        ]);
    }

    /**
     * List all articles in the system (mentor only).
     */
    public function listAllArticles(): JsonResponse
    {
        $this->authorize('viewAny', Article::class);

        $articles = $this->articleService->getAllArticles();

        return response()->json([
            'articles' => $articles,
        ]);
    }

    /**
     * List all articles published within a date range (mentor only).
     */
    public function listArticlesByDateRange(ListArticlesByDateRangeRequest $request): JsonResponse
    {
        $request->validate([
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date'],
        ]);
        // Only mentors can filter by date range
        $this->authorize('filterByDateRange', Article::class);

        $articles = $this->articleService->getArticlesByDateRange(
            $request->input('start_date'),
            $request->input('end_date')
        );

        return response()->json([
            'articles' => $articles,
        ]);
    }

    /**
     * Delete an existing article.
     */
    public function deleteArticle(int $articleId): JsonResponse
    {
        $article = Article::query()->findOrFail($articleId);
        $this->authorize('delete', $article);

        $this->articleService->deleteArticle($articleId);

        return response()->json([
            'message' => 'Article deleted successfully.',
        ]);
    }

    /**
     * Get all trusted organizations (public endpoint).
     */
    public function getAllTrustedOrganizations(): JsonResponse
    {
        $trustedOrganizations = $this->articleService->getAllTrustedOrganizations();

        return response()->json([
            'trusted_organizations' => $trustedOrganizations,
        ]);
    }

}
