<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

#Auth Routes
Route::get('auth', [AuthController::class, 'redirectToAuth']);
Route::middleware('auth:sanctum')->get('user', [AuthController::class, 'user']);
Route::post('/auth/callback', [AuthController::class, 'handleGoogleCallback']);
Route::middleware('auth:sanctum')->get('logout', [AuthController::class, 'logout']);
