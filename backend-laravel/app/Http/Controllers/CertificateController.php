<?php

namespace App\Http\Controllers;

use App\Http\Requests\Certificate\AddCertificateRequest;
use App\Http\Requests\Certificate\ListCertificatesByDateRangeRequest;
use App\Http\Requests\Certificate\UpdateCertificateRequest;
use App\Models\Certificate;
use App\Models\User;
use App\Services\Contracts\CertificateServiceInterface;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class CertificateController extends Controller
{
    protected CertificateServiceInterface $certificateService;

    public function __construct(CertificateServiceInterface $certificateService)
    {
        $this->certificateService = $certificateService;
    }

    /**
     * Add a new certificate for a user.
     */
    public function addCertificate(AddCertificateRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Allow user to add their own certificate or mentors to add for others
        $this->authorize('create', [Certificate::class, $data['user_id']]);

        $newCertificate = $this->certificateService->addCertificate($data);

        return response()->json([
            'message' => 'Certificate created successfully.',
            'certificate' => $newCertificate,
        ]);
    }

    /**
     * Update an existing certificate.
     */
    public function updateCertificate(UpdateCertificateRequest $request, int $certificateId): JsonResponse
    {
        $data = $request->validated();

        $certificate = Certificate::query()->findOrFail($certificateId);
        $this->authorize('update', $certificate);

        $updatedCertificate = $this->certificateService->updateCertificate($certificateId, $data);

        return response()->json([
            'message' => 'Certificate updated successfully.',
            'certificate' => $updatedCertificate,
        ]);
    }

    /**
     * Delete an existing certificate.
     */
    public function deleteCertificate(int $certificateId): JsonResponse
    {
        $certificate = Certificate::query()->findOrFail($certificateId);
        $this->authorize('delete', $certificate);

        $this->certificateService->deleteCertificate($certificateId);

        return response()->json([
            'message' => 'Certificate deleted successfully.',
        ]);
    }

    /**
     * List all certificates of the authenticated user.
     */
    public function listMyCertificates(): JsonResponse
    {
        $userId = request()->user()->id;
        $this->authorize('viewByUser', [Certificate::class, $userId]);

        $certificates = $this->certificateService->getCertificatesByUser($userId);

        return response()->json([
            'certificates' => $certificates,
        ]);
    }

    /**
     * List all certificates of a specific user.
     */
    public function listCertificatesByUser(int $userId): JsonResponse
    {
        $targetUser = User::query()->find($userId);

        if (!$targetUser) {
            throw new NotFoundHttpException('User not found.');
        }

        $this->authorize('viewByUser', [Certificate::class, $userId]);

        $certificates = $this->certificateService->getCertificatesByUser($userId);

        return response()->json([
            'certificates' => $certificates,
        ]);
    }

    /**
     * List all certificates in the system (mentors only).
     */
    public function listAllCertificates(): JsonResponse
    {
        $this->authorize('viewAny', Certificate::class);

        $certificates = $this->certificateService->getAllCertificates();

        return response()->json([
            'certificates' => $certificates,
        ]);
    }

    /**
     * List all certificates issued within a specific issue date range (mentors only).
     */
    public function listCertificatesByDateRange(ListCertificatesByDateRangeRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Only mentors can filter by issue date range
        $this->authorize('filterByDateRange', Certificate::class);

        $certificates = $this->certificateService->getCertificatesByDateRange(
            $data['issue_start_date'],
            $data['issue_end_date']
        );

        return response()->json([
            'certificates' => $certificates,
        ]);
    }


    /**
     * Get all trusted organizations (public endpoint).
     */
    public function getAllTrustedOrganizations(): JsonResponse
    {
        $trustedOrganizations = $this->certificateService->getAllTrustedOrganizations();

        return response()->json([
            'trusted_organizations' => $trustedOrganizations,
        ]);
    }
}
