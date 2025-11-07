<?php

namespace App\Services\Implementations;

use App\Exceptions\DuplicatedResourceException;
use App\Exceptions\InvalidRoleException;
use App\Models\ExternalEvent;
use App\Models\User;
use App\Services\Contracts\ExternalEventServiceInterface;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use InvalidArgumentException;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;

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
     * @throws ResourceNotFoundException
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
            throw new ResourceNotFoundException('The specified user does not exist.');
        }

        // Only the same user or a mentor can create an external event
        if ($authUser->id !== $user->id && $authUser->role !== 'mentor') {
            throw new InvalidRoleException('You are not allowed to create external events for other users.');
        }

        // Check for duplicate name within same date range
        $existing = ExternalEvent::query()
            ->where('user_id', $data['user_id'])
            ->where('name', $data['name'])
            ->whereBetween('start_date', [$data['start_date'], $data['end_date']])
            ->first();

        if ($existing) {
            throw new DuplicatedResourceException(
                "An external event named '{$data['name']}' already exists for this user within the same date range."
            );
        }

        $data['start_date'] = Carbon::parse($data['start_date'])->toDateTimeString();
        $data['end_date'] = Carbon::parse($data['end_date'])->toDateTimeString();

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
     * @throws DuplicatedResourceException
     * @throws ResourceNotFoundException
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
            throw new ResourceNotFoundException('The specified external event does not exist.');
        }

        // Only the owner or mentor can update
        if ($authUser->id !== $event->user_id && $authUser->role !== 'mentor') {
            throw new InvalidRoleException('You are not allowed to update this external event.');
        }

        // Validate reassignment of user_id
        if (isset($data['user_id'])) {
            $newUser = User::query()->find($data['user_id']);
            if (!$newUser) {
                throw new ResourceNotFoundException('The specified user does not exist.');
            }

            if ($authUser->role !== 'mentor' && $data['user_id'] !== $authUser->id) {
                throw new InvalidRoleException('You cannot reassign this external event to another user.');
            }
        }

        // Check for duplicate name for same user
        if (isset($data['name'])) {
            $duplicate = ExternalEvent::query()
                ->where('user_id', $data['user_id'] ?? $event->user_id)
                ->where('name', $data['name'])
                ->where('id', '<>', $eventId)
                ->first();

            if ($duplicate) {
                throw new DuplicatedResourceException(
                    "An external event named '{$data['name']}' already exists for this user."
                );
            }
        }

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

    /**
     * Delete an existing external event.
     *
     * @param int $eventId
     * @throws InvalidRoleException
     * @throws ResourceNotFoundException
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
            throw new ResourceNotFoundException('The specified external event does not exist.');
        }

        if ($authUser->id !== $event->user_id && $authUser->role !== 'mentor') {
            throw new InvalidRoleException('You are not allowed to delete this external event.');
        }

        $event->delete();
    }

    /**
     * Get external events of the authenticated user.
     *
     * @return Collection<int, ExternalEvent>
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
     * Get external events by user ID.
     *
     * @param int $userId
     * @return Collection<int, ExternalEvent>
     * @throws InvalidRoleException
     * @throws ResourceNotFoundException
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
            throw new ResourceNotFoundException('The specified user does not exist.');
        }

        if ($authUser->id !== $userId && $authUser->role !== 'mentor') {
            throw new AuthorizationException('You are not allowed to view external events of other users.');
        }

        return ExternalEvent::query()
            ->where('user_id', $userId)
            ->orderByDesc('start_date')
            ->get();
    }

    /**
     * Get all external events (only mentors).
     *
     * @return Collection<int, ExternalEvent>
     * @throws AuthorizationException
     */
    public function getAllExternalEvents(): Collection
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        if (!$authUser || $authUser->role !== 'mentor') {
            throw new AuthorizationException('Only mentors can view all external events.');
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
     * @throws InvalidArgumentException
     * @throws AuthorizationException
     */
    public function getExternalEventsByDateRange(string $startDate, string $endDate): Collection
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        if (!$authUser || $authUser->role !== 'mentor') {
            throw new AuthorizationException('Only mentors can filter external events by date range.');
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
