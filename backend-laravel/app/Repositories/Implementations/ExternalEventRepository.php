<?php

namespace App\Repositories\Implementations;

use App\Models\ExternalEvent;
use App\Repositories\Contracts\ExternalEventRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ExternalEventRepository implements ExternalEventRepositoryInterface
{
    /**
     * {@inheritDoc}
     */
    public function create(array $data): ExternalEvent
    {
        return ExternalEvent::query()->create($data);
    }

    /**
     * {@inheritDoc}
     */
    public function update(int $id, array $data): ExternalEvent
    {
        $event = ExternalEvent::query()->findOrFail($id);
        $event->update($data);
        return $event;
    }

    /**
     * {@inheritDoc}
     */
    public function delete(int $id): void
    {
        ExternalEvent::query()->where('id', $id)->delete();
    }

    /**
     * {@inheritDoc}
     */
    public function findById(int $id): ?ExternalEvent
    {
        return ExternalEvent::query()->find($id);
    }

    /**
     * {@inheritDoc}
     */
    public function findDuplicate(int $userId, string $name, string $start, string $end): ?ExternalEvent
    {
        // Check for an existing event with the same user, name, and time range.
        return ExternalEvent::query()
            ->where('user_id', $userId)
            ->where('name', $name)
            ->whereBetween('start_date', [$start, $end])
            ->first();
    }

    /**
     * {@inheritDoc}
     */
    public function findByUserId(int $userId): Collection
    {
        // Retrieve all external events for a user, ordered by start date.
        return ExternalEvent::query()
            ->where('user_id', $userId)
            ->orderByDesc('start_date')
            ->get();
    }

    /**
     * {@inheritDoc}
     */
    public function findAll(): Collection
    {
        return ExternalEvent::query()
            ->orderByDesc('start_date')
            ->get();
    }

    /**
     * {@inheritDoc}
     */
    public function findBetweenDates(string $start, string $end): Collection
    {
        // Filter external events occurring within the specified date range.
        return ExternalEvent::query()
            ->whereBetween('start_date', [$start, $end])
            ->orderBy('start_date')
            ->get();
    }

    /**
     * {@inheritDoc}
     */
    public function findByNameForUser(int $userId, string $name, ?int $excludeId = null): ?ExternalEvent
    {
        $query = ExternalEvent::query()
            ->where('user_id', $userId)
            ->where('name', $name);

        // Exclude a specific ID, useful for update validation.
        if ($excludeId) {
            $query->where('id', '<>', $excludeId);
        }

        return $query->first();
    }
}
