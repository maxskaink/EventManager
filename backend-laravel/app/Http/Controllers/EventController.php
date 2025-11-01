<?php

namespace App\Http\Controllers;



use App\Http\Requests\Event\AddEventRequest;
use App\Http\Requests\Event\MarkUsersRequest;
use App\Http\Requests\Event\UpdateEventRequest;
use App\Services\EventService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;

class EventController extends Controller
{
    protected EventService $eventService;

    public function __construct(EventService $eventService)
    {
        $this->eventService = $eventService;
    }

    public function addEvent(AddEventRequest $request): JsonResponse
    {
        $data = $request->validated();

        $newEvent = $this->eventService->addEvent($data);

        return response()->json([
            'message' => "Event created successfully to {$newEvent}"
        ]);
    }

    /**
     * @throws AuthorizationException
     */
    public function listAllEvents(): JsonResponse
    {
        return response()->json($this->eventService->listAllEvents());
    }

    /**
     * @throws AuthorizationException
     */
    public function listUpcomingEvents(): JsonResponse
    {
        return response()->json($this->eventService->listUpcomingEvents());
    }

    /**
     * @throws AuthorizationException
     */
    public function listPastEvents(): JsonResponse
    {
        return response()->json($this->eventService->listPastEvents());
    }

    /**
     * Update an event by ID.
     */
    public function updateEvent(UpdateEventRequest $request, int $id): JsonResponse
    {
        $data = $request->validated();


        $updatedEvent = $this->eventService->updateEvent($id, $data);

        return response()->json([
            'message' => 'Event updated successfully.',
            'event' => $updatedEvent,
        ]);
    }

    /**
     * Enroll a user in an event.
     */
    public function enrollUser(int $eventId): JsonResponse
    {
        $userId = auth()->id();

        $participation = $this->eventService->enrollUserInEvent($eventId, $userId);

        return response()->json([
            'message' => 'User successfully enrolled in the event.',
            'participation' => $participation
        ], 201);
    }

    /**
     * Cancel a user's enrollment in an event.
     */
    public function cancelEnrollment(int $eventId): JsonResponse
    {
        $userId = auth()->id();

        $participation = $this->eventService->cancelUserEnrollment($eventId, $userId);

        return response()->json([
            'message' => 'User enrollment canceled successfully.',
            'participation' => $participation
        ]);
    }

    /**
     * Mark multiple users as attended in an event.
     */
    public function markUsersAsAttended(MarkUsersRequest $request, int $eventId): JsonResponse
    {
        $userIds = $request->validated()['users'];

        $results = $this->eventService->markUsersAsAttended($eventId, $userIds);

        return response()->json([
            'message' => 'Users marked as attended successfully.',
            'results' => $results,
        ]);
    }

    /**
     * Mark multiple users as absent from an event.
     */
    public function markUsersAsAbsent(MarkUsersRequest $request, int $eventId): JsonResponse
    {
        $userIds = $request->validated()['users'];

        $results = $this->eventService->markUsersAsAbsent($eventId, $userIds);

        return response()->json([
            'message' => 'Users marked as absent successfully.',
            'results' => $results
        ]);
    }



}
