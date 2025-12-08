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

    /**
     * Create a new instance of ExternalEventController.
     *
     * @param ExternalEventServiceInterface $externalEventService The service to handle external event logic.
     */
    public function __construct(ExternalEventServiceInterface $externalEventService)
    {
        $this->externalEventService = $externalEventService;
    }

    /**
     * Create a new external event.
     *
     * @param AddExternalEventRequest $request The request containing external event data.
     * @return JsonResponse The created external event and a success message.
     * @throws AuthorizationException If the user is not authorized.
     */
    public function addExternalEvent(AddExternalEventRequest $request): JsonResponse
    {
        // Authorization: check if the user can create external events
        $this->authorize('create', ExternalEvent::class);

        $data = $request->validated();
        $newEvent = $this->externalEventService->addExternalEvent($data);

        return response()->json([
            'message' => 'External event created successfully.',
            'external_event' => $newEvent,
        ], 201);
    }

    /**
     * Update an existing external event.
     *
     * @param UpdateExternalEventRequest $request The request containing updated external event data.
     * @param int $eventId The ID of the external event to update.
     * @return JsonResponse The updated external event and a success message.
     * @throws NotFoundHttpException If the external event is not found.
     * @throws AuthorizationException If the user is not authorized.
     */
    public function updateExternalEvent(UpdateExternalEventRequest $request, int $eventId): JsonResponse
    {
        $event = ExternalEvent::query()->find($eventId);
        if (!$event) {
            throw new NotFoundHttpException('External event not found.');
        }

        // Authorization: check if the user can update this external event
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
     * @param int $eventId The ID of the external event to delete.
     * @return JsonResponse A success message.
     * @throws NotFoundHttpException If the external event is not found.
     * @throws AuthorizationException If the user is not authorized.
     */
    public function deleteExternalEvent(int $eventId): JsonResponse
    {
        $event = ExternalEvent::query()->find($eventId);
        if (!$event) {
            throw new NotFoundHttpException('External event not found.');
        }

        // Authorization: check if the user can delete this external event
        $this->authorize('delete', $event);

        $this->externalEventService->deleteExternalEvent($eventId);

        return response()->json([
            'message' => 'External event deleted successfully.',
        ]);
    }

    /**
     * List all external events of the authenticated user.
     *
     * @return JsonResponse A list of the user's external events.
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
     * @param int $userId The ID of the user whose external events to list.
     * @return JsonResponse A list of the user's external events.
     * @throws AuthorizationException If the user is not authorized.
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
     *
     * @return JsonResponse A list of all external events.
     * @throws AuthorizationException If the user is not authorized.
     */
    public function listAllExternalEvents(): JsonResponse
    {
        // Authorization: only mentors or admins can view all external events
        $this->authorize('viewAny', ExternalEvent::class);

        $events = $this->externalEventService->getAllExternalEvents();

        return response()->json([
            'external_events' => $events,
        ]);
    }

    /**
     * List external events within a specific date range (mentor/admin only).
     *
     * @param ListExternalEventsByDateRangeRequest $request The request containing start and end dates.
     * @return JsonResponse A list of external events within the date range.
     * @throws AuthorizationException If the user is not authorized.
     */
    public function listExternalEventsByDateRange(ListExternalEventsByDateRangeRequest $request): JsonResponse
    {
        // Authorization: only mentors or admins can filter external events by date
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


    /**
     * Get all trusted organizations (public endpoint).
     *
     * @return JsonResponse A list of trusted organizations.
     */
    public function getAllTrustedOrganizations(): JsonResponse
    {
        $trustedOrganizations = $this->externalEventService->getAllTrustedOrganizations();

        return response()->json([
            'trusted_organizations' => $trustedOrganizations,
        ]);
    }
}
