<?php

namespace App\Services\Implementations;

use App\Exceptions\DuplicatedResourceException;
use App\Models\ExternalEvent;
use App\Models\User;
use App\Repositories\Contracts\ExternalEventRepositoryInterface;
use App\Services\Contracts\ExternalEventServiceInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;
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

    /**
     * {@inheritDoc}
     *
     * @throws ResourceNotFoundException
     * @throws DuplicatedResourceException
     * @throws InvalidArgumentException
     */
    public function addExternalEvent(array $data): ExternalEvent
    {
        $user = User::query()->find($data['user_id']);
        if (!$user) {
            throw new ResourceNotFoundException('The specified user does not exist.');
        }

        // Check for duplicate events
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

        // Validate organization and URL
        $this->validateHostOrganization($data['host_organization']);

        if (!empty($data['participation_url'])) {
            $this->validateParticipationUrl($data['participation_url']);
        }

        $this->validateDates($data);

        return $this->repository->create($data);
    }

    /**
     * {@inheritDoc}
     *
     * @throws ResourceNotFoundException
     * @throws DuplicatedResourceException
     * @throws InvalidArgumentException
     */
    public function updateExternalEvent(int $eventId, array $data): ExternalEvent
    {
        $event = $this->repository->findById($eventId);
        if (!$event) {
            throw new ResourceNotFoundException('The specified external event does not exist.');
        }

        // If reassigning user, validate user exists
        if (isset($data['user_id'])) {
            $newUser = User::query()->find($data['user_id']);
            if (!$newUser) {
                throw new ResourceNotFoundException('The specified user does not exist.');
            }
        }

        // Check for duplicates if name is updated
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

    /**
     * {@inheritDoc}
     *
     * @throws ResourceNotFoundException
     */
    public function deleteExternalEvent(int $eventId): void
    {
        $event = $this->repository->findById($eventId);
        if (!$event) {
            throw new ResourceNotFoundException('The specified external event does not exist.');
        }

        $this->repository->delete($eventId);
    }

    /**
     * Get external events for a specific user.
     *
     * @param int $userId The user ID
     * @return Collection<int, ExternalEvent>
     */
    public function getExternalEventsOfUser(int $userId): Collection
    {
        return $this->repository->findByUserId($userId);
    }

    /**
     * {@inheritDoc}
     */
    public function getAllExternalEvents(): Collection
    {
        return $this->repository->findAll();
    }

    /**
     * {@inheritDoc}
     */
    public function getExternalEventsByUser(int $userId): Collection
    {
        return $this->getExternalEventsOfUser($userId);
    }

    /**
     * {@inheritDoc}
     */
    public function getExternalEventsOfActiveUser(): Collection
    {
        $authUser = request()->user();
        if (!$authUser) {
            throw new \RuntimeException('No authenticated user found.');
        }
        return $this->getExternalEventsOfUser($authUser->id);
    }

    /**
     * {@inheritDoc}
     *
     * @throws InvalidArgumentException
     */
    public function getExternalEventsByDateRange(string $startDate, string $endDate): Collection
    {

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
        // Check if organization matches trusted list (case-insensitive partial match)
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

        // Check if domain is in trusted list
        $isTrusted = collect($this->trustedOrganizations)
            ->contains(fn($trusted) => Str::endsWith($domain, $trusted));

        if (!$isTrusted) {
            throw new InvalidArgumentException(
                "The participation URL domain '{$domain}' is not trusted."
            );
        }

        // Verify URL accessibility
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
