<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('auth', [AuthController::class, 'redirectToAuth']);
#Route::get('auth/callback', [AuthController::class, 'handleAuthCallback']);
Route::get('user', [AuthController::class, 'user']);
Route::post('/auth/callback', [AuthController::class, 'handleGoogleCallback']);
