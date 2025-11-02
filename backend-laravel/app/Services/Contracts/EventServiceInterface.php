<?php

namespace App\Services\Contracts;

use App\Models\Event;
use Illuminate\Database\Eloquent\Collection;

interface EventServiceInterface
{
    /**
     * Create a new event.
     *
     * @param array $data
     * @return Event
     */
    public function addEvent(array $data): Event;

    /**
     * @return Collection<int, Event>
     */
    public function listAllEvents(): Collection;

    /**
     * @return Collection<int, Event>
     */
    public function listUpcomingEvents(): Collection;

    /**
     * @return Collection<int, Event>
     */
    public function listPastEvents(): Collection;

    /**
     * Update an existing event by ID.
     *
     * @param int $id
     * @param array $data
     * @return Event
     */
    public function updateEvent(int $id, array $data): Event;

    /**
     * Enroll a user in an event.
     *
     * @param int $eventId
     * @param int $userId
     * @return mixed
     */
    public function enrollUserInEvent(int $eventId, int $userId);

    /**
     * Cancel a user's enrollment.
     *
     * @param int $eventId
     * @param int $userId
     * @return mixed
     */
    public function cancelUserEnrollment(int $eventId, int $userId);

    /**
     * Mark multiple users as attended.
     *
     * @param int $eventId
     * @param array $userIds
     * @return array
     */
    public function markUsersAsAttended(int $eventId, array $userIds): array;

    /**
     * Mark multiple users as absent.
     *
     * @param int $eventId
     * @param array $userIds
     * @return array
     */
    public function markUsersAsAbsent(int $eventId, array $userIds): array;
}
