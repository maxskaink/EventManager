<?php

namespace App\Services;

use App\Exceptions\DuplicatedResourceException;
use App\Exceptions\InvalidRoleException;
use App\Models\Event;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;

class EventService
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
     * @throws AuthorizationException
     */
    public function listUpcomingEvents(): Collection
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        if ($authUser && !in_array($authUser->role, ['mentor', 'coordinator'])) {
            throw new AuthorizationException('You are not allowed to view all events.');
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
}
