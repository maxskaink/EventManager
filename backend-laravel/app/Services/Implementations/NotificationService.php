<?php

namespace App\Services\Implementations;

use App\Models\Notification;
use App\Repositories\Contracts\NotificationRepositoryInterface;
use App\Services\Contracts\NotificationServiceInterface;
use Illuminate\Database\Eloquent\Collection;

class NotificationService implements NotificationServiceInterface
{
    public function __construct(
        private readonly NotificationRepositoryInterface $notificationRepository
    ) {}

    public function getNotificationByUser(int $userId): Collection
    {
        return $this->notificationRepository->findByUserId($userId);
    }

    public function getAllNotifications(): Collection
    {
        return $this->notificationRepository->findAll();
    }
}
