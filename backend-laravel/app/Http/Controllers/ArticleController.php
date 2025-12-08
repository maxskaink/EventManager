<?php

namespace App\Http\Controllers;

use App\Http\Requests\Article\AddArticleRequest;
use App\Http\Requests\Article\ListArticlesByDateRangeRequest;
use App\Http\Requests\Article\UpdateArticleRequest;

use App\Services\Contracts\ArticleServiceInterface;
use App\Models\Article;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ArticleController extends Controller
{
    protected ArticleServiceInterface $articleService;

    /**
     * Create a new instance of ArticleController.
     *
     * @param ArticleServiceInterface $articleService The service to handle article logic.
     */
    public function __construct(ArticleServiceInterface $articleService)
    {
        $this->articleService = $articleService;
    }

    /**
     * Create a new article for a user.
     *
     * @param AddArticleRequest $request The request containing article data.
     * @return JsonResponse The created article and a success message.
     * @throws \Illuminate\Auth\Access\AuthorizationException If the user is not authorized.
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
        ], 201);
    }

    /**
     * Update an existing article.
     *
     * @param UpdateArticleRequest $request The request containing updated article data.
     * @param int $articleId The ID of the article to update.
     * @return JsonResponse The updated article and a success message.
     * @throws NotFoundHttpException If the article is not found.
     * @throws \Illuminate\Auth\Access\AuthorizationException If the user is not authorized.
     */
    public function updateArticle(UpdateArticleRequest $request, int $articleId): JsonResponse
    {
        $data = $request->validated();

        $article = Article::query()->find($articleId);
        if (!$article) {
            throw new NotFoundHttpException('Article not found.');
        }

        // Authorization: check if the user can update this specific article
        $this->authorize('update', $article);

        $updatedArticle = $this->articleService->updateArticle($articleId, $data);

        return response()->json([
            'message' => 'Article updated successfully.',
            'article' => $updatedArticle,
        ]);
    }

    /**
     * List all articles of the authenticated user.
     *
     * @return JsonResponse A list of the user's articles.
     */
    public function listMyArticles(): JsonResponse
    {
        $userId = request()->user()->id;
        $user = request()->user();

        // Authorization: ensure the user can view their own articles
        $this->authorize('viewByUser', [Article::class, $user, $user]);

        $articles = $this->articleService->getArticlesByUser($userId);

        return response()->json([
            'articles' => $articles,
        ]);
    }

    /**
     * List all articles of a specific user.
     *
     * @param int $userId The ID of the user whose articles to list.
     * @return JsonResponse A list of the user's articles.
     * @throws NotFoundHttpException If the user is not found.
     */
    public function listArticlesByUser(int $userId): JsonResponse
    {
        $targetUser = User::query()->find($userId);

        if (!$targetUser) {
            throw new NotFoundHttpException('User not found.');
        }

        $articles = $this->articleService->getArticlesByUser($userId);

        return response()->json([
            'articles' => $articles,
        ]);
    }

    /**
     * List all articles in the system (mentor only).
     *
     * @return JsonResponse A list of all articles.
     * @throws \Illuminate\Auth\Access\AuthorizationException If the user is not authorized.
     */
    public function listAllArticles(): JsonResponse
    {
        // Authorization: only mentors can view all articles
        $this->authorize('viewAny', Article::class);

        $articles = $this->articleService->getAllArticles();

        return response()->json([
            'articles' => $articles,
        ]);
    }

    /**
     * List all articles published within a date range (mentor only).
     *
     * @param ListArticlesByDateRangeRequest $request The request containing start and end dates.
     * @return JsonResponse A list of articles within the date range.
     * @throws \Illuminate\Auth\Access\AuthorizationException If the user is not authorized.
     */
    public function listArticlesByDateRange(ListArticlesByDateRangeRequest $request): JsonResponse
    {
        $request->validate([
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date'],
        ]);

        // Authorization: Only mentors can filter by date range
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
     *
     * @param int $articleId The ID of the article to delete.
     * @return JsonResponse A success message.
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException If the article is not found.
     * @throws \Illuminate\Auth\Access\AuthorizationException If the user is not authorized.
     */
    public function deleteArticle(int $articleId): JsonResponse
    {
        $article = Article::query()->findOrFail($articleId);

        // Authorization: check if the user can delete this article
        $this->authorize('delete', $article);

        $this->articleService->deleteArticle($articleId);

        return response()->json([
            'message' => 'Article deleted successfully.',
        ]);
    }

    /**
     * Get all trusted organizations (public endpoint).
     *
     * @return JsonResponse A list of trusted organizations.
     */
    public function getAllTrustedOrganizations(): JsonResponse
    {
        $trustedOrganizations = $this->articleService->getAllTrustedOrganizations();

        return response()->json([
            'trusted_organizations' => $trustedOrganizations,
        ]);
    }

}
