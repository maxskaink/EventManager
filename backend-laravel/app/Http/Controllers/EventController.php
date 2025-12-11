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

    /**
     * Create a new instance of EventController.
     *
     * @param EventServiceInterface $eventService The service to handle event logic.
     */
    public function __construct(EventServiceInterface $eventService)
    {
        $this->eventService = $eventService;
    }

    /**
     * Create a new event (mentor or coordinator only).
     *
     * @param AddEventRequest $request The request containing event data.
     * @return JsonResponse The created event and a success message.
     * @throws \Illuminate\Auth\Access\AuthorizationException If the user is not authorized.
     */
    public function addEvent(AddEventRequest $request): JsonResponse
    {
        // Authorization: only mentors or coordinators can create events
        $this->authorize('create', Event::class);

        $data = $request->validated();
        $newEvent = $this->eventService->addEvent($data);

        return response()->json([
            'message' => 'Event created successfully.',
            'event' => $newEvent,
        ], 201);
    }

    /**
     * List all events (any user).
     *
     * @return JsonResponse A list of all events.
     * @throws \Illuminate\Auth\Access\AuthorizationException If the user is not authorized.
     */
    public function listAllEvents(): JsonResponse
    {
        // Authorization: any authenticated user can view events
        $this->authorize('viewAny', Event::class);

        $events = $this->eventService->listAllEvents();

        return response()->json([
            'events' => $events,
        ]);
    }

    /**
     * List all upcoming events (any user).
     *
     * @return JsonResponse A list of upcoming events.
     */
    public function listUpcomingEvents(): JsonResponse
    {
        $events = $this->eventService->listUpcomingEvents();

        return response()->json([
            'events' => $events,
        ]);
    }

    /**
     * List all past events (mentor or coordinator).
     *
     * @return JsonResponse A list of past events.
     * @throws \Illuminate\Auth\Access\AuthorizationException If the user is not authorized.
     */
    public function listPastEvents(): JsonResponse
    {
        // Authorization: only mentors or coordinators can view past events
        $this->authorize('viewPast', Event::class);

        $events = $this->eventService->listPastEvents();

        return response()->json([
            'events' => $events,
        ]);
    }

    /**
     * Update an event (mentor or coordinator only).
     *
     * @param UpdateEventRequest $request The request containing updated event data.
     * @param int $id The ID of the event to update.
     * @return JsonResponse The updated event and a success message.
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException If the event is not found.
     * @throws \Illuminate\Auth\Access\AuthorizationException If the user is not authorized.
     */
    public function updateEvent(UpdateEventRequest $request, int $id): JsonResponse
    {
        $event = Event::query()->findOrFail($id);

        // Authorization: check if the user can update this event
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
     *
     * @param int $eventId The ID of the event to enroll in.
     * @return JsonResponse The participation record and a success message.
     */
    public function enrollUser(int $eventId): JsonResponse
    {
        $userId = request()->user()->id;
        $participation = $this->eventService->enrollUserInEvent($eventId, $userId);

        return response()->json([
            'message' => 'User successfully enrolled in the event.',
            'participation' => $participation,
        ], 201);
    }

    /**
     * Cancel a user's enrollment in an event (self-only).
     *
     * @param int $eventId The ID of the event to cancel enrollment from.
     * @return JsonResponse The updated participation record and a success message.
     */
    public function cancelEnrollment(int $eventId): JsonResponse
    {
        $userId = request()->user()->id;
        $participation = $this->eventService->cancelUserEnrollment($eventId, $userId);

        return response()->json([
            'message' => 'User enrollment canceled successfully.',
            'participation' => $participation,
        ]);
    }

    /**
     * Mark users as attended (mentor or coordinator only).
     *
     * @param MarkUsersRequest $request The request containing user IDs.
     * @param int $eventId The ID of the event.
     * @return JsonResponse The results of marking attendance.
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException If the event is not found.
     * @throws \Illuminate\Auth\Access\AuthorizationException If the user is not authorized.
     */
    public function markUsersAsAttended(MarkUsersRequest $request, int $eventId): JsonResponse
    {
        $event = Event::query()->findOrFail($eventId);

        // Authorization: check if the user can mark attendance for this event
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
     *
     * @param MarkUsersRequest $request The request containing user IDs.
     * @param int $eventId The ID of the event.
     * @return JsonResponse The results of marking absence.
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException If the event is not found.
     * @throws \Illuminate\Auth\Access\AuthorizationException If the user is not authorized.
     */
    public function markUsersAsAbsent(MarkUsersRequest $request, int $eventId): JsonResponse
    {
        $event = Event::query()->findOrFail($eventId);

        // Authorization: check if the user can mark attendance for this event
        $this->authorize('markAttendance', $event);

        $userIds = $request->validated()['users'];
        $results = $this->eventService->markUsersAsAbsent($eventId, $userIds);

        return response()->json([
            'message' => 'Users marked as absent successfully.',
            'results' => $results,
        ]);
    }

    /**
     * Get a specific event by ID.
     *
     * @param int $id The ID of the event.
     * @return JsonResponse The event data.
     */
    public function getEventById(int $id): JsonResponse
    {
        $event = $this->eventService->getEventById($id);

        return response()->json([
            'event' => $event,
        ]);
    }

    /**
     * List all participations in the system (mentor or coordinator only).
     *
     * @return JsonResponse A list of all participations.
     * @throws \Illuminate\Auth\Access\AuthorizationException If the user is not authorized.
     */
    public function listAllParticipations(): JsonResponse
    {
        // Authorization: only mentors or coordinators can list all participations
        $this->authorize('listAllParticipations', Event::class);

        $status = request()->query('status'); // optional filter
        $participations = $this->eventService->listAllParticipations($status);

        return response()->json([
            'participations' => $participations,
        ]);
    }

    /**
     * List all participations for a specific event.
     * All roles except 'interested' can access this.
     *
     * @param int $eventId The ID of the event.
     * @return JsonResponse A list of participations for the event.
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException If the event is not found.
     * @throws \Illuminate\Auth\Access\AuthorizationException If the user is not authorized.
     */
    public function listParticipationsByEvent(int $eventId): JsonResponse
    {
        $event = Event::query()->findOrFail($eventId);

        // Authorization: check if the user can list participations for this event
        $this->authorize('listParticipationsByEvent', $event);

        $participations = $this->eventService->listParticipationsByEvent($eventId);

        return response()->json([
            'event_id' => $eventId,
            'participations' => $participations,
        ]);
    }

    /**
     * List all participations for a specific user.
     * All roles except 'interested' can access this.
     *
     * @param int $userId The ID of the user.
     * @return JsonResponse A list of the user's participations.
     * @throws \Illuminate\Auth\Access\AuthorizationException If the user is not authorized.
     */
    public function listParticipationsByUser(int $userId): JsonResponse
    {
        // Authorization: check if the user can view participations (all roles except interested)
        $this->authorize('listParticipationsByUser', [Event::class, $userId]);

        $participations = $this->eventService->listParticipationsByUser($userId);

        return response()->json([
            'user_id' => $userId,
            'participations' => $participations,
        ]);
    }

    /**
     * Soft delete an event (mentor or coordinator only).
     *
     * @param int $id The ID of the event to delete.
     * @return JsonResponse The deleted event and a success message.
     * @throws \Illuminate\Auth\Access\AuthorizationException If the user is not authorized.
     */
    public function deleteEvent(int $id): JsonResponse
    {
        $event = $this->eventService->getEventById($id);

        // Authorization: check if the user can delete this event
        $this->authorize('delete', $event);

        $deletedEvent = $this->eventService->deleteEvent($id);

        return response()->json([
            'message' => 'Event deleted successfully.',
            'event' => $deletedEvent,
        ]);
    }
}

