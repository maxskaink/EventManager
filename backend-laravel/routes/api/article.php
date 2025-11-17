<?php

use App\Http\Controllers\ArticleController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->prefix('article')->group(function () {
    Route::post('/', [ArticleController::class, 'addArticle']);
    Route::patch('{articleId}', [ArticleController::class, 'updateArticle']);
    Route::delete('{articleId}', [ArticleController::class, 'deleteArticle']);
    Route::get('/my', [ArticleController::class, 'listMyArticles']);
    Route::get('/user/{userId}', [ArticleController::class, 'listArticlesByUser']);
    Route::get('/all', [ArticleController::class, 'listAllArticles']);
    Route::get('/date-range', [ArticleController::class, 'listArticlesByDateRange']);
    Route::get('/organizations', [ArticleController::class, 'getAllTrustedOrganizations']);
});
