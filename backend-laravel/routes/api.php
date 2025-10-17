<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;

use Illuminate\Support\Facades\Route;

#Auth Routes
Route::get('auth', [AuthController::class, 'redirectToAuth']);
Route::middleware('auth:sanctum')->get('user', [AuthController::class, 'user']);
Route::post('/auth/callback', [AuthController::class, 'handleGoogleCallback']);
Route::middleware('auth:sanctum')->get('logout', [AuthController::class, 'logout']);

#User Routes
Route::middleware('auth:sanctum')->post('toggle-role', [UserController::class, 'toggleRole']);

#Profile Routes
Route::middleware('auth:sanctum')->put('profile', [ProfileController::class, 'updateProfile']);

#Event Routes
Route::middleware('auth:sanctum')->post('event', [EventController::class, 'addEvent']);
