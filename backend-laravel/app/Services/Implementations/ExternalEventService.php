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
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use InvalidArgumentException;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;

class ExternalEventService implements ExternalEventServiceInterface
{
    /** @var array<string> */
    private array $trustedOrganizations;

    public function __construct()
    {
        // Load trusted host organizations and URL domains from config/external_events.php
        $this->trustedOrganizations = config('trusted_events.organizations', []);
    }

    /**
     * Create and store a new external event for a user.
     *
     * @param array $data
     * @return ExternalEvent
     *
     * @throws InvalidRoleException
     * @throws DuplicatedResourceException
     * @throws ResourceNotFoundException
     * @throws InvalidArgumentException
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

        // Check for duplicate event name for the same user in same date range
        $existing = ExternalEvent::query()
            ->where('user_id', $data['user_id'])
            ->where('name', $data['name'])
            ->whereBetween('start_date', [$data['start_date'], $data['end_date']])
            ->first();

        if ($existing) {
            throw new DuplicatedResourceException(
                "An external event named '{$data['name']}' already exists for this user within this date range."
            );
        }

        // ✅ Validate host organization credibility
        $this->validateHostOrganization($data['host_organization']);

        // ✅ Validate URL credibility if provided
        if (!empty($data['participation_url'])) {
            $this->validateParticipationUrl($data['participation_url']);
        }

        // ✅ Validate date logic
        $start = Carbon::parse($data['start_date']);
        $end = Carbon::parse($data['end_date']);

        if ($end->isBefore($start)) {
            throw new InvalidArgumentException('The end date cannot be earlier than the start date.');
        }

        $event = new ExternalEvent();
        $event->fill($data);
        $event->save();

        return $event;
    }

    /**
     * Validate that the host organization is trusted or partially matches a known entity.
     */
    private function validateHostOrganization(string $organization): void
    {
        $isTrusted = collect($this->trustedOrganizations)
            ->contains(fn($trusted) => Str::contains(Str::lower($organization), Str::lower($trusted)));

        if (!$isTrusted) {
            throw new InvalidArgumentException(
                "The organization '{$organization}' is not recognized as a trusted event organizer."
            );
        }
    }

    /**
     * Validate that the participation URL is from a credible domain and accessible.
     */
    private function validateParticipationUrl(string $url): void
    {
        $domain = parse_url($url, PHP_URL_HOST);

        if (!$domain) {
            throw new InvalidArgumentException('The provided participation URL is invalid.');
        }

        // Check if domain matches any trusted organization domain
        $isTrusted = collect($this->trustedOrganizations)
            ->contains(fn($trusted) => Str::endsWith($domain, $trusted));

        if (!$isTrusted) {
            throw new InvalidArgumentException(
                "The participation URL domain '{$domain}' is not from a trusted organization."
            );
        }

        // Verify the URL is reachable
        try {
            $response = Http::timeout(5)->head($url);
            if ($response->failed()) {
                throw new InvalidArgumentException(
                    "The participation URL '{$url}' could not be reached or returned an error."
                );
            }
        } catch (\Throwable $e) {
            throw new InvalidArgumentException("The participation URL '{$url}' is not accessible.");
        }
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
     * @throws InvalidArgumentException
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

        // Validate and normalize dates if provided
        if (isset($data['start_date'])) {
            $data['start_date'] = Carbon::parse($data['start_date'])->toDateTimeString();
        }

        if (isset($data['end_date'])) {
            $data['end_date'] = Carbon::parse($data['end_date'])->toDateTimeString();
        }

        if (isset($data['start_date']) && isset($data['end_date'])) {
            $start = Carbon::parse($data['start_date']);
            $end = Carbon::parse($data['end_date']);

            if ($end->isBefore($start)) {
                throw new InvalidArgumentException('The end date cannot be earlier than the start date.');
            }
        }

        // ✅ Validate host organization credibility if changed
        if (isset($data['host_organization'])) {
            $this->validateHostOrganization($data['host_organization']);
        }

        // ✅ Validate participation URL if changed
        if (!empty($data['participation_url'])) {
            $this->validateParticipationUrl($data['participation_url']);
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
     * @throws ResourceNotFoundException|AuthorizationException
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

    public function getAllTrustedOrganizations(): array
    {
        return $this->trustedOrganizations;
    }
}
