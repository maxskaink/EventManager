<?php

use App\Http\Controllers\CertificateController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->prefix('certificate')->group(function () {
    Route::post('/', [CertificateController::class, 'addCertificate']);
    Route::patch('{certificateId}', [CertificateController::class, 'updateCertificate']);
    Route::delete('{certificateId}', [CertificateController::class, 'deleteCertificate']);
    Route::get('/my', [CertificateController::class, 'listMyCertificates']);
    Route::get('/user/{userId}', [CertificateController::class, 'listCertificatesByUser']);
    Route::get('/all', [CertificateController::class, 'listAllCertificates']);
    Route::get('/date-range', [CertificateController::class, 'listCertificatesByDateRange']);
});
