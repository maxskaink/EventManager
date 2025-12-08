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
    ) {
    }

    /**
     * {@inheritDoc}
     */
    /**
     * {@inheritDoc}
     */
    public function getNotificationByUser(int $userId): Collection
    {
        // Retrieve notifications specific to the given user
        return $this->notificationRepository->findByUserId($userId);
    }

    /**
     * {@inheritDoc}
     */
    public function getAllNotifications(): Collection
    {
        return $this->notificationRepository->findAll();
    }
}
