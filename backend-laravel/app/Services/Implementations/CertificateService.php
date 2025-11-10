<?php

namespace App\Services\Implementations;

use App\Exceptions\DuplicatedResourceException;
use App\Models\Certificate;
use App\Models\User;
use App\Services\Contracts\CertificateServiceInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use InvalidArgumentException;

class CertificateService implements CertificateServiceInterface
{
    /** @var array<string> */
    private array $trustedOrganizations;

    public function __construct()
    {
        // Load trusted organizations from config
        $this->trustedOrganizations = config('trusted_certificates.organizations', []);
    }

    /**
     * Create and store a new certificate for a user.
     *
     * @param array $data
     * @return Certificate
     *
     * @throws DuplicatedResourceException
     * @throws ModelNotFoundException
     * @throws InvalidArgumentException
     */
    public function addCertificate(array $data): Certificate
    {
        // Ensure the user exists
        $user = User::query()->find($data['user_id']);
        if (!$user) {
            throw new ModelNotFoundException('The specified user does not exist.');
        }

        // Check for duplicate certificate name
        $existingCertificate = Certificate::query()
            ->where('user_id', $data['user_id'])
            ->where('name', $data['name'])
            ->where('deleted', false)
            ->first();

        if ($existingCertificate) {
            throw new DuplicatedResourceException(
                "A certificate named '{$data['name']}' already exists for this user."
            );
        }

        // ✅ Validate organization presence
        if (empty($data['issuing_organization'])) {
            throw new InvalidArgumentException('The issuing organization field is required.');
        }

        // ✅ Validate credential URL if provided
        if (!empty($data['credential_url'])) {
            $this->validateCertificateUrl($data['credential_url']);
        }

        // ✅ Validate date logic
        if (!empty($data['expiration_date']) && !empty($data['issue_date'])) {
            $issue = Carbon::parse($data['issue_date']);
            $expire = Carbon::parse($data['expiration_date']);

            if ($expire->isBefore($issue)) {
                throw new InvalidArgumentException('The expiration date cannot be earlier than the issue date.');
            }
        }

        // Create and save certificate
        $certificate = new Certificate();
        $certificate->fill($data);
        $certificate->save();

        return $certificate;
    }

    /**
     * Update an existing certificate.
     *
     * @param int $certificateId
     * @param array $data
     * @return Certificate
     *
     * @throws ModelNotFoundException
     * @throws DuplicatedResourceException
     * @throws InvalidArgumentException
     */
    public function updateCertificate(int $certificateId, array $data): Certificate
    {
        $certificate = Certificate::query()->find($certificateId);
        if (!$certificate) {
            throw new ModelNotFoundException('The specified certificate does not exist.');
        }

        // Verify user existence if changed
        if (isset($data['user_id'])) {
            $newUser = User::query()->find($data['user_id']);
            if (!$newUser) {
                throw new ModelNotFoundException('The specified user does not exist.');
            }
        }

        // Prevent duplicate names
        if (isset($data['name'])) {
            $duplicate = Certificate::query()
                ->where('user_id', $data['user_id'] ?? $certificate->user_id)
                ->where('name', $data['name'])
                ->where('id', '!=', $certificateId)
                ->where('deleted', false)
                ->first();

            if ($duplicate) {
                throw new DuplicatedResourceException(
                    "A certificate named '{$data['name']}' already exists for this user."
                );
            }
        }

        // Validate credential URL if changed
        if (isset($data['credential_url']) && !empty($data['credential_url'])) {
            $this->validateCertificateUrl($data['credential_url']);
        }

        // Validate expiration date logic
        if (!empty($data['expiration_date']) && !empty($data['issue_date'] ?? $certificate->issue_date)) {
            $issue = Carbon::parse($data['issue_date'] ?? $certificate->issue_date);
            $expire = Carbon::parse($data['expiration_date']);

            if ($expire->isBefore($issue)) {
                throw new InvalidArgumentException('The expiration date cannot be earlier than the issue date.');
            }
        }

        $certificate->fill($data);
        $certificate->save();

        return $certificate;
    }

    /**
     * Validate that the credential URL belongs to a trusted organization
     * and that the link is accessible.
     */
    private function validateCertificateUrl(string $url): void
    {
        $domain = parse_url($url, PHP_URL_HOST);
        if (!$domain) {
            throw new InvalidArgumentException('The provided credential URL is invalid.');
        }

        // Check if the domain matches a trusted organization
        $isTrusted = collect($this->trustedOrganizations)
            ->contains(fn($trusted) => Str::endsWith($domain, $trusted));

        if (!$isTrusted) {
            throw new InvalidArgumentException(
                "The certificate domain '{$domain}' is not from a trusted organization."
            );
        }

        // Verify the URL is reachable
        try {
            $response = Http::timeout(5)->head($url);
            if ($response->failed()) {
                throw new InvalidArgumentException(
                    "The credential URL '{$url}' could not be reached or returned an error."
                );
            }
        } catch (\Throwable $e) {
            throw new InvalidArgumentException(
                "The credential URL '{$url}' is not accessible."
            );
        }
    }

    /**
     * Get all certificates of a specific user.
     */
    public function getCertificatesByUser(int $userId): Collection
    {
        return Certificate::query()
            ->where('user_id', $userId)
            ->where('deleted', false)
            ->orderByDesc('issue_date')
            ->get();
    }

    /**
     * Get all certificates in the system.
     */
    public function getAllCertificates(): Collection
    {
        return Certificate::query()
            ->where('deleted', false)
            ->orderByDesc('issue_date')
            ->get();
    }

    /**
     * Get all certificates issued within a specific date range.
     */
    public function getCertificatesByDateRange(string $startDate, string $endDate): Collection
    {
        $start = Carbon::parse($startDate);
        $end = Carbon::parse($endDate);

        if ($end->isBefore($start)) {
            throw new InvalidArgumentException('The end date cannot be earlier than the start date.');
        }

        return Certificate::query()
            ->whereBetween('issue_date', [$start, $end])
            ->where('deleted', false)
            ->orderBy('issue_date')
            ->get();
    }

    /**
     * Soft-delete a certificate.
     */
    public function deleteCertificate(int $certificateId): void
    {
        $certificate = Certificate::query()->find($certificateId);
        if (!$certificate) {
            throw new ModelNotFoundException('The specified certificate does not exist.');
        }

        $certificate->update(['deleted' => true]);
    }

    public function getAllTrustedOrganizations(): array
    {
        return $this->trustedOrganizations;
    }
}
