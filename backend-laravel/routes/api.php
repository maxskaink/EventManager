<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CertificateController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;

use Illuminate\Support\Facades\Route;

#Auth Routes
Route::get('auth', [AuthController::class, 'redirectToAuth']);
Route::post('/auth/callback', [AuthController::class, 'handleGoogleCallback']);
Route::middleware('auth:sanctum')->get('logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->get('user', [AuthController::class, 'user']);

#User Routes
Route::middleware('auth:sanctum')->patch('user/{user}/toggle-role', [UserController::class, 'toggleRole']);
Route::middleware('auth:sanctum')->get('user/member', [UserController::class, 'listActiveMembers']);
Route::middleware('auth:sanctum')->get('user/interested', [UserController::class, 'listActiveInterested']);
Route::middleware('auth:sanctum')->get('user/coordinator', [UserController::class, 'listActiveCoordinators']);
Route::middleware('auth:sanctum')->get('user/mentor', [UserController::class, 'listActiveMentors']);
Route::middleware('auth:sanctum')->get('user/inactive', [UserController::class, 'listInactiveUsers']);
Route::middleware('auth:sanctum')->get('user/active', [UserController::class, 'listActiveUsers']);

#Profile Routes
Route::middleware('auth:sanctum')->put('profile', [ProfileController::class, 'updateProfile']);
Route::middleware('auth:sanctum')->get('profile', [ProfileController::class, 'getProfile']);

#Event Routes
Route::middleware('auth:sanctum')->post('event', [EventController::class, 'addEvent']);
Route::middleware('auth:sanctum')->get('event/all', [EventController::class, 'listAllEvents']);
Route::middleware('auth:sanctum')->get('event/active', [EventController::class, 'listUpcomingEvents']);
Route::middleware('auth:sanctum')->get('event/past', [EventController::class, 'listPastEvents']);

#Certificate Routes
Route::middleware('auth:sanctum')->post('certificate', [CertificateController::class, 'addCertificate']);
Route::middleware('auth:sanctum')->patch('certificate/{certificateId}', [CertificateController::class, 'updateCertificate']);
Route::middleware('auth:sanctum')->get('certificate/my', [CertificateController::class, 'listMyCertificates']);
Route::middleware('auth:sanctum')->get('certificate/user/{userId}', [CertificateController::class, 'listCertificatesByUser']);
Route::middleware('auth:sanctum')->get('certificate/all', [CertificateController::class, 'listAllCertificates']);
Route::middleware('auth:sanctum')->get('certificate/date-range', [CertificateController::class, 'listCertificatesByDateRange']);


#Article Routes
Route::middleware('auth:sanctum')->post('article', [ArticleController::class, 'addArticle']);
Route::middleware('auth:sanctum')->patch('article/{articleId}', [ArticleController::class, 'updateArticle']);
Route::middleware('auth:sanctum')->get('article/my', [ArticleController::class, 'listMyArticles']);
Route::middleware('auth:sanctum')->get('article/user/{userId}', [ArticleController::class, 'listArticlesByUser']);
Route::middleware('auth:sanctum')->get('article/all', [ArticleController::class, 'listAllArticles']);
Route::middleware('auth:sanctum')->get('article/date-range', [ArticleController::class, 'listArticlesByDateRange']);
