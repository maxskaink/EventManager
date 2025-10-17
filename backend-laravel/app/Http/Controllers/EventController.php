<?php

namespace App\Http\Controllers;



use App\Http\Requests\AddEventRequest;
use App\Models\User;
use App\Services\EventService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

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

}
