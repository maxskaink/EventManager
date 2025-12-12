<?php

namespace App\Services\Implementations;

use App\Exceptions\DuplicatedResourceException;
use App\Models\Certificate;
use App\Models\TrustedOrg;
use App\Models\User;
use App\Repositories\Contracts\CertificateRepositoryInterface;
use App\Services\Contracts\CertificateServiceInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use InvalidArgumentException;
use Throwable;

class CertificateService implements CertificateServiceInterface
{
    private CertificateRepositoryInterface $certificateRepository;

    public function __construct(CertificateRepositoryInterface $certificateRepository)
    {
        $this->certificateRepository = $certificateRepository;
    }

    /**
     * {@inheritDoc}
     *
     * @throws ModelNotFoundException
     * @throws DuplicatedResourceException
     * @throws InvalidArgumentException
     */
    /**
     * {@inheritDoc}
     *
     * @throws ModelNotFoundException
     * @throws DuplicatedResourceException
     * @throws InvalidArgumentException
     */
    public function addCertificate(array $data): Certificate
    {
        // Ensure the user exists
        $user = User::query()->find($data['user_id']);
        if (!$user) {
            throw new ModelNotFoundException('The specified user does not exist.');
        }

        // Check for duplicate certificate name for the same user
        $existing = $this->certificateRepository
            ->findByUserId($data['user_id'])
            ->firstWhere('name', $data['name']);

        if ($existing) {
            throw new DuplicatedResourceException(
                "A certificate named '{$data['name']}' already exists for this user."
            );
        }

        // Validate required fields
        if (empty($data['issuing_organization'])) {
            throw new InvalidArgumentException('The issuing organization field is required.');
        }

        // Validate credential URL if provided
        if (!empty($data['credential_url'])) {
            $this->validateCertificateUrl($data['credential_url']);
        }

        // Validate date logic
        if (!empty($data['expiration_date']) && !empty($data['issue_date'])) {
            $issue = Carbon::parse($data['issue_date']);
            $expire = Carbon::parse($data['expiration_date']);
            if ($expire->isBefore($issue)) {
                throw new InvalidArgumentException('The expiration date cannot be earlier than the issue date.');
            }
        }

        return $this->certificateRepository->create($data);
    }

    /**
     * {@inheritDoc}
     *
     * @throws ModelNotFoundException
     * @throws DuplicatedResourceException
     * @throws InvalidArgumentException
     */
    public function updateCertificate(int $certificateId, array $data): Certificate
    {
        $certificate = $this->certificateRepository->findById($certificateId);
        if (!$certificate) {
            throw new ModelNotFoundException('The specified certificate does not exist.');
        }

        // If user_id is being updated, verify the new user exists
        if (isset($data['user_id'])) {
            $newUser = User::query()->find($data['user_id']);
            if (!$newUser) {
                throw new ModelNotFoundException('The specified user does not exist.');
            }
        }

        // Check for duplicates if name is being updated
        if (isset($data['name'])) {
            $duplicate = $this->certificateRepository
                ->findByUserId($data['user_id'] ?? $certificate->user_id)
                ->firstWhere('name', $data['name']);

            if ($duplicate && $duplicate->id !== $certificateId) {
                throw new DuplicatedResourceException(
                    "A certificate named '{$data['name']}' already exists for this user."
                );
            }
        }

        // Validate URL if updated
        if (!empty($data['credential_url'])) {
            $this->validateCertificateUrl($data['credential_url']);
        }

        // Validate dates if updated
        if (!empty($data['expiration_date']) && !empty($data['issue_date'] ?? $certificate->issue_date)) {
            $issue = Carbon::parse($data['issue_date'] ?? $certificate->issue_date);
            $expire = Carbon::parse($data['expiration_date']);
            if ($expire->isBefore($issue)) {
                throw new InvalidArgumentException('The expiration date cannot be earlier than the issue date.');
            }
        }

        return $this->certificateRepository->update($certificateId, $data);
    }

    /**
     * Validate the certificate URL.
     *
     * @param string $url
     * @throws InvalidArgumentException
     */
    private function validateCertificateUrl(string $url): void
    {
        $domain = parse_url($url, PHP_URL_HOST);
        if (!$domain) {
            throw new InvalidArgumentException('The provided credential URL is invalid.');
        }

        // Check if the domain matches a trusted organization from database
        $trustedOrgs = TrustedOrg::trustedForCertificate()->pluck('org');
        $isTrusted = $trustedOrgs->contains(fn($trusted) => Str::endsWith($domain, $trusted));

        if (!$isTrusted) {
            throw new InvalidArgumentException(
                "The certificate domain '{$domain}' is not from a trusted organization."
            );
        }

        // Verify URL accessibility
        try {
            $response = Http::timeout(5)->head($url);
            if ($response->failed()) {
                throw new InvalidArgumentException("The credential URL '{$url}' could not be reached or returned an error.");
            }
        } catch (Throwable) {
            throw new InvalidArgumentException("The credential URL '{$url}' is not accessible.");
        }
    }

    /**
     * {@inheritDoc}
     */
    public function getCertificatesByUser(int $userId): Collection
    {
        return $this->certificateRepository->findByUserId($userId);
    }

    /**
     * {@inheritDoc}
     */
    public function getAllCertificates(): Collection
    {
        return $this->certificateRepository->findAll();
    }

    /**
     * {@inheritDoc}
     *
     * @throws InvalidArgumentException
     */
    public function getCertificatesByDateRange(string $startDate, string $endDate): Collection
    {
        $start = Carbon::parse($startDate);
        $end = Carbon::parse($endDate);

        if ($end->isBefore($start)) {
            throw new InvalidArgumentException('The end date cannot be earlier than the start date.');
        }

        return $this->certificateRepository->findByDateRange($startDate, $endDate);
    }

    /**
     * {@inheritDoc}
     */
    public function deleteCertificate(int $certificateId): void
    {
        $this->certificateRepository->softDelete($certificateId);
    }

    /**
     * {@inheritDoc}
     */
    public function getAllTrustedOrganizations(): array
    {
        return TrustedOrg::trustedForCertificate()->pluck('org')->toArray();
    }
}
