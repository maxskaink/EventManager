<?php

namespace App\Http\Controllers;

use App\Http\Requests\ExternalEvent\AddExternalEventRequest;
use App\Http\Requests\ExternalEvent\UpdateExternalEventRequest;
use App\Http\Requests\ExternalEvent\ListExternalEventsByDateRangeRequest;
use App\Models\ExternalEvent;
use App\Services\Contracts\ExternalEventServiceInterface;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ExternalEventController extends Controller
{
    protected ExternalEventServiceInterface $externalEventService;

    public function __construct(ExternalEventServiceInterface $externalEventService)
    {
        $this->externalEventService = $externalEventService;
    }

    /**
     * Create a new external event.
     *
     * @throws AuthorizationException
     */
    public function addExternalEvent(AddExternalEventRequest $request): JsonResponse
    {
        $this->authorize('create', ExternalEvent::class);

        $data = $request->validated();
        $newEvent = $this->externalEventService->addExternalEvent($data);

        return response()->json([
            'message' => "External event created successfully: {$newEvent}"
        ]);
    }

    /**
     * Update an existing external event.
     *
     * @throws AuthorizationException
     */
    public function updateExternalEvent(UpdateExternalEventRequest $request, int $eventId): JsonResponse
    {
        $event = ExternalEvent::query()->find($eventId);
        if (!$event) {
            throw new NotFoundHttpException('External event not found.');
        }

        $this->authorize('update', $event);

        $data = $request->validated();
        $updatedEvent = $this->externalEventService->updateExternalEvent($eventId, $data);

        return response()->json([
            'message' => 'External event updated successfully.',
            'external_event' => $updatedEvent,
        ]);
    }

    /**
     * Delete an existing external event.
     *
     * @throws AuthorizationException
     */
    public function deleteExternalEvent(int $eventId): JsonResponse
    {
        $event = ExternalEvent::query()->find($eventId);
        if (!$event) {
            throw new NotFoundHttpException('External event not found.');
        }

        $this->authorize('delete', $event);

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
     *
     * @throws AuthorizationException
     */
    public function listExternalEventsByUser(int $userId): JsonResponse
    {
        $this->authorize('viewByUser', [ExternalEvent::class, $userId]);

        $events = $this->externalEventService->getExternalEventsByUser($userId);

        return response()->json([
            'external_events' => $events,
        ]);
    }

    /**
     * List all external events in the system (mentor/admin only).
     *
     * @throws AuthorizationException
     */
    public function listAllExternalEvents(): JsonResponse
    {
        $this->authorize('viewAny', ExternalEvent::class);

        $events = $this->externalEventService->getAllExternalEvents();

        return response()->json([
            'external_events' => $events,
        ]);
    }

    /**
     * List external events within a specific date range (mentor/admin only).
     *
     * @throws AuthorizationException
     */
    public function listExternalEventsByDateRange(ListExternalEventsByDateRangeRequest $request): JsonResponse
    {
        $this->authorize('filterByDateRange', ExternalEvent::class);

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
