<?php

use App\Http\Controllers\EventController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->prefix('event')->group(function () {
    Route::post('/', [EventController::class, 'addEvent']);
    Route::get('/all', [EventController::class, 'listAllEvents']);
    Route::get('/active', [EventController::class, 'listUpcomingEvents']);
    Route::get('/past', [EventController::class, 'listPastEvents']);
    Route::patch('{eventId}', [EventController::class, 'updateEvent']);

    // Participations
    Route::post('{eventId}/participation', [EventController::class, 'enrollUser']);
    Route::patch('{eventId}/participation/attend', [EventController::class, 'markUsersAsAttended']);
    Route::patch('{eventId}/participation/absent', [EventController::class, 'markUsersAsAbsent']);
    Route::delete('{eventId}/participation', [EventController::class, 'cancelEnrollment']);
});
