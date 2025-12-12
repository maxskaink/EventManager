<?php

use App\Http\Controllers\TrustedOrgController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->prefix('trusted-org')->group(function () {
    Route::post('/', [TrustedOrgController::class, 'addTrustedOrg']);
    Route::get('/all', [TrustedOrgController::class, 'listAllTrustedOrgs']);
    Route::get('/type/{type}', [TrustedOrgController::class, 'listTrustedOrgsByType']);
    Route::patch('/{trustedOrgId}', [TrustedOrgController::class, 'updateTrustedOrg']);
    Route::delete('/{trustedOrgId}', [TrustedOrgController::class, 'deleteTrustedOrg']);
});
