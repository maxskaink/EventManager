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

    public function addEvent(array $data) : Event
    {
        if ($this->eventRepository->findByName($data['name'])) {
            throw new DuplicatedResourceException("A resource with the name: {$data['name']} already exists");
        }

        $data['start_date'] = Carbon::parse($data['start_date'])->toDateTimeString();
        $data['end_date'] = Carbon::parse($data['end_date'])->toDateTimeString();

        return $this->eventRepository->create($data);
    }

    public function listAllEvents(): Collection
    {
        return $this->eventRepository->findAll();
    }

    public function listUpcomingEvents(): Collection
    {
        return $this->eventRepository->findUpcoming();
    }

    public function listPastEvents(): Collection
    {
        return $this->eventRepository->findPast();
    }

    public function updateEvent(int $id, array $data) : Event
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

    public function enrollUserInEvent(int $eventId, int $userId)
    {
        $user = User::query()->find($userId);
        if (!$user) {
            throw new ModelNotFoundException('The specified user does not exist.');
        }

        $event = $this->eventRepository->findById($eventId);
        if (!$event) {
            throw new ResourceNotFoundException('Event not found.');
        }

        if (now()->greaterThanOrEqualTo($event->start_date)) {
            throw new ValidationException('Event has already started. Enrollment is closed.');
        }

        $existing = $this->participationRepository->findByUserAndEvent($userId, $eventId);
        if ($existing) {
            if ($existing->status === 'cancelado') {
                $existing->update(['status' => 'inscrito']);
                return $existing;
            }
            throw new DuplicatedResourceException('User is already enrolled in this event.');
        }

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

    public function cancelUserEnrollment(int $eventId, int $userId)
    {
        $participation = $this->participationRepository->findByUserAndEvent($userId, $eventId);
        if (!$participation) {
            throw new ResourceNotFoundException('User is not enrolled in this event.');
        }

        $event = $this->eventRepository->findById($eventId);
        if (!$event) {
            throw new ResourceNotFoundException('Event not found.');
        }

        if (now()->greaterThanOrEqualTo($event->start_date)) {
            throw new ValidationException('Cannot cancel enrollment after the event has started.');
        }

        $participation->update(['status' => 'cancelado']);
        return $participation;
    }

    public function markUsersAsAttended(int $eventId, array $userIds): array
    {
        $event = $this->eventRepository->findById($eventId);
        if (!$event) {
            throw new ResourceNotFoundException('Event not found.');
        }

        $results = [];
        DB::transaction(function () use ($eventId, $userIds, &$results) {
            foreach ($userIds as $userId) {
                $p = $this->participationRepository->findByUserAndEvent($userId, $eventId);
                if (!$p) {
                    $results[$userId] = 'User not enrolled.';
                    continue;
                }
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

    public function markUsersAsAbsent(int $eventId, array $userIds): array
    {
        $event = $this->eventRepository->findById($eventId);
        if (!$event) {
            throw new ResourceNotFoundException('Event not found.');
        }

        $results = [];
        DB::transaction(function () use ($eventId, $userIds, &$results) {
            foreach ($userIds as $userId) {
                $p = $this->participationRepository->findByUserAndEvent($userId, $eventId);
                if (!$p) {
                    $results[$userId] = 'User not enrolled.';
                    continue;
                }
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

    public function getEventById(int $id) : Event
    {
        $event = $this->eventRepository->findById($id);
        if (!$event) {
            throw new ResourceNotFoundException("The event with ID {$id} was not found.");
        }
        return $event;
    }

    public function listParticipationsByEvent(int $eventId): Collection
    {
        return $this->participationRepository->findByEventId($eventId);
    }

    public function listParticipationsByUser(int $userId): Collection
    {
        return $this->participationRepository->findByUserId($userId);
    }

    public function listAllParticipations(?string $status = null): Collection
    {
        return $this->participationRepository->findAll($status);
    }
}
