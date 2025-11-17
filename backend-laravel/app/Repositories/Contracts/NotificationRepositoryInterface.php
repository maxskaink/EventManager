<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;

interface NotificationRepositoryInterface
{
    public function findByUserId(int $userId): Collection;

    public function findAll(): Collection;
}
