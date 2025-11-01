<?php

namespace App\Http\Controllers;

use App\Http\Requests\ExternalEvent\AddExternalEventRequest;
use App\Http\Requests\ExternalEvent\UpdateExternalEventRequest;
use App\Http\Requests\ExternalEvent\ListExternalEventsByDateRangeRequest;
use App\Services\ExternalEventService;
use Illuminate\Http\JsonResponse;

class ExternalEventController extends Controller
{
    protected ExternalEventService $externalEventService;

    public function __construct(ExternalEventService $externalEventService)
    {
        $this->externalEventService = $externalEventService;
    }

    /**
     * Create a new external event.
     */
    public function addExternalEvent(AddExternalEventRequest $request): JsonResponse
    {
        $data = $request->validated();

        $newEvent = $this->externalEventService->addExternalEvent($data);

        return response()->json([
            'message' => "External event created successfully: {$newEvent}"
        ]);
    }

    /**
     * Update an existing external event.
     */
    public function updateExternalEvent(UpdateExternalEventRequest $request, int $eventId): JsonResponse
    {
        $data = $request->validated();

        $updatedEvent = $this->externalEventService->updateExternalEvent($eventId, $data);

        return response()->json([
            'message' => 'External event updated successfully.',
            'external_event' => $updatedEvent,
        ]);
    }

    /**
     * Delete an existing external event.
     */
    public function deleteExternalEvent(int $eventId): JsonResponse
    {
        $this->externalEventService->deleteExternalEvent($eventId);

        return response()->json([
            'message' => 'External event deleted successfully.',
        ]);
    }

    /**
     * List all external events of the authenticated user.
     */
    public function listMyExternalEvents(): JsonResponse
    {
        $events = $this->externalEventService->getExternalEventsOfActiveUser();

        return response()->json([
            'external_events' => $events,
        ]);
    }

    /**
     * List all external events of a specific user.
     */
    public function listExternalEventsByUser(int $userId): JsonResponse
    {
        $events = $this->externalEventService->getExternalEventsByUser($userId);

        return response()->json([
            'external_events' => $events,
        ]);
    }

    /**
     * List all external events in the system (mentor/admin only).
     */
    public function listAllExternalEvents(): JsonResponse
    {
        $events = $this->externalEventService->getAllExternalEvents();

        return response()->json([
            'external_events' => $events,
        ]);
    }

    /**
     * List external events within a specific date range (mentor/admin only).
     */
    public function listExternalEventsByDateRange(ListExternalEventsByDateRangeRequest $request): JsonResponse
    {
        $data = $request->validated();

        $events = $this->externalEventService->getExternalEventsByDateRange(
            $data['start_date'],
            $data['end_date']
        );

        return response()->json([
            'external_events' => $events,
        ]);
    }
}
