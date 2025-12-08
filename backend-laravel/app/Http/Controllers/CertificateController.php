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

    /**
     * Create a new instance of CertificateController.
     *
     * @param CertificateServiceInterface $certificateService The service to handle certificate logic.
     */
    public function __construct(CertificateServiceInterface $certificateService)
    {
        $this->certificateService = $certificateService;
    }

    /**
     * Add a new certificate for a user.
     *
     * @param AddCertificateRequest $request The request containing certificate data.
     * @return JsonResponse The created certificate and a success message.
     * @throws \Illuminate\Auth\Access\AuthorizationException If the user is not authorized.
     */
    public function addCertificate(AddCertificateRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Authorization: allow user to add their own certificate or mentors to add for others
        $this->authorize('create', [Certificate::class, $data['user_id']]);

        $newCertificate = $this->certificateService->addCertificate($data);

        return response()->json([
            'message' => 'Certificate created successfully.',
            'certificate' => $newCertificate,
        ], 201);
    }

    /**
     * Update an existing certificate.
     *
     * @param UpdateCertificateRequest $request The request containing updated certificate data.
     * @param int $certificateId The ID of the certificate to update.
     * @return JsonResponse The updated certificate and a success message.
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException If the certificate is not found.
     * @throws \Illuminate\Auth\Access\AuthorizationException If the user is not authorized.
     */
    public function updateCertificate(UpdateCertificateRequest $request, int $certificateId): JsonResponse
    {
        $data = $request->validated();

        $certificate = Certificate::query()->findOrFail($certificateId);

        // Authorization: check if the user can update this certificate
        $this->authorize('update', $certificate);

        $updatedCertificate = $this->certificateService->updateCertificate($certificateId, $data);

        return response()->json([
            'message' => 'Certificate updated successfully.',
            'certificate' => $updatedCertificate,
        ]);
    }

    /**
     * Delete an existing certificate.
     *
     * @param int $certificateId The ID of the certificate to delete.
     * @return JsonResponse A success message.
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException If the certificate is not found.
     * @throws \Illuminate\Auth\Access\AuthorizationException If the user is not authorized.
     */
    public function deleteCertificate(int $certificateId): JsonResponse
    {
        $certificate = Certificate::query()->findOrFail($certificateId);

        // Authorization: check if the user can delete this certificate
        $this->authorize('delete', $certificate);

        $this->certificateService->deleteCertificate($certificateId);

        return response()->json([
            'message' => 'Certificate deleted successfully.',
        ]);
    }

    /**
     * List all certificates of the authenticated user.
     *
     * @return JsonResponse A list of the user's certificates.
     * @throws \Illuminate\Auth\Access\AuthorizationException If the user is not authorized.
     */
    public function listMyCertificates(): JsonResponse
    {
        $userId = request()->user()->id;

        // Authorization: ensure the user can view their own certificates
        $this->authorize('viewByUser', [Certificate::class, $userId]);

        $certificates = $this->certificateService->getCertificatesByUser($userId);

        return response()->json([
            'certificates' => $certificates,
        ]);
    }

    /**
     * List all certificates of a specific user.
     *
     * @param int $userId The ID of the user whose certificates to list.
     * @return JsonResponse A list of the user's certificates.
     * @throws NotFoundHttpException If the user is not found.
     */
    public function listCertificatesByUser(int $userId): JsonResponse
    {
        $targetUser = User::query()->find($userId);

        if (!$targetUser) {
            throw new NotFoundHttpException('User not found.');
        }

        $certificates = $this->certificateService->getCertificatesByUser($userId);

        return response()->json([
            'certificates' => $certificates,
        ]);
    }

    /**
     * List all certificates in the system (mentors only).
     *
     * @return JsonResponse A list of all certificates.
     * @throws \Illuminate\Auth\Access\AuthorizationException If the user is not authorized.
     */
    public function listAllCertificates(): JsonResponse
    {
        // Authorization: only mentors can view all certificates
        $this->authorize('viewAny', Certificate::class);

        $certificates = $this->certificateService->getAllCertificates();

        return response()->json([
            'certificates' => $certificates,
        ]);
    }

    /**
     * List all certificates issued within a specific issue date range (mentors only).
     *
     * @param ListCertificatesByDateRangeRequest $request The request containing start and end dates.
     * @return JsonResponse A list of certificates within the date range.
     * @throws \Illuminate\Auth\Access\AuthorizationException If the user is not authorized.
     */
    public function listCertificatesByDateRange(ListCertificatesByDateRangeRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Authorization: Only mentors can filter by issue date range
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
     *
     * @return JsonResponse A list of trusted organizations.
     */
    public function getAllTrustedOrganizations(): JsonResponse
    {
        $trustedOrganizations = $this->certificateService->getAllTrustedOrganizations();

        return response()->json([
            'trusted_organizations' => $trustedOrganizations,
        ]);
    }
}
