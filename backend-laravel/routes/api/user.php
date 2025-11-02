<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->prefix('user')->group(function () {
    Route::patch('{user}/toggle-role', [UserController::class, 'toggleRole']);
    Route::get('member', [UserController::class, 'listActiveMembers']);
    Route::get('interested', [UserController::class, 'listActiveInterested']);
    Route::get('coordinator', [UserController::class, 'listActiveCoordinators']);
    Route::get('mentor', [UserController::class, 'listActiveMentors']);
    Route::get('inactive', [UserController::class, 'listInactiveUsers']);
    Route::get('active', [UserController::class, 'listActiveUsers']);
});
