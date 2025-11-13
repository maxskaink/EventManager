<?php

namespace App\Services\Implementations;

use App\Exceptions\DuplicatedResourceException;
use App\Exceptions\InvalidRoleException;
use App\Models\ExternalEvent;
use App\Models\User;
use App\Repositories\Contracts\ExternalEventRepositoryInterface;
use App\Services\Contracts\ExternalEventServiceInterface;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use InvalidArgumentException;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;

class ExternalEventService implements ExternalEventServiceInterface
{
    private ExternalEventRepositoryInterface $repository;

    /** @var array<string> */
    private array $trustedOrganizations;

    public function __construct(ExternalEventRepositoryInterface $repository)
    {
        $this->repository = $repository;
        $this->trustedOrganizations = config('trusted_events.organizations', []);
    }

    public function addExternalEvent(array $data): ExternalEvent
    {
        $authUser = Auth::user();
        if (!$authUser) {
            throw new InvalidRoleException('You must be logged in to add an external event.');
        }

        $user = User::query()->find($data['user_id']);
        if (!$user) {
            throw new ResourceNotFoundException('The specified user does not exist.');
        }

        if ($authUser->id !== $user->id && $authUser->role !== 'mentor') {
            throw new InvalidRoleException('You are not allowed to create external events for other users.');
        }

        $duplicate = $this->repository->findDuplicate(
            $data['user_id'],
            $data['name'],
            $data['start_date'],
            $data['end_date']
        );

        if ($duplicate) {
            throw new DuplicatedResourceException(
                "An external event named '{$data['name']}' already exists."
            );
        }

        $this->validateHostOrganization($data['host_organization']);

        if (!empty($data['participation_url'])) {
            $this->validateParticipationUrl($data['participation_url']);
        }

        $this->validateDates($data);

        return $this->repository->create($data);
    }

    public function updateExternalEvent(int $eventId, array $data) : ExternalEvent
    {
        $authUser = Auth::user();
        if (!$authUser) {
            throw new InvalidRoleException('You must be logged in to update an external event.');
        }

        $event = $this->repository->findById($eventId);
        if (!$event) {
            throw new ResourceNotFoundException('The specified external event does not exist.');
        }

        if ($authUser->id!== $event->user_id && $authUser->role !== 'mentor') {
            throw new InvalidRoleException('You are not allowed to update this external event.');
        }

        if (isset($data['user_id'])) {
            $newUser = User::query()->find($data['user_id']);
            if (!$newUser) {
                throw new ResourceNotFoundException('The specified user does not exist.');
            }

            if ($authUser->role !== 'mentor' && $data['user_id'] !== $authUser->id) {
                throw new InvalidRoleException('You cannot reassign this external event to another user.');
            }
        }

        if (isset($data['name'])) {
            $duplicate = $this->repository->findByNameForUser(
                $data['user_id'] ?? $event->user_id,
                $data['name'],
                $eventId
            );

            if ($duplicate) {
                throw new DuplicatedResourceException(
                    "An external event named '{$data['name']}' already exists for this user."
                );
            }
        }

        $this->validateDates($data, true);

        if (isset($data['host_organization'])) {
            $this->validateHostOrganization($data['host_organization']);
        }

        if (!empty($data['participation_url'])) {
            $this->validateParticipationUrl($data['participation_url']);
        }

        return $this->repository->update($eventId, $data);
    }

    public function deleteExternalEvent(int $eventId): void
    {
        $authUser = Auth::user();
        if (!$authUser) {
            throw new InvalidRoleException('You must be logged in to delete an external event.');
        }

        $event = $this->repository->findById($eventId);
        if (!$event) {
            throw new ResourceNotFoundException('The specified external event does not exist.');
        }

        if ($authUser->id !== $event->user_id && $authUser->role !== 'mentor') {
            throw new InvalidRoleException('You are not allowed to delete this external event.');
        }

        $this->repository->delete($eventId);
    }

    public function getExternalEventsOfActiveUser(): Collection
    {
        $authUser = Auth::user();
        if (!$authUser) {
            throw new InvalidRoleException('You must be logged in to view your external events.');
        }

        return $this->repository->findByUserId($authUser->id);
    }

    public function getExternalEventsByUser(int $userId): Collection
    {
        $authUser = Auth::user();

        if (!$authUser) {
            throw new InvalidRoleException('You must be logged in.');
        }

        $user = User::query()->find($userId);
        if (!$user) {
            throw new ResourceNotFoundException('The specified user does not exist.');
        }

        if ($authUser->id !== $userId && $authUser->role !== 'mentor') {
            throw new AuthorizationException('You are not allowed to view external events of other users.');
        }

        return $this->repository->findByUserId($userId);
    }

    public function getAllExternalEvents(): Collection
    {
        $authUser = Auth::user();

        if (!$authUser || $authUser->role !== 'mentor') {
            throw new AuthorizationException('Only mentors can view all external events.');
        }

        return $this->repository->findAll();
    }

    public function getExternalEventsByDateRange(string $startDate, string $endDate): Collection
    {
        $authUser = Auth::user();

        if (!$authUser || $authUser->role !== 'mentor') {
            throw new AuthorizationException('Only mentors can filter external events by date.');
        }

        if (Carbon::parse($endDate)->isBefore(Carbon::parse($startDate))) {
            throw new InvalidArgumentException('The end date cannot be earlier than the start date.');
        }

        return $this->repository->findBetweenDates($startDate, $endDate);
    }

    public function getAllTrustedOrganizations(): array
    {
        return $this->trustedOrganizations;
    }

    private function validateDates(array $data, bool $partial = false): void
    {
        if (!$partial || (isset($data['start_date']) && isset($data['end_date']))) {
            $startDate = Carbon::parse($data['start_date']);
            $endDate = Carbon::parse($data['end_date']);

            if ($endDate->isBefore($startDate)) {
                throw new InvalidArgumentException('The end date cannot be earlier than the start date.');
            }
        }
    }

    private function validateHostOrganization(string $organization): void
    {
        $isTrusted = collect($this->trustedOrganizations)
            ->contains(fn($trusted) => Str::contains(Str::lower($organization), Str::lower($trusted)));

        if (!$isTrusted) {
            throw new InvalidArgumentException(
                "The organization '{$organization}' is not recognized as trusted."
            );
        }
    }

    private function validateParticipationUrl(string $url): void
    {
        $domain = parse_url($url, PHP_URL_HOST);

        if (!$domain) {
            throw new InvalidArgumentException('The provided participation URL is invalid.');
        }

        $isTrusted = collect($this->trustedOrganizations)
            ->contains(fn($trusted) => Str::endsWith($domain, $trusted));

        if (!$isTrusted) {
            throw new InvalidArgumentException(
                "The participation URL domain '{$domain}' is not trusted."
            );
        }

        try {
            $response = Http::timeout(5)->head($url);
            if ($response->failed()) {
                throw new InvalidArgumentException("The participation URL '{$url}' could not be reached.");
            }
        } catch (\Throwable) {
            throw new InvalidArgumentException("The participation URL '{$url}' is not accessible.");
        }
    }
}
