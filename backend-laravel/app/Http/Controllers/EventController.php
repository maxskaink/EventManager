<?php

namespace App\Http\Controllers;



use App\Http\Requests\AddEventRequest;
use App\Models\User;
use App\Services\EventService;
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

        /** @var User|null $authUser */
        $authUser = Auth::user();

        $data = $request->validated();

        $newEvent = $this->eventService->addEvent($data);

        return response()->json([
            'message' => "Event created successfully to {$newEvent}"
        ]);
    }

}
