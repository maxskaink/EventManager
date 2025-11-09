<?php

namespace App\Services\Contracts;

use App\Models\Notification;
use Illuminate\Database\Eloquent\Collection;

interface NotificationServiceInterface
{
    /**
     * Get articles for a specific user id.
     *
     * @param int $userId
     * @return Collection<int, Notification>
     */
    public function getNotificationByUser(int $userId): Collection;



    /**
     * @return Collection<int, Notification>
     */
    public function getAllNotifications(): Collection;
}
