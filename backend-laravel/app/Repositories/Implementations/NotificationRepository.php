<?php

namespace App\Repositories\Implementations;

use App\Models\Notification;
use App\Models\User;
use App\Repositories\Contracts\NotificationRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class NotificationRepository implements NotificationRepositoryInterface
{
    public function findByUserId(int $userId): Collection
    {
        return Notification::query()
            ->where('notifiable_type', User::class)
            ->where('notifiable_id', $userId)
            ->orderByDesc('created_at')
            ->get();
    }

    public function findAll(): Collection
    {
        return Notification::query()
            ->orderByDesc('created_at')
            ->get();
    }
}
