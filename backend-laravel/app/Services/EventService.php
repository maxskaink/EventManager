<?php

namespace App\Services;

use App\Exceptions\DuplicatedResourceException;
use App\Models\Event;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class EventService
{
    public function addEvent(array $data): Event
    {
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
}
