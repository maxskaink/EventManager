<?php

namespace App\Http\Controllers;

use App\Http\Requests\TrustedOrg\AddTrustedOrgRequest;
use App\Http\Requests\TrustedOrg\UpdateTrustedOrgRequest;
use App\Models\TrustedOrg;
use App\Services\Contracts\TrustedOrgServiceInterface;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;

class TrustedOrgController extends Controller
{
    protected TrustedOrgServiceInterface $trustedOrgService;

    /**
     * Create a new instance of TrustedOrgController.
     *
     * @param TrustedOrgServiceInterface $trustedOrgService The service to handle trusted organization logic.
     */
    public function __construct(TrustedOrgServiceInterface $trustedOrgService)
    {
        $this->trustedOrgService = $trustedOrgService;
    }

    /**
     * Create a new trusted organization.
     *
     * @param AddTrustedOrgRequest $request The request containing trusted organization data.
     * @return JsonResponse The created trusted organization and a success message.
     * @throws AuthorizationException If the user is not authorized.
     */
    public function addTrustedOrg(AddTrustedOrgRequest $request): JsonResponse
    {
        // Authorization: check if the user can create trusted organizations
        $this->authorize('create', TrustedOrg::class);

        $data = $request->validated();
        $newTrustedOrg = $this->trustedOrgService->addTrustedOrg($data);

        return response()->json([
            'message' => "Trusted organization created successfully.",
            'trusted_org' => $newTrustedOrg,
        ], 201);
    }

    /**
     * List all trusted organizations.
     *
     * @return JsonResponse A list of all trusted organizations.
     * @throws AuthorizationException If the user is not authorized.
     */
    public function listAllTrustedOrgs(): JsonResponse
    {
        // Authorization: check if the user can view trusted organizations
        $this->authorize('viewAny', TrustedOrg::class);

        $trustedOrgs = $this->trustedOrgService->getAllTrustedOrgs();

        return response()->json([
            'trusted_orgs' => $trustedOrgs,
        ]);
    }

    /**
     * Update an existing trusted organization.
     *
     * @param int $trustedOrgId The ID of the trusted organization to update.
     * @param UpdateTrustedOrgRequest $request The request containing updated data.
     * @return JsonResponse The updated trusted organization and a success message.
     * @throws AuthorizationException If the user is not authorized.
     */
    public function updateTrustedOrg(int $trustedOrgId, UpdateTrustedOrgRequest $request): JsonResponse
    {
        // Authorization: check if the user can update trusted organizations
        $this->authorize('update', TrustedOrg::class);

        $data = $request->validated();
        $updatedTrustedOrg = $this->trustedOrgService->updateTrustedOrg($trustedOrgId, $data);

        return response()->json([
            'message' => 'Trusted organization updated successfully.',
            'trusted_org' => $updatedTrustedOrg,
        ]);
    }

    /**
     * Delete an existing trusted organization.
     *
     * @param int $trustedOrgId The ID of the trusted organization to delete.
     * @return JsonResponse A success message.
     * @throws AuthorizationException If the user is not authorized.
     */
    public function deleteTrustedOrg(int $trustedOrgId): JsonResponse
    {
        // Authorization: check if the user can delete trusted organizations
        $this->authorize('delete', TrustedOrg::class);

        $this->trustedOrgService->deleteTrustedOrg($trustedOrgId);

        return response()->json([
            'message' => 'Trusted organization deleted successfully.',
        ]);
    }

    /**
     * List trusted organizations filtered by type.
     *
     * @param string $type The type to filter by: 'certificate', 'event', or 'publication'
     * @return JsonResponse A list of trusted organizations of the specified type.
     * @throws AuthorizationException If the user is not authorized.
     */
    public function listTrustedOrgsByType(string $type): JsonResponse
    {
        // Authorization: check if the user can view trusted organizations
        $this->authorize('viewAny', TrustedOrg::class);

        // Validate type
        if (!in_array($type, ['certificate', 'event', 'publication'])) {
            return response()->json([
                'message' => 'Invalid type. Must be one of: certificate, event, publication.',
            ], 400);
        }

        $trustedOrgs = $this->trustedOrgService->getTrustedOrgsByType($type);

        return response()->json([
            'type' => $type,
            'trusted_orgs' => $trustedOrgs,
        ]);
    }
}
