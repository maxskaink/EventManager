<?php

namespace App\Repositories\Contracts;

use App\Models\ExternalEvent;
use Illuminate\Database\Eloquent\Collection;

interface ExternalEventRepositoryInterface
{
    /**
     * Create a new external event.
     *
     * @param array $data
     * @return ExternalEvent
     */
    public function create(array $data): ExternalEvent;

    /**
     * Update an existing external event.
     *
     * @param int $id
     * @param array $data
     * @return ExternalEvent
     */
    public function update(int $id, array $data): ExternalEvent;

    /**
     * Delete an external event by its ID.
     *
     * @param int $id
     * @return void
     */
    public function delete(int $id): void;

    /**
     * Find an external event by its ID.
     *
     * @param int $id
     * @return ExternalEvent|null
     */
    public function findById(int $id): ?ExternalEvent;

    /**
     * Find a duplicate external event.
     *
     * @param int $userId
     * @param string $name
     * @param string $start
     * @param string $end
     * @return ExternalEvent|null
     */
    public function findDuplicate(int $userId, string $name, string $start, string $end): ?ExternalEvent;

    /**
     * Find all external events associated with a user.
     *
     * @param int $userId
     * @return Collection<int, ExternalEvent>
     */
    public function findByUserId(int $userId): Collection;

    /**
     * Retrieve all external events.
     *
     * @return Collection<int, ExternalEvent>
     */
    public function findAll(): Collection;

    /**
     * Find external events within a date range.
     *
     * @param string $start
     * @param string $end
     * @return Collection<int, ExternalEvent>
     */
    public function findBetweenDates(string $start, string $end): Collection;

    /**
     * Find an external event by name for a specific user, optionally excluding an ID.
     *
     * @param int $userId
     * @param string $name
     * @param int|null $excludeId
     * @return ExternalEvent|null
     */
    public function findByNameForUser(int $userId, string $name, ?int $excludeId = null): ?ExternalEvent;
}
