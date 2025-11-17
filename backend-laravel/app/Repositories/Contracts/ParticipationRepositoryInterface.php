<?php

namespace App\Repositories\Contracts;

use App\Models\Participation;
use Illuminate\Database\Eloquent\Collection;

interface ParticipationRepositoryInterface
{
    public function create(array $data): Participation;
    public function findByUserAndEvent(int $userId, int $eventId): ?Participation;
    public function findByEventId(int $eventId): Collection;
    public function findByUserId(int $userId): Collection;
    public function countActiveByEvent(int $eventId): int;
    public function findAll(?string $status = null): Collection;
}
