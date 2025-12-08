<?php

namespace App\Repositories\Contracts;

use App\Models\Event;
use App\Models\Publication;
use Illuminate\Database\Eloquent\Collection;

interface EventRepositoryInterface
{
    /**
     * Create a new event.
     *
     * @param array $data
     * @return Event
     */
    public function create(array $data): Event;

    /**
     * Update an existing event.
     *
     * @param int $id
     * @param array $data
     * @return Event
     */
    public function update(int $id, array $data): Event;

    /**
     * Find an event by its ID.
     *
     * @param int $id
     * @return Event|null
     */
    public function findById(int $id): ?Event;

    /**
     * Find an event by its name.
     *
     * @param string $name
     * @return Event|null
     */
    public function findByName(string $name): ?Event;

    /**
     * Retrieve all events.
     *
     * @return Collection<int, Event>
     */
    public function findAll(): Collection;

    /**
     * Retrieve all upcoming events.
     *
     * @return Collection<int, Event>
     */
    public function findUpcoming(): Collection;

    /**
     * Retrieve all past events.
     *
     * @return Collection<int, Event>
     */
    public function findPast(): Collection;

    /**
     * Attach a publication to an event.
     *
     * @param int $eventId
     * @param Publication $publication
     * @return void
     */
    public function attachPublication(int $eventId, Publication $publication): void;
}
