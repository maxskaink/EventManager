<?php

namespace App\Services\Contracts;

use App\Models\ExternalEvent;
use Illuminate\Database\Eloquent\Collection;

interface ExternalEventServiceInterface
{
    /**
     * Create a new external event.
     *
     * @param array $data
     * @return ExternalEvent
     */
    public function addExternalEvent(array $data): ExternalEvent;

    /**
     * Update an existing external event.
     *
     * @param int $eventId
     * @param array $data
     * @return ExternalEvent
     */
    public function updateExternalEvent(int $eventId, array $data): ExternalEvent;

    /**
     * Delete an external event by its ID.
     *
     * @param int $eventId
     * @return void
     */
    public function deleteExternalEvent(int $eventId): void;

    /**
     * Get external events for a specific user.
     *
     * @param int $userId
     * @return Collection<int, ExternalEvent>
     */
    public function getExternalEventsByUser(int $userId): Collection;

    /**
     * Get all external events in the system.
     *
     * @return Collection<int, ExternalEvent>
     */
    public function getAllExternalEvents(): Collection;

    /**
     * Get external events occurring within a date range.
     *
     * @param string $startDate
     * @param string $endDate
     * @return Collection<int, ExternalEvent>
     */
    public function getExternalEventsByDateRange(string $startDate, string $endDate): Collection;

    /**
     * Get all trusted organizations.
     *
     * @return array<int, string>
     */
    public function getAllTrustedOrganizations(): array;
}
