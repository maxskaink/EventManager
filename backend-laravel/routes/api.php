<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

#Auth Routes
Route::get('auth', [AuthController::class, 'redirectToAuth']);
Route::middleware('auth:sanctum')->get('user', [AuthController::class, 'user']);
Route::post('/auth/callback', [AuthController::class, 'handleGoogleCallback']);
Route::middleware('auth:sanctum')->get('logout', [AuthController::class, 'logout']);

#User Routes
Route::middleware('auth:sanctum')->post('toggle-role', [UserController::class, 'toggleRole']);
