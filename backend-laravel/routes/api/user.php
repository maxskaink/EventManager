<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
// Rutas protegidas
Route::middleware('auth:sanctum')->prefix('user')->group(function () {
    Route::patch('{user}/toggle-role', [UserController::class, 'toggleRole']);
    Route::get('inactive', [UserController::class, 'listInactiveUsers']);

});
// Rutas públicas de “listar usuarios activos”
Route::prefix('user')->group(function () {
    Route::get('filter', [UserController::class, 'listFilteredUsers']);
    Route::get('{user}', [UserController::class, 'getUserById']);
});


