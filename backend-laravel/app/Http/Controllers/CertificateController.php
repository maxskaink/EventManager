<?php

namespace App\Http\Controllers;

use App\Http\Requests\Certificate\AddCertificateRequest;
use App\Http\Requests\Certificate\ListCertificatesByDateRangeRequest;
use App\Http\Requests\Certificate\UpdateCertificateRequest;
use App\Services\CertificateService;
use Illuminate\Http\JsonResponse;

class CertificateController extends Controller
{
    protected CertificateService $certificateService;

    public function __construct(CertificateService $certificateService)
    {
        $this->certificateService = $certificateService;
    }
    public function addCertificate(AddCertificateRequest $request): JsonResponse
    {
        $data = $request->validated();

        $newCertificate = $this->certificateService->addCertificate($data);

        return response()->json([
            'message' => "Certificate created successfully to {$newCertificate}"
        ]);
    }

    /**
     * Update an existing article.
     */
    public function updateCertificate(UpdateCertificateRequest $request, int $certificateId): JsonResponse
    {
        $data = $request->validated();

        $updatedCertificate = $this->certificateService->updateCertificate($certificateId, $data);

        return response()->json([
            'message' => 'Certificate updated successfully.',
            'article' => $updatedCertificate,
        ]);
    }

    /**
     * List all certificates of the authenticated user.
     */
    public function listMyCertificates(): JsonResponse
    {
        $certificates = $this->certificateService->getCertificatesOfActiveUser();

        return response()->json([
            'certificates' => $certificates,
        ]);
    }

    /**
     * List all certificates of a specific user.
     */
    public function listCertificatesByUser(int $userId): JsonResponse
    {
        $certificates = $this->certificateService->getCertificatesByUser($userId);

        return response()->json([
            'certificates' => $certificates,
        ]);
    }

    /**
     * List all certificates in the system (mentor only).
     */
    public function listAllCertificates(): JsonResponse
    {
        $certificates = $this->certificateService->getAllCertificates();

        return response()->json([
            'certificates' => $certificates,
        ]);
    }

    /**
     * List all certificates issued within a date range (mentor only).
     */
    public function listCertificatesByDateRange(ListCertificatesByDateRangeRequest $request): JsonResponse
    {
        $request->validate([
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date'],
        ]);

        $certificates = $this->certificateService->getCertificatesByDateRange(
            $request->input('start_date'),
            $request->input('end_date')
        );

        return response()->json([
            'certificates' => $certificates,
        ]);
    }
}
