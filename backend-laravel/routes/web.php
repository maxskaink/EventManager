<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

// Provide a named login route for cases where the framework redirects unauthenticated users.
// For an API-only app we return a JSON 401 so redirects don't expose HTML pages.
Route::get('/login', function () {
    return response()->json([
        'error' => 'Unauthenticated.',
        'message' => 'Please provide valid credentials.'
    ], 401);
})->name('login');

