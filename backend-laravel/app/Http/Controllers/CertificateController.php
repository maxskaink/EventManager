<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\AddCertificateRequest;
use App\Http\Requests\AddEventRequest;
use App\Services\CertificateService;
use App\Services\EventService;
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
}
