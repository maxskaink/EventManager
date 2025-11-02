<?php

use App\Http\Controllers\ExternalEventController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->prefix('external-event')->group(function () {
    Route::post('/', [ExternalEventController::class, 'addExternalEvent']);
    Route::patch('{externalEventId}', [ExternalEventController::class, 'updateExternalEvent']);
    Route::delete('{externalEventId}', [ExternalEventController::class, 'deleteExternalEvent']);
    Route::get('/my', [ExternalEventController::class, 'listMyExternalEvents']);
    Route::get('/user/{userId}', [ExternalEventController::class, 'listExternalEventsByUser']);
    Route::get('/all', [ExternalEventController::class, 'listAllExternalEvents']);
    Route::get('/date-range', [ExternalEventController::class, 'listExternalEventsByDateRange']);
});
