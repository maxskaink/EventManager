<?php

namespace App\Services\Implementations;

use App\Models\Notification;
use App\Models\User;
use App\Services\Contracts\NotificationServiceInterface;
use Illuminate\Database\Eloquent\Collection;

class NotificationService implements NotificationServiceInterface
{
    /**
     * Get articles for a specific user id.
     *
     * @param int $userId
     * @return Collection<int, Notification>
     */

    public function getNotificationByUser(int $userId): Collection
    {
        return Notification::query()
            ->where('notifiable_type', User::class)
            ->where('notifiable_id', $userId)
            ->orderByDesc('created_at')
            ->get();
    }



    /**
     * @return Collection<int, Notification>
     */
    public function getAllNotifications(): Collection{
        return Notification::query()
            ->orderByDesc('created_at')
            ->get();
    }
}
