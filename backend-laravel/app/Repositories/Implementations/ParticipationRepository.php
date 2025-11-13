<?php

namespace App\Repositories\Implementations;

use App\Models\Participation;
use App\Repositories\Contracts\ParticipationRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ParticipationRepository implements ParticipationRepositoryInterface
{
    public function create(array $data): Participation
    {
        return Participation::query()->create($data);
    }

    public function findByUserAndEvent(int $userId, int $eventId): ?Participation
    {
        return Participation::query()
            ->where('user_id', $userId)
            ->where('event_id', $eventId)
            ->first();
    }

    public function findByEventId(int $eventId): Collection
    {
        return Participation::query()
            ->where('event_id', $eventId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function findByUserId(int $userId): Collection
    {
        return Participation::query()
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function countActiveByEvent(int $eventId): int
    {
        return Participation::query()
            ->where('event_id', $eventId)
            ->where('status', 'inscrito')
            ->count();
    }

    public function findAll(?string $status = null): Collection
    {
        $query = Participation::query();
        if ($status) {
            $query->where('status', $status);
        }
        return $query->orderBy('created_at', 'desc')->get();
    }
}
