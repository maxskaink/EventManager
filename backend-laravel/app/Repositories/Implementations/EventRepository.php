<?php

namespace App\Repositories\Implementations;

use App\Models\Event;
use App\Models\Publication;
use App\Repositories\Contracts\EventRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;

class EventRepository implements EventRepositoryInterface
{
    public function create(array $data): Event
    {
        return Event::query()->create($data);
    }

    public function update(int $id, array $data): Event
    {
        $event = Event::query()->findOrFail($id);
        $event->update($data);
        return $event;
    }

    public function findById(int $id): ?Event
    {
        return Event::query()->find($id);
    }

    public function findByName(string $name): ?Event
    {
        return Event::query()->where('name', $name)->first();
    }

    public function findAll(): Collection
    {
        return Event::query()->orderBy('start_date')->get();
    }

    public function findUpcoming(): Collection
    {
        return Event::query()
            ->where('end_date', '>=', Carbon::now())
            ->orderBy('start_date')
            ->get();
    }

    public function findPast(): Collection
    {
        return Event::query()
            ->where('end_date', '<', Carbon::now())
            ->orderBy('end_date', 'desc')
            ->get();
    }

    public function attachPublication(int $eventId, Publication $publication): void
    {
        $event = Event::query()->findOrFail($eventId);

        // Assign publication_id directly
        $event->publication()->associate($publication->id);

        $event->save();
    }
}
