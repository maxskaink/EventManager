<?php

use App\Http\Controllers\InterestController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->prefix('interest')->group(function () {
    Route::post('/', [InterestController::class, 'addInterest']);
    Route::get('/all', [InterestController::class, 'listAllInterests']);
    Route::delete('{interestId}', [InterestController::class, 'deleteInterest']);
});
