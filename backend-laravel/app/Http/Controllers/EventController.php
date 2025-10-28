<?php

namespace App\Http\Controllers;



use App\Http\Requests\Event\AddEventRequest;
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
}
