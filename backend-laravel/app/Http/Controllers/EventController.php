<?php

namespace App\Http\Controllers;

use App\Http\Requests\Event\AddEventRequest;
use App\Http\Requests\Event\MarkUsersRequest;
use App\Http\Requests\Event\UpdateEventRequest;
use App\Models\Event;
use App\Services\Contracts\EventServiceInterface;
use Illuminate\Http\JsonResponse;

class EventController extends Controller
{
    protected EventServiceInterface $eventService;

    public function __construct(EventServiceInterface $eventService)
    {
        $this->eventService = $eventService;
    }

    /**
     * Create a new event (mentor or coordinator only).
     */
    public function addEvent(AddEventRequest $request): JsonResponse
    {
        $this->authorize('create', Event::class);

        $data = $request->validated();
        $newEvent = $this->eventService->addEvent($data);

        return response()->json([
            'message' => 'Event created successfully.',
            'event' => $newEvent,
        ]);
    }

    /**
     * List all events (any user).
     */
    public function listAllEvents(): JsonResponse
    {
        $this->authorize('viewAny', Event::class);

        $events = $this->eventService->listAllEvents();

        return response()->json([
            'events' => $events,
        ]);
    }

    /**
     * List all upcoming events (any user).
     */
    public function listUpcomingEvents(): JsonResponse
    {
        $this->authorize('viewUpcoming', Event::class);

        $events = $this->eventService->listUpcomingEvents();

        return response()->json([
            'events' => $events,
        ]);
    }

    /**
     * List all past events (mentor or coordinator).
     */
    public function listPastEvents(): JsonResponse
    {
        $this->authorize('viewPast', Event::class);

        $events = $this->eventService->listPastEvents();

        return response()->json([
            'events' => $events,
        ]);
    }

    /**
     * Update an event (mentor or coordinator only).
     */
    public function updateEvent(UpdateEventRequest $request, int $id): JsonResponse
    {
        $event = Event::query()->findOrFail($id);
        $this->authorize('update', $event);

        $data = $request->validated();
        $updatedEvent = $this->eventService->updateEvent($id, $data);

        return response()->json([
            'message' => 'Event updated successfully.',
            'event' => $updatedEvent,
        ]);
    }

    /**
     * Enroll a user in an event (self-enrollment only).
     */
    public function enrollUser(int $eventId): JsonResponse
    {
        $this->authorize('enroll', [Event::class, $eventId]);

        $userId = request()->user()->id;
        $participation = $this->eventService->enrollUserInEvent($eventId, $userId);

        return response()->json([
            'message' => 'User successfully enrolled in the event.',
            'participation' => $participation,
        ], 201);
    }

    /**
     * Cancel a user's enrollment in an event (self-only).
     */
    public function cancelEnrollment(int $eventId): JsonResponse
    {
        $this->authorize('cancelEnrollment', [Event::class, $eventId]);

        $userId = request()->user()->id;
        $participation = $this->eventService->cancelUserEnrollment($eventId, $userId);

        return response()->json([
            'message' => 'User enrollment canceled successfully.',
            'participation' => $participation,
        ]);
    }

    /**
     * Mark users as attended (mentor or coordinator only).
     */
    public function markUsersAsAttended(MarkUsersRequest $request, int $eventId): JsonResponse
    {
        $event = Event::query()->findOrFail($eventId);
        $this->authorize('markAttendance', $event);

        $userIds = $request->validated()['users'];
        $results = $this->eventService->markUsersAsAttended($eventId, $userIds);

        return response()->json([
            'message' => 'Users marked as attended successfully.',
            'results' => $results,
        ]);
    }

    /**
     * Mark users as absent (mentor or coordinator only).
     */
    public function markUsersAsAbsent(MarkUsersRequest $request, int $eventId): JsonResponse
    {
        $event = Event::query()->findOrFail($eventId);
        $this->authorize('markAttendance', $event);

        $userIds = $request->validated()['users'];
        $results = $this->eventService->markUsersAsAbsent($eventId, $userIds);

        return response()->json([
            'message' => 'Users marked as absent successfully.',
            'results' => $results,
        ]);
    }
}
