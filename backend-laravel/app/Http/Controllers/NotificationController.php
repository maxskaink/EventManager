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

    public function __construct(NotificationServiceInterface $notificationService)
    {
        $this->notificationService = $notificationService;
    }
    /**
     * List all notifications of the authenticated user.
     */
    public function listMyNotifications(): JsonResponse
    {
        $userId = request()->user()->id;
        $user = request()->user();
        $this->authorize('viewByUser', [Notification::class, $user]);

        $notifications = $this->notificationService->getNotificationByUser($userId);

        return response()->json([
            'notifications' => $notifications,
        ]);
    }

    /**
     * List all notifications of a specific user.
     */
    public function listNotificationsByUser(int $userId): JsonResponse
    {
        $targetUser = User::query()->find($userId);

        if (!$targetUser) {
            throw new NotFoundHttpException('User not found.');
        }

        $this->authorize('viewByUser', [Notification::class, $targetUser]);

        $notifications = $this->notificationService->getNotificationByUser($userId);

        return response()->json([
            'notifications' => $notifications,
        ]);
    }

    /**
     * List all notifications in the system (mentor only).
     */
    public function listAllNotification(): JsonResponse
    {
        $this->authorize('viewAny', Notification::class);

        $notifications = $this->notificationService->getAllNotifications();

        return response()->json([
            'notifications' => $notifications,
        ]);
    }

}
