<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\User;
use App\Services\Contracts\NotificationServiceInterface;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class NotificationController extends Controller
{
    protected NotificationServiceInterface $notificationService;

    /**
     * Create a new instance of NotificationController.
     *
     * @param NotificationServiceInterface $notificationService The service to handle notification logic.
     */
    public function __construct(NotificationServiceInterface $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * List all notifications of the authenticated user.
     *
     * @return JsonResponse A list of the user's notifications.
     * @throws \Illuminate\Auth\Access\AuthorizationException If the user is not authorized.
     */
    public function listMyNotifications(): JsonResponse
    {
        $userId = request()->user()->id;
        $user = request()->user();

        // Authorization: ensure the user can view their own notifications
        $this->authorize('viewByUser', [Notification::class, $user]);

        $notifications = $this->notificationService->getNotificationByUser($userId);

        return response()->json([
            'notifications' => $notifications,
        ]);
    }

    /**
     * List all notifications of a specific user.
     *
     * @param int $userId The ID of the user whose notifications to list.
     * @return JsonResponse A list of the user's notifications.
     * @throws NotFoundHttpException If the user is not found.
     * @throws \Illuminate\Auth\Access\AuthorizationException If the user is not authorized.
     */
    public function listNotificationsByUser(int $userId): JsonResponse
    {
        $targetUser = User::query()->find($userId);

        if (!$targetUser) {
            throw new NotFoundHttpException('User not found.');
        }

        // Authorization: check if the user can view notifications for the target user
        $this->authorize('viewByUser', [Notification::class, $targetUser]);

        $notifications = $this->notificationService->getNotificationByUser($userId);

        return response()->json([
            'notifications' => $notifications,
        ]);
    }

    /**
     * List all notifications in the system (mentor only).
     *
     * @return JsonResponse A list of all notifications.
     * @throws \Illuminate\Auth\Access\AuthorizationException If the user is not authorized.
     */
    public function listAllNotification(): JsonResponse
    {
        // Authorization: only mentors can view all notifications
        $this->authorize('viewAny', Notification::class);

        $notifications = $this->notificationService->getAllNotifications();

        return response()->json([
            'notifications' => $notifications,
        ]);
    }

}
