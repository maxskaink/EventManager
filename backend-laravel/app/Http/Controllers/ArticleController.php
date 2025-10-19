<?php

namespace App\Http\Controllers;

use App\Http\Requests\Article\AddArticleRequest;
use App\Http\Requests\Article\ListArticlesByDateRangeRequest;
use App\Http\Requests\Article\UpdateArticleRequest;
use App\Services\ArticleService;
use Illuminate\Http\JsonResponse;

class ArticleController extends Controller
{
    protected ArticleService $articleService;

    public function __construct(ArticleService $articleService)
    {
        $this->articleService = $articleService;
    }

    /**
     * Create a new article for a user.
     * TODO: Should a article that was created and is identical into 2 users be shared? or there r 2 different articles entry's?
     */
    public function addArticle(AddArticleRequest $request): JsonResponse
    {
        $data = $request->validated();

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
        $articles = $this->articleService->getArticlesOfActiveUser();

        return response()->json([
            'articles' => $articles,
        ]);
    }

    /**
     * List all articles of a specific user.
     */
    public function listArticlesByUser(int $userId): JsonResponse
    {
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

        $articles = $this->articleService->getArticlesByDateRange(
            $request->input('start_date'),
            $request->input('end_date')
        );

        return response()->json([
            'articles' => $articles,
        ]);
    }
}
