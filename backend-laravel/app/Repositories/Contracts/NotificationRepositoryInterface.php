<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;

interface NotificationRepositoryInterface
{
    /**
     * Find all notifications for a specific user.
     *
     * @param int $userId
     * @return Collection<int, \Illuminate\Notifications\DatabaseNotification>
     */
    public function findByUserId(int $userId): Collection;

    /**
     * Retrieve all notifications.
     *
     * @return Collection<int, \Illuminate\Notifications\DatabaseNotification>
     */
    public function findAll(): Collection;
}
