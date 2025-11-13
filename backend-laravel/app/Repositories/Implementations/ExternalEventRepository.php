<?php

namespace App\Repositories\Implementations;

use App\Models\ExternalEvent;
use App\Repositories\Contracts\ExternalEventRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ExternalEventRepository implements ExternalEventRepositoryInterface
{
    public function create(array $data): ExternalEvent
    {
        return ExternalEvent::query()->create($data);
    }

    public function update(int $id, array $data): ExternalEvent
    {
        $event = ExternalEvent::query()->findOrFail($id);
        $event->update($data);
        return $event;
    }

    public function delete(int $id): void
    {
        ExternalEvent::query()->where('id', $id)->delete();
    }

    public function findById(int $id): ?ExternalEvent
    {
        return ExternalEvent::query()->find($id);
    }

    public function findDuplicate(int $userId, string $name, string $start, string $end): ?ExternalEvent
    {
        return ExternalEvent::query()
            ->where('user_id', $userId)
            ->where('name', $name)
            ->whereBetween('start_date', [$start, $end])
            ->first();
    }

    public function findByUserId(int $userId): Collection
    {
        return ExternalEvent::query()
            ->where('user_id', $userId)
            ->orderByDesc('start_date')
            ->get();
    }

    public function findAll(): Collection
    {
        return ExternalEvent::query()
            ->orderByDesc('start_date')
            ->get();
    }

    public function findBetweenDates(string $start, string $end): Collection
    {
        return ExternalEvent::query()
            ->whereBetween('start_date', [$start, $end])
            ->orderBy('start_date')
            ->get();
    }

    public function findByNameForUser(int $userId, string $name, ?int $excludeId = null): ?ExternalEvent
    {
        $query = ExternalEvent::query()
            ->where('user_id', $userId)
            ->where('name', $name);

        if ($excludeId) {
            $query->where('id', '<>', $excludeId);
        }

        return $query->first();
    }
}
