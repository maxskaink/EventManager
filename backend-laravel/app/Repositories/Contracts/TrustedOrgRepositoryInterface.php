<?php

namespace App\Repositories\Contracts;

use App\Models\TrustedOrg;
use Illuminate\Database\Eloquent\Collection;

interface TrustedOrgRepositoryInterface
{
    /**
     * Create a new trusted organization.
     *
     * @param array $data
     * @return TrustedOrg
     */
    public function create(array $data): TrustedOrg;

    /**
     * Find a trusted organization by its organization name/domain.
     *
     * @param string $org
     * @return TrustedOrg|null
     */
    public function findByOrg(string $org): ?TrustedOrg;

    /**
     * Retrieve all trusted organizations.
     *
     * @return Collection<int, TrustedOrg>
     */
    public function findAll(): Collection;

    /**
     * Find a trusted organization by its ID.
     *
     * @param int $id
     * @return TrustedOrg|null
     */
    public function findById(int $id): ?TrustedOrg;

    /**
     * Update a trusted organization.
     *
     * @param int $id
     * @param array $data
     * @return TrustedOrg
     */
    public function update(int $id, array $data): TrustedOrg;

    /**
     * Delete a trusted organization by its ID.
     *
     * @param int $id
     * @return void
     */
    public function delete(int $id): void;

    /**
     * Retrieve trusted organizations by type.
     *
     * @param string $type The type: 'certificate', 'external_event', or 'article'
     * @return Collection<int, TrustedOrg>
     */
    public function findByType(string $type): Collection;
}
