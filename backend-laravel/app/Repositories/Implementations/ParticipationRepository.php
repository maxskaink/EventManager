<?php

namespace App\Repositories\Implementations;

use App\Models\Participation;
use App\Repositories\Contracts\ParticipationRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ParticipationRepository implements ParticipationRepositoryInterface
{
    /**
     * {@inheritDoc}
     */
    public function create(array $data): Participation
    {
        return Participation::query()->create($data);
    }

    /**
     * {@inheritDoc}
     */
    public function findByUserAndEvent(int $userId, int $eventId): ?Participation
    {
        // Find a specific participation record for a user in an event.
        return Participation::query()
            ->where('user_id', $userId)
            ->where('event_id', $eventId)
            ->first();
    }

    /**
     * {@inheritDoc}
     */
    public function findByEventId(int $eventId): Collection
    {
        return Participation::query()
            ->with('user.profile')
            ->where('event_id', $eventId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * {@inheritDoc}
     */
    public function findByUserId(int $userId): Collection
    {
        return Participation::query()
            ->with('event')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * {@inheritDoc}
     */
    public function countActiveByEvent(int $eventId): int
    {
        // Count participations with 'inscrito' status for the event.
        return Participation::query()
            ->where('event_id', $eventId)
            ->where('status', 'inscrito')
            ->count();
    }

    /**
     * {@inheritDoc}
     */
    public function findAll(?string $status = null): Collection
    {
        $query = Participation::query()->with(['event', 'user.profile']);

        // Apply status filter if provided.
        if ($status) {
            $query->where('status', $status);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }
}
