<?php

namespace App\Services\Contracts;

use App\Models\Notification;
use Illuminate\Database\Eloquent\Collection;

interface NotificationServiceInterface
{
    /**
     * Get notifications for a specific user id.
     *
     * @param int $userId
     * @return Collection<int, Notification>
     */
    public function getNotificationByUser(int $userId): Collection;

    /**
     * Get all notifications in the system.
     *
     * @return Collection<int, Notification>
     */
    public function getAllNotifications(): Collection;
}
