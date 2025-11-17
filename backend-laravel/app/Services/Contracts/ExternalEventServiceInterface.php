<?php

namespace App\Services\Contracts;

use App\Models\ExternalEvent;
use Illuminate\Database\Eloquent\Collection;

interface ExternalEventServiceInterface
{
    public function addExternalEvent(array $data): ExternalEvent;

    public function updateExternalEvent(int $eventId, array $data): ExternalEvent;

    public function deleteExternalEvent(int $eventId): void;


    /**
     * @param int $userId
     * @return Collection<int, ExternalEvent>
     */
    public function getExternalEventsByUser(int $userId): Collection;

    /**
     * @return Collection<int, ExternalEvent>
     */
    public function getAllExternalEvents(): Collection;

    /**
     * @param string $startDate
     * @param string $endDate
     * @return Collection<int, ExternalEvent>
     */
    public function getExternalEventsByDateRange(string $startDate, string $endDate): Collection;

    public function getAllTrustedOrganizations() : array;
}
