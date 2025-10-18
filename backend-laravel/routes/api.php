<?php

use App\Http\Controllers\AuthController;
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
Route::middleware('auth:sanctum')->post('toggle-role', [UserController::class, 'toggleRole']);
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
