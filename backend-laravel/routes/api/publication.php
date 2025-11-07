<?php

use App\Http\Controllers\PublicationController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->prefix('publication')->group(function () {
    Route::post('/', [PublicationController::class, 'addPublication']);
    Route::post('{eventId}', [PublicationController::class, 'addEventPublication']);
    Route::get('/all', [PublicationController::class, 'listAllPublications']);
    Route::get('/active', [PublicationController::class, 'listPublishedPublications']);
    Route::get('/archived', [PublicationController::class, 'listDraftPublications']);
    Route::patch('{publicationId}', [PublicationController::class, 'updatePublication']);
    Route::post('{publicationId}/interests', [PublicationController::class, 'addPublicationInterests']);

    // Access routes
    Route::post('{publicationId}/access/grant', [PublicationController::class, 'grantPublicationAccess']);
    Route::delete('{publicationId}/access/revoke', [PublicationController::class, 'revokePublicationAccess']);
});
