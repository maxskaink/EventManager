<?php

namespace App\Repositories\Contracts;

use App\Models\Participation;
use Illuminate\Database\Eloquent\Collection;

interface ParticipationRepositoryInterface
{
    /**
     * Create a new participation record.
     *
     * @param array $data
     * @return Participation
     */
    public function create(array $data): Participation;

    /**
     * Find a participation record by user and event.
     *
     * @param int $userId
     * @param int $eventId
     * @return Participation|null
     */
    public function findByUserAndEvent(int $userId, int $eventId): ?Participation;

    /**
     * Find all participations for a specific event.
     *
     * @param int $eventId
     * @return Collection<int, Participation>
     */
    public function findByEventId(int $eventId): Collection;

    /**
     * Find all participations for a specific user.
     *
     * @param int $userId
     * @return Collection<int, Participation>
     */
    public function findByUserId(int $userId): Collection;

    /**
     * Count the number of active participations for an event.
     *
     * @param int $eventId
     * @return int
     */
    public function countActiveByEvent(int $eventId): int;

    /**
     * Retrieve all participations, optionally filtered by status.
     *
     * @param string|null $status
     * @return Collection<int, Participation>
     */
    public function findAll(?string $status = null): Collection;
}
