<?php

namespace App\Services\Implementations;

use App\Exceptions\DuplicatedResourceException;
use App\Exceptions\InvalidRoleException;
use App\Models\Event;
use App\Models\Participation;
use App\Models\User;
use App\Services\Contracts\EventServiceInterface;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Nette\Schema\ValidationException;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;

class EventService implements EventServiceInterface
{
    public function addEvent(array $data): Event
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        if (!$authUser || ($authUser->role !== 'mentor' && $authUser->role !== 'coordinator')) {
            throw new InvalidRoleException('Only mentors or coordinators can create events.');
        }

        $existingEvent = Event::query()->where('name', $data['name'])->first();

        if ($existingEvent) {
            throw new DuplicatedResourceException("A resource with the name: {$data['name']} already exists");
        }
        // Normalize dates
        $data['start_date'] = Carbon::parse($data['start_date'])->toDateTimeString();
        $data['end_date'] = Carbon::parse($data['end_date'])->toDateTimeString();

        // Create event (the events table does not have user_id in current migrations,
        // so we do not try to save it as user_id in the entity)
        $event = new Event();
        $event->fill($data);
        $event->save();

        return $event;
    }

    /**
     * List all events.
     * @throws AuthorizationException
     */
    public function listAllEvents(): Collection
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        if ($authUser && !in_array($authUser->role, ['mentor', 'coordinator'])) {
            throw new AuthorizationException('You are not allowed to view all events.');
        }

        return Event::query()->orderBy('start_date', 'asc')->get();
    }

    /**
     * List upcoming events (events that have not yet ended),
     * ordered from the soonest to the latest.
     */
    public function listUpcomingEvents(): Collection
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        if (!$authUser) {
            throw new InvalidRoleException('Only authenticated users can list published publications.');
        }

        $now = Carbon::now();
        return Event::query()->where('end_date', '>=', $now)
            ->orderBy('start_date', 'asc')
            ->get();
    }

    /**
     * List past events (events that already ended),
     * ordered from most recent to oldest.
     * @throws AuthorizationException
     */
    public function listPastEvents(): Collection
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        if ($authUser && !in_array($authUser->role, ['mentor', 'coordinator'])) {
            throw new AuthorizationException('You are not allowed to view all events.');
        }


        $now = Carbon::now();
        return Event::query()->where('end_date', '<', $now)
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
        /** @var User|null $authUser */
        $authUser = Auth::user();

        if (!$authUser || ($authUser->role !== 'mentor' && $authUser->role !== 'coordinator')) {
            throw new InvalidRoleException('Only mentors or coordinators can update events.');
        }

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

    public function enrollUserInEvent(int $eventId, int $userId): Participation|Model
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        // Ensure the authenticated user exists
        if (!$authUser) {
            throw new InvalidRoleException('You must be logged in to add a participation.');
        }

        // Ensure the user exists
        $user = User::query()->find($userId);
        if (!$user) {
            throw new ModelNotFoundException('The specified user does not exist.');
        }

        // Restrict actions: only the same user or a mentor can add a certificate
        if ($authUser->id !== $user->id && !in_array($authUser->role, ['mentor', 'coordinator'])) {
            throw new InvalidRoleException('You are not allowed to enroll other users.');
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

    public function cancelUserEnrollment(int $eventId, int $userId): Participation|Model
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        // Ensure the authenticated user exists
        if (!$authUser) {
            throw new InvalidRoleException('You must be logged in to cancel a participation.');
        }

        // Ensure the user exists
        $user = User::query()->find($userId);
        if (!$user) {
            throw new ModelNotFoundException('The specified user does not exist.');
        }

        // Restrict actions: only the same user or a mentor can add a certificate
        if ($authUser->id !== $user->id && !in_array($authUser->role, ['mentor', 'coordinator'])) {
            throw new InvalidRoleException('You are not allowed to cancel other users enrollment.');
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


    public function markUsersAsAttended(int $eventId, array $userIds): array
    {
        /** @var User $authUser */
        $authUser = auth()->user();

        if (!$authUser || !in_array($authUser->role, ['mentor', 'coordinator'])) {
            throw new InvalidRoleException('Only mentors or coordinators can mark attendance for others.');
        }

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

    public function markUsersAsAbsent(int $eventId, array $userIds): array
    {
        /** @var User $authUser */
        $authUser = auth()->user();

        if (!$authUser || !in_array($authUser->role, ['mentor', 'coordinator'])) {
            throw new InvalidRoleException('Only mentors or coordinators can mark absences for others.');
        }

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

}
