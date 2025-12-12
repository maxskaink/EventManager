<?php

namespace App\Repositories\Implementations;

use App\Models\Notification;
use App\Models\User;
use App\Repositories\Contracts\NotificationRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class NotificationRepository implements NotificationRepositoryInterface
{
    /**
     * {@inheritDoc}
     */
    public function findByUserId(int $userId): Collection
    {
        // Retrieve notifications where the notifiable entity is the User model and matches the ID.
        return Notification::query()
            ->where('notifiable_type', User::class)
            ->where('notifiable_id', $userId)
            ->orderByDesc('created_at')
            ->get();
    }

    /**
     * {@inheritDoc}
     */
    public function findAll(): Collection
    {
        return Notification::query()
            ->orderByDesc('created_at')
            ->get();
    }
}
