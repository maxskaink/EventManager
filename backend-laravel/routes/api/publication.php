<?php

use App\Http\Controllers\PublicationController;
use Illuminate\Support\Facades\Route;

// Ruta pública, sin autenticación
Route::get('publication/active', [PublicationController::class, 'listPublishedPublications']);
Route::get('publication/filter', [PublicationController::class, 'listFilteredPublications']); // Added route

// Rutas protegidas
Route::middleware('auth:sanctum')->prefix('publication')->group(function () {
    Route::post('/', [PublicationController::class, 'addPublication']);
    Route::post('/event/{eventId}', [PublicationController::class, 'addEventPublication']);
    Route::get('/all', [PublicationController::class, 'listAllPublications']);
    Route::get('/draft', [PublicationController::class, 'listDraftPublications']);

    Route::patch('{publicationId}', [PublicationController::class, 'updatePublication']);
    Route::delete('{publicationId}', [PublicationController::class, 'deletePublication']);
    Route::post('{publicationId}/interests', [PublicationController::class, 'addPublicationInterests']);
    Route::delete('{publicationId}/interests', [PublicationController::class, 'removePublicationInterests']);
    Route::post('{publicationId}/image', [PublicationController::class, 'setPublicationImage']);
    Route::get('/{publicationId}', [PublicationController::class, 'getPublicationById']);

    // Access routes
    Route::post('{publicationId}/access/grant', [PublicationController::class, 'grantPublicationAccess']);
    Route::delete('{publicationId}/access/revoke', [PublicationController::class, 'revokePublicationAccess']);
    Route::get('{publicationId}/access/users', [PublicationController::class, 'getUsersWithAccess']);
});
