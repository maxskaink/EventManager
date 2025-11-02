<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->prefix('profile')->group(function () {
    Route::put('/', [ProfileController::class, 'updateProfile']);
    Route::get('/', [ProfileController::class, 'getProfile']);
    Route::post('/interests', [ProfileController::class, 'addProfileInterests']);
});
