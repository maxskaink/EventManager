<?php

namespace App\Services\Implementations;

use App\Exceptions\DuplicatedResourceException;
use App\Models\Event;
use App\Repositories\Contracts\EventRepositoryInterface;
use App\Repositories\Contracts\ParticipationRepositoryInterface;
use App\Models\User;
use App\Services\Contracts\EventServiceInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Nette\Schema\ValidationException;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class EventService implements EventServiceInterface
{
    private EventRepositoryInterface $eventRepository;
    private ParticipationRepositoryInterface $participationRepository;

    public function __construct(
        EventRepositoryInterface $eventRepository,
        ParticipationRepositoryInterface $participationRepository
    ) {
        $this->eventRepository = $eventRepository;
        $this->participationRepository = $participationRepository;
    }

    /**
     * {@inheritDoc}
     *
     * @throws DuplicatedResourceException
     */
    public function addEvent(array $data): Event
    {
        if ($this->eventRepository->findByName($data['name'])) {
            throw new DuplicatedResourceException("A resource with the name: {$data['name']} already exists");
        }

        $data['start_date'] = Carbon::parse($data['start_date'])->toDateTimeString();
        $data['end_date'] = Carbon::parse($data['end_date'])->toDateTimeString();

        return $this->eventRepository->create($data);
    }

    /**
     * {@inheritDoc}
     *
     * @throws ResourceNotFoundException
     */
    public function deleteEvent(int $id): Event
    {
        $event = $this->eventRepository->findById($id);
        if (!$event) {
            throw new ResourceNotFoundException("The event with ID {$id} was not found.");
        }

        $event->delete();
        return $event;
    }

    /**
     * {@inheritDoc}
     */
    public function listAllEvents(): Collection
    {
        return $this->eventRepository->findAll();
    }

    /**
     * {@inheritDoc}
     */
    public function listUpcomingEvents(): Collection
    {
        return $this->eventRepository->findUpcoming();
    }

    /**
     * {@inheritDoc}
     */
    public function listPastEvents(): Collection
    {
        return $this->eventRepository->findPast();
    }

    /**
     * {@inheritDoc}
     *
     * @throws ResourceNotFoundException
     * @throws DuplicatedResourceException
     */
    public function updateEvent(int $id, array $data): Event
    {
        $event = $this->eventRepository->findById($id);
        if (!$event) {
            throw new ResourceNotFoundException("The event with ID {$id} was not found.");
        }

        if (isset($data['name']) && $this->eventRepository->findByName($data['name'])) {
            throw new DuplicatedResourceException("A resource with the name: {$data['name']} already exists");
        }

        return $this->eventRepository->update($id, $data);
    }

    /**
     * {@inheritDoc}
     *
     * @throws ModelNotFoundException
     * @throws ResourceNotFoundException
     * @throws ValidationException
     * @throws DuplicatedResourceException
     */
    /**
     * {@inheritDoc}
     *
     * @throws ModelNotFoundException
     * @throws ResourceNotFoundException
     * @throws ValidationException
     * @throws DuplicatedResourceException
     */
    public function enrollUserInEvent(int $eventId, int $userId)
    {
        // Verify user existence
        $user = User::query()->find($userId);
        if (!$user) {
            throw new ModelNotFoundException('The specified user does not exist.');
        }

        // Verify event existence
        $event = $this->eventRepository->findById($eventId);
        if (!$event) {
            throw new ResourceNotFoundException('Event not found.');
        }

        // Check if event has already started
        if (now()->greaterThanOrEqualTo($event->start_date)) {
            throw new ValidationException('Event has already started. Enrollment is closed.');
        }

        // Check for existing enrollment
        $existing = $this->participationRepository->findByUserAndEvent($userId, $eventId);
        if ($existing) {
            // If previously cancelled, re-enroll
            if ($existing->status === 'cancelado') {
                $existing->update(['status' => 'inscrito']);
                return $existing;
            }
            throw new DuplicatedResourceException('User is already enrolled in this event.');
        }

        // Check capacity if set
        if ($event->capacity !== null) {
            $count = $this->participationRepository->countActiveByEvent($eventId);
            if ($count >= $event->capacity) {
                throw new ValidationException('Event capacity reached.');
            }
        }

        return $this->participationRepository->create([
            'event_id' => $eventId,
            'user_id' => $userId,
            'status' => 'inscrito',
        ]);
    }

    /**
     * {@inheritDoc}
     *
     * @throws ResourceNotFoundException
     * @throws ValidationException
     */
    public function cancelUserEnrollment(int $eventId, int $userId)
    {
        // Verify enrollment exists
        $participation = $this->participationRepository->findByUserAndEvent($userId, $eventId);
        if (!$participation) {
            throw new ResourceNotFoundException('User is not enrolled in this event.');
        }

        // Verify event exists
        $event = $this->eventRepository->findById($eventId);
        if (!$event) {
            throw new ResourceNotFoundException('Event not found.');
        }

        // Prevent cancellation if event has started
        if (now()->greaterThanOrEqualTo($event->start_date)) {
            throw new ValidationException('Cannot cancel enrollment after the event has started.');
        }

        $participation->update(['status' => 'cancelado']);
        return $participation;
    }

    /**
     * {@inheritDoc}
     *
     * @throws ResourceNotFoundException
     */
    public function markUsersAsAttended(int $eventId, array $userIds): array
    {
        $event = $this->eventRepository->findById($eventId);
        if (!$event) {
            throw new ResourceNotFoundException('Event not found.');
        }

        $results = [];
        // Process attendance in a transaction
        DB::transaction(function () use ($eventId, $userIds, &$results) {
            foreach ($userIds as $userId) {
                $p = $this->participationRepository->findByUserAndEvent($userId, $eventId);
                if (!$p) {
                    $results[$userId] = 'User not enrolled.';
                    continue;
                }
                // Only mark as attended if currently enrolled
                if ($p->status !== 'inscrito') {
                    $results[$userId] = 'Invalid status.';
                    continue;
                }
                $p->update(['status' => 'asistio']);
                $results[$userId] = 'Marked as attended.';
            }
        });
        return $results;
    }

    /**
     * {@inheritDoc}
     *
     * @throws ResourceNotFoundException
     */
    public function markUsersAsAbsent(int $eventId, array $userIds): array
    {
        $event = $this->eventRepository->findById($eventId);
        if (!$event) {
            throw new ResourceNotFoundException('Event not found.');
        }

        $results = [];
        // Process absence in a transaction
        DB::transaction(function () use ($eventId, $userIds, &$results) {
            foreach ($userIds as $userId) {
                $p = $this->participationRepository->findByUserAndEvent($userId, $eventId);
                if (!$p) {
                    $results[$userId] = 'User not enrolled.';
                    continue;
                }
                // Only mark as absent if currently enrolled
                if ($p->status !== 'inscrito') {
                    $results[$userId] = 'Invalid status.';
                    continue;
                }
                $p->update(['status' => 'ausente']);
                $results[$userId] = 'Marked as absent.';
            }
        });
        return $results;
    }

    /**
     * {@inheritDoc}
     *
     * @throws ResourceNotFoundException
     */
    public function getEventById(int $id): Event
    {
        $event = $this->eventRepository->findById($id);
        if (!$event) {
            throw new ResourceNotFoundException("The event with ID {$id} was not found.");
        }
        return $event;
    }

    /**
     * {@inheritDoc}
     */
    public function listParticipationsByEvent(int $eventId): Collection
    {
        return $this->participationRepository->findByEventId($eventId);
    }

    /**
     * {@inheritDoc}
     */
    public function listParticipationsByUser(int $userId): Collection
    {
        return $this->participationRepository->findByUserId($userId);
    }

    /**
     * {@inheritDoc}
     */
    public function listAllParticipations(?string $status = null): Collection
    {
        return $this->participationRepository->findAll($status);
    }


}
