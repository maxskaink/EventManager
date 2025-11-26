<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->prefix('profile')->group(function () {
    Route::patch('/', [ProfileController::class, 'updateProfile']);
    Route::post('/interests', [ProfileController::class, 'addProfileInterests']);
    Route::get('/interests', [ProfileController::class, 'listProfileInterests']);
    Route::get('/{userId}/interests', [ProfileController::class, 'getProfileInterestByUserId']);

    Route::get('/', [ProfileController::class, 'getProfile']);
    Route::delete('/interests/{interestId}', [ProfileController::class, 'removeProfileInterest']);
});

Route::prefix('profile')->group(function () {
    Route::get('/all', [ProfileController::class, 'listAllProfiles']);
    Route::get('/{profileId}', [ProfileController::class, 'getProfileById']);
});
