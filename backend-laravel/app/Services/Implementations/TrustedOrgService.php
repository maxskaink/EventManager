<?php

namespace App\Services\Implementations;

use App\Exceptions\DuplicatedResourceException;
use App\Models\TrustedOrg;
use App\Repositories\Contracts\TrustedOrgRepositoryInterface;
use App\Services\Contracts\TrustedOrgServiceInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class TrustedOrgService implements TrustedOrgServiceInterface
{
    public function __construct(
        private readonly TrustedOrgRepositoryInterface $trustedOrgRepository
    ) {
    }

    /**
     * {@inheritDoc}
     *
     * @throws DuplicatedResourceException
     */
    public function addTrustedOrg(array $data): TrustedOrg
    {
        // Check duplicate organization to ensure uniqueness
        $existing = $this->trustedOrgRepository->findByOrg($data['org']);

        if ($existing) {
            throw new DuplicatedResourceException(
                "The trusted organization '{$data['org']}' already exists."
            );
        }

        return $this->trustedOrgRepository->create($data);
    }

    /**
     * {@inheritDoc}
     */
    public function getAllTrustedOrgs(): Collection
    {
        return $this->trustedOrgRepository->findAll();
    }

    /**
     * {@inheritDoc}
     *
     * @throws ModelNotFoundException
     * @throws DuplicatedResourceException
     */
    public function updateTrustedOrg(int $trustedOrgId, array $data): TrustedOrg
    {
        $trustedOrg = $this->trustedOrgRepository->findById($trustedOrgId);

        if (!$trustedOrg) {
            throw new ModelNotFoundException('The specified trusted organization does not exist.');
        }

        // Check for duplicate org name if it's being updated
        if (isset($data['org']) && $data['org'] !== $trustedOrg->org) {
            $existing = $this->trustedOrgRepository->findByOrg($data['org']);

            if ($existing) {
                throw new DuplicatedResourceException(
                    "The trusted organization '{$data['org']}' already exists."
                );
            }
        }

        return $this->trustedOrgRepository->update($trustedOrgId, $data);
    }

    /**
     * {@inheritDoc}
     *
     * @throws ModelNotFoundException
     */
    public function deleteTrustedOrg(int $trustedOrgId): void
    {
        $trustedOrg = $this->trustedOrgRepository->findById($trustedOrgId);

        if (!$trustedOrg) {
            throw new ModelNotFoundException('The specified trusted organization does not exist.');
        }

        $this->trustedOrgRepository->delete($trustedOrgId);
    }

    /**
     * {@inheritDoc}
     */
    public function getTrustedOrgsByType(string $type): Collection
    {
        return $this->trustedOrgRepository->findByType($type);
    }
}
