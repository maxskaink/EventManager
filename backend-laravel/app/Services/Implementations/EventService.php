<?php

namespace App\Services\Implementations;

use App\Exceptions\DuplicatedResourceException;
use App\Models\Event;
use App\Models\Participation;
use App\Models\User;
use App\Services\Contracts\EventServiceInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Nette\Schema\ValidationException;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;
use InvalidArgumentException;

class EventService implements EventServiceInterface
{
    /**
     * Create and store a new event.
     *
     * @param array $data
     * @return Event
     *
     * @throws DuplicatedResourceException
     */
    public function addEvent(array $data): Event
    {
        $existingEvent = Event::query()->where('name', $data['name'])->first();

        if ($existingEvent) {
            throw new DuplicatedResourceException("A resource with the name: {$data['name']} already exists");
        }

        // Normalize dates
        $data['start_date'] = Carbon::parse($data['start_date'])->toDateTimeString();
        $data['end_date'] = Carbon::parse($data['end_date'])->toDateTimeString();

        $event = new Event();
        $event->fill($data);
        $event->save();

        return $event;
    }

    /**
     * List all events.
     *
     * @return Collection<int, Event>
     */
    public function listAllEvents(): Collection
    {
        return Event::query()->orderBy('start_date', 'asc')->get();
    }

    /**
     * List upcoming events (events that have not yet ended),
     * ordered from the soonest to the latest.
     *
     * @return Collection<int, Event>
     */
    public function listUpcomingEvents(): Collection
    {
        $now = Carbon::now();

        return Event::query()
            ->where('end_date', '>=', $now)
            ->orderBy('start_date', 'asc')
            ->get();
    }

    /**
     * List past events (events that already ended),
     * ordered from most recent to oldest.
     *
     * @return Collection<int, Event>
     */
    public function listPastEvents(): Collection
    {
        $now = Carbon::now();

        return Event::query()
            ->where('end_date', '<', $now)
            ->orderBy('end_date', 'desc')
            ->get();
    }

    /**
     * Update an existing event by ID.
     *
     * @param int $id
     * @param array $data
     * @return Event
     *
     * @throws ResourceNotFoundException
     * @throws DuplicatedResourceException
     */
    public function updateEvent(int $id, array $data): Event
    {
        $event = Event::query()->find($id);

        if (!$event) {
            throw new ResourceNotFoundException("The event with ID {$id} was not found.");
        }

        // Check for duplicated name if it's being updated
        if (isset($data['name'])) {
            $existing = Event::query()
                ->where('name', $data['name'])
                ->where('id', '<>', $id)
                ->first();

            if ($existing) {
                throw new DuplicatedResourceException("A resource with the name: {$data['name']} already exists");
            }
        }

        // Normalize dates if present
        if (isset($data['start_date'])) {
            $data['start_date'] = Carbon::parse($data['start_date'])->toDateTimeString();
        }
        if (isset($data['end_date'])) {
            $data['end_date'] = Carbon::parse($data['end_date'])->toDateTimeString();
        }

        $event->fill($data);
        $event->save();

        return $event;
    }

    /**
     * Enroll a user in an event.
     *
     * @param int $eventId
     * @param int $userId
     * @return Participation|Model
     *
     * @throws ModelNotFoundException
     * @throws ResourceNotFoundException
     * @throws DuplicatedResourceException
     * @throws ValidationException
     */
    public function enrollUserInEvent(int $eventId, int $userId): Participation|Model
    {
        $user = User::query()->find($userId);
        if (!$user) {
            throw new ModelNotFoundException('The specified user does not exist.');
        }

        $event = Event::query()->find($eventId);
        if (!$event) {
            throw new ResourceNotFoundException('Event not found.');
        }

        if (now()->greaterThanOrEqualTo($event->start_date)) {
            throw new ValidationException('Event has already started. Enrollment is closed.');
        }

        $existing = Participation::query()
            ->where('event_id', $eventId)
            ->where('user_id', $userId)
            ->first();

        if ($existing) {
            if ($existing->status === 'cancelado') {
                $existing->update(['status' => 'inscrito']);
                return $existing;
            }

            throw new DuplicatedResourceException('User is already enrolled in this event.');
        }

        if ($event->capacity !== null) {
            $currentCount = Participation::query()
                ->where('event_id', $eventId)
                ->where('status', 'inscrito')
                ->count();

            if ($currentCount >= $event->capacity) {
                throw new ValidationException('Event capacity reached.');
            }
        }

        return Participation::query()->create([
            'event_id' => $eventId,
            'user_id' => $userId,
            'status' => 'inscrito',
        ]);
    }

    /**
     * Cancel a user's enrollment in an event.
     *
     * @param int $eventId
     * @param int $userId
     * @return Participation|Model
     *
     * @throws ModelNotFoundException
     * @throws ResourceNotFoundException
     * @throws ValidationException
     */
    public function cancelUserEnrollment(int $eventId, int $userId): Participation|Model
    {
        $user = User::query()->find($userId);
        if (!$user) {
            throw new ModelNotFoundException('The specified user does not exist.');
        }

        $event = Event::query()->find($eventId);
        if (!$event) {
            throw new ResourceNotFoundException('Event not found.');
        }

        $participation = Participation::query()
            ->where('event_id', $eventId)
            ->where('user_id', $userId)
            ->first();

        if (!$participation) {
            throw new ResourceNotFoundException('User is not enrolled in this event.');
        }

        if ($participation->status === 'cancelado') {
            throw new ValidationException('Enrollment is already canceled.');
        }

        if (now()->greaterThanOrEqualTo($event->start_date)) {
            throw new ValidationException('Cannot cancel enrollment after the event has started.');
        }

        $participation->update(['status' => 'cancelado']);

        return $participation;
    }

    /**
     * Mark users as attended for an event.
     *
     * @param int $eventId
     * @param array $userIds
     * @return array
     *
     * @throws ResourceNotFoundException
     * @throws ValidationException
     */
    public function markUsersAsAttended(int $eventId, array $userIds): array
    {
        $event = Event::query()->find($eventId);
        if (!$event) {
            throw new ResourceNotFoundException('Event not found.');
        }

        if (now()->lessThan($event->start_date)) {
            throw new ValidationException('Cannot mark attendance before the event starts.');
        }

        $results = [];

        DB::transaction(function () use ($eventId, $userIds, &$results) {
            foreach ($userIds as $userId) {
                try {
                    $participation = Participation::query()
                        ->where('event_id', $eventId)
                        ->where('user_id', $userId)
                        ->lockForUpdate()
                        ->first();

                    if (!$participation) {
                        $results[$userId] = 'User not enrolled in this event.';
                        continue;
                    }

                    if ($participation->status !== 'inscrito') {
                        $results[$userId] = 'User not in valid status to mark as attended.';
                        continue;
                    }

                    $participation->update(['status' => 'asistio']);
                    $results[$userId] = 'Marked as attended.';
                } catch (\Throwable $e) {
                    $results[$userId] = 'Error: ' . $e->getMessage();
                }
            }
        });

        return $results;
    }

    /**
     * Mark users as absent for an event.
     *
     * @param int $eventId
     * @param array $userIds
     * @return array
     *
     * @throws ResourceNotFoundException
     * @throws ValidationException
     */
    public function markUsersAsAbsent(int $eventId, array $userIds): array
    {
        $event = Event::query()->find($eventId);
        if (!$event) {
            throw new ResourceNotFoundException('Event not found.');
        }

        if (now()->lessThan($event->start_date)) {
            throw new ValidationException('Cannot mark absences before the event starts.');
        }

        $results = [];

        DB::transaction(function () use ($eventId, $userIds, &$results) {
            foreach ($userIds as $userId) {
                try {
                    $participation = Participation::query()
                        ->where('event_id', $eventId)
                        ->where('user_id', $userId)
                        ->lockForUpdate()
                        ->first();

                    if (!$participation) {
                        $results[$userId] = 'User not enrolled in this event.';
                        continue;
                    }

                    if ($participation->status !== 'inscrito') {
                        $results[$userId] = 'User not in valid status to mark as absent.';
                        continue;
                    }

                    $participation->update(['status' => 'ausente']);
                    $results[$userId] = 'Marked as absent.';
                } catch (\Throwable $e) {
                    $results[$userId] = 'Error: ' . $e->getMessage();
                }
            }
        });

        return $results;
    }

    /**
     * Get a specific event by its ID.
     *
     * @param int $id
     * @return Event
     *
     * @throws ResourceNotFoundException
     */
    public function getEventById(int $id): Event
    {
        $event = Event::query()->find($id);

        if (!$event) {
            throw new ResourceNotFoundException("The event with ID {$id} was not found.");
        }

        return $event;
    }

    /**
     * List all participations for a given event.
     *
     * @param int $eventId
     * @return Collection<int, Participation>
     *
     * @throws ResourceNotFoundException
     */
    public function listParticipationsByEvent(int $eventId): Collection
    {
        $event = Event::query()->find($eventId);
        if (!$event) {
            throw new ResourceNotFoundException("The event with ID {$eventId} was not found.");
        }

        return Participation::query()
            ->where('event_id', $eventId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * List all participations for a given user.
     *
     * @param int $userId
     * @return Collection<int, Participation>
     *
     * @throws ResourceNotFoundException
     */
    public function listParticipationsByUser(int $userId): Collection
    {
        $user = User::query()->find($userId);
        if (!$user) {
            throw new ResourceNotFoundException("The user with ID {$userId} was not found.");
        }

        return Participation::query()
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * List all participations (optionally filtered by status).
     *
     * @param string|null $status
     * @return Collection<int, Participation>
     */
    public function listAllParticipations(?string $status = null): Collection
    {
        $query = Participation::query();

        if ($status) {
            $query->where('status', $status);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }


}
