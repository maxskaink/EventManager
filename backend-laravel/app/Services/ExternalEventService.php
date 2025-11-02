<?php

namespace App\Services;

use App\Exceptions\DuplicatedResourceException;
use App\Exceptions\InvalidRoleException;
use App\Models\ExternalEvent;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use InvalidArgumentException;
use App\Services\Contracts\ExternalEventServiceInterface;

class ExternalEventService implements ExternalEventServiceInterface
{
    /**
     * Create and store a new external event for a user.
     *
     * @param array $data
     * @return ExternalEvent
     *
     * @throws InvalidRoleException
     * @throws DuplicatedResourceException
     * @throws ModelNotFoundException
     */
    public function addExternalEvent(array $data): ExternalEvent
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        if (!$authUser) {
            throw new InvalidRoleException('You must be logged in to add an external event.');
        }

        $user = User::query()->find($data['user_id']);
        if (!$user) {
            throw new ModelNotFoundException('The specified user does not exist.');
        }

        // Only same user or mentor can create an external event
        if ($authUser->id !== $user->id && $authUser->role !== 'mentor') {
            throw new InvalidRoleException('You are not allowed to create external events for other users.');
        }

        // Check for duplicate event name for this user within same date range
        $existingEvent = ExternalEvent::query()
            ->where('user_id', $data['user_id'])
            ->where('name', $data['name'])
            ->whereBetween('start_date', [$data['start_date'], $data['end_date']])
            ->first();

        if ($existingEvent) {
            throw new DuplicatedResourceException(
                "An external event named '{$data['name']}' already exists for this user within the same date range."
            );
        }

        $event = new ExternalEvent();
        $event->fill($data);
        $event->save();

        return $event;
    }

    /**
     * Update an existing external event.
     *
     * @param int $eventId
     * @param array $data
     * @return ExternalEvent
     *
     * @throws InvalidRoleException
     * @throws ModelNotFoundException
     * @throws DuplicatedResourceException
     */
    public function updateExternalEvent(int $eventId, array $data): ExternalEvent
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        if (!$authUser) {
            throw new InvalidRoleException('You must be logged in to update an external event.');
        }

        $event = ExternalEvent::query()->find($eventId);
        if (!$event) {
            throw new ModelNotFoundException('The specified external event does not exist.');
        }

        // Only the event owner or a mentor can update it
        if ($authUser->id !== $event->user_id && $authUser->role !== 'mentor') {
            throw new InvalidRoleException('You are not allowed to update this external event.');
        }

        if (isset($data['user_id'])) {
            $newUser = User::query()->find($data['user_id']);
            if (!$newUser) {
                throw new ModelNotFoundException('The specified user does not exist.');
            }

            if ($authUser->role !== 'mentor' && $data['user_id'] !== $authUser->id) {
                throw new InvalidRoleException('You cannot reassign this external event to another user.');
            }
        }

        // Avoid duplicate names for the same user
        if (isset($data['name'])) {
            $duplicate = ExternalEvent::query()
                ->where('user_id', $data['user_id'] ?? $event->user_id)
                ->where('name', $data['name'])
                ->where('id', '!=', $eventId)
                ->first();

            if ($duplicate) {
                throw new DuplicatedResourceException(
                    "An external event named '{$data['name']}' already exists for this user."
                );
            }
        }

        $event->fill($data);
        $event->save();

        return $event;
    }

    /**
     * Delete an existing external event.
     *
     * @param int $eventId
     * @return void
     *
     * @throws InvalidRoleException
     * @throws ModelNotFoundException
     */
    public function deleteExternalEvent(int $eventId): void
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        if (!$authUser) {
            throw new InvalidRoleException('You must be logged in to delete an external event.');
        }

        $event = ExternalEvent::query()->find($eventId);
        if (!$event) {
            throw new ModelNotFoundException('The specified external event does not exist.');
        }

        if ($authUser->id !== $event->user_id && $authUser->role !== 'mentor') {
            throw new InvalidRoleException('You are not allowed to delete this external event.');
        }

        $event->delete();
    }

    /**
     * Get all external events of the currently authenticated user.
     *
     * @return Collection<int, ExternalEvent>
     *
     * @throws InvalidRoleException
     */
    public function getExternalEventsOfActiveUser(): Collection
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        if (!$authUser) {
            throw new InvalidRoleException('You must be logged in to view your external events.');
        }

        return ExternalEvent::query()
            ->where('user_id', $authUser->id)
            ->orderByDesc('start_date')
            ->get();
    }

    /**
     * Get all external events of a specific user.
     *
     * @param int $userId
     * @return Collection<int, ExternalEvent>
     *
     * @throws InvalidRoleException
     * @throws ModelNotFoundException
     */
    public function getExternalEventsByUser(int $userId): Collection
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        if (!$authUser) {
            throw new InvalidRoleException('You must be logged in to view external events.');
        }

        $user = User::query()->find($userId);
        if (!$user) {
            throw new ModelNotFoundException('The specified user does not exist.');
        }

        if ($authUser->id !== $userId && $authUser->role !== 'mentor') {
            throw new InvalidRoleException('You are not allowed to view external events of other users.');
        }

        return ExternalEvent::query()
            ->where('user_id', $userId)
            ->orderByDesc('start_date')
            ->get();
    }

    /**
     * Get all external events in the system (only mentors can access this).
     *
     * @return Collection<int, ExternalEvent>
     *
     * @throws InvalidRoleException
     */
    public function getAllExternalEvents(): Collection
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        if (!$authUser || $authUser->role !== 'mentor') {
            throw new InvalidRoleException('Only mentors can view all external events.');
        }

        return ExternalEvent::query()
            ->orderByDesc('start_date')
            ->get();
    }

    /**
     * Get all external events within a specific date range.
     *
     * @param string $startDate
     * @param string $endDate
     * @return Collection<int, ExternalEvent>
     *
     * @throws InvalidRoleException
     * @throws InvalidArgumentException
     */
    public function getExternalEventsByDateRange(string $startDate, string $endDate): Collection
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        if (!$authUser || $authUser->role !== 'mentor') {
            throw new InvalidRoleException('Only mentors can filter external events by date range.');
        }

        $start = Carbon::parse($startDate);
        $end = Carbon::parse($endDate);

        if ($end->isBefore($start)) {
            throw new InvalidArgumentException('The end date cannot be earlier than the start date.');
        }

        return ExternalEvent::query()
            ->whereBetween('start_date', [$start, $end])
            ->orderBy('start_date')
            ->get();
    }
}
