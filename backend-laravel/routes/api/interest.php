<?php

use App\Http\Controllers\InterestController;
use Illuminate\Support\Facades\Route;
    

Route::get('interest/all', [InterestController::class, 'listAllInterests']);

Route::middleware('auth:sanctum')->prefix('interest')->group(function () {
    Route::post('/', [InterestController::class, 'addInterest']);
    Route::delete('{interestId}', [InterestController::class, 'deleteInterest']);
});
