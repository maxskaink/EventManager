<?php

use App\Http\Controllers\EventController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->prefix('event')->group(function () {

    /**
     * Create a new event (mentor or coordinator only)
     * POST /api/event
     */
    Route::post('/', [EventController::class, 'addEvent']);

    /**
     * List all events (any user)
     * GET /api/event/all
     */
    Route::get('/all', [EventController::class, 'listAllEvents']);

    /**
     * List all upcoming (active) events (any user)
     * GET /api/event/active
     */
    Route::get('/active', [EventController::class, 'listUpcomingEvents']);

    /**
     * List all past events (mentor or coordinator only)
     * GET /api/event/past
     */
    Route::get('/past', [EventController::class, 'listPastEvents']);


    /**
     * Update an existing event (mentor or coordinator only)
     * PATCH /api/event/{eventId}
     */
    Route::patch('/{eventId}', [EventController::class, 'updateEvent']);

    /**
     * Enroll the authenticated user in an event (self-enrollment)
     * POST /api/event/{eventId}/participation
     */
    Route::post('/{eventId}/participation', [EventController::class, 'enrollUser']);

    /**
     * Cancel the authenticated user's enrollment in an event
     * DELETE /api/event/{eventId}/participation
     */
    Route::delete('/{eventId}/participation', [EventController::class, 'cancelEnrollment']);

    /**
     * Mark users as attended (mentor or coordinator only)
     * PATCH /api/event/{eventId}/participation/attend
     */
    Route::patch('/{eventId}/participation/attend', [EventController::class, 'markUsersAsAttended']);

    /**
     * Mark users as absent (mentor or coordinator only)
     * PATCH /api/event/{eventId}/participation/absent
     */
    Route::patch('/{eventId}/participation/absent', [EventController::class, 'markUsersAsAbsent']);

    Route::get('/participations', [EventController::class, 'listAllParticipations']); // all participations (mentor/coordinator)
    Route::get('/{eventId}/participations', [EventController::class, 'listParticipationsByEvent']); // by event
    Route::get('/participations/user/{userId}', [EventController::class, 'listParticipationsByUser']); // by user

    /**
     * Get a specific event by ID
     * GET /api/event/{id}
     */
    Route::get('/{id}', [EventController::class, 'getEventById']);
});
