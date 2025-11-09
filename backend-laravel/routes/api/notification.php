<?php

use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;


Route::middleware('auth:sanctum')->prefix('notification')->group(function () {
    Route::get('/my', [NotificationController::class, 'listMyNotifications']);
    Route::get('/user/{userId}', [NotificationController::class, 'listNotificationsByUser']);;
    Route::get('/all', [NotificationController::class, 'listAllNotification']);;
});
