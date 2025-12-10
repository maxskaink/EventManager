<?php

namespace App\Services\Contracts;

use App\Models\TrustedOrg;
use Illuminate\Database\Eloquent\Collection;

interface TrustedOrgServiceInterface
{
    /**
     * Create and store a new trusted organization.
     *
     * @param array $data
     * @return TrustedOrg
     */
    public function addTrustedOrg(array $data): TrustedOrg;

    /**
     * Get all trusted organizations in the system.
     *
     * @return Collection<int, TrustedOrg>
     */
    public function getAllTrustedOrgs(): Collection;

    /**
     * Update an existing trusted organization.
     *
     * @param int $trustedOrgId
     * @param array $data
     * @return TrustedOrg
     */
    public function updateTrustedOrg(int $trustedOrgId, array $data): TrustedOrg;

    /**
     * Delete an existing trusted organization.
     *
     * @param int $trustedOrgId
     * @return void
     */
    public function deleteTrustedOrg(int $trustedOrgId): void;

    /**
     * Get trusted organizations filtered by type.
     *
     * @param string $type The type: 'certificate', 'external_event', or 'article'
     * @return Collection<int, TrustedOrg>
     */
    public function getTrustedOrgsByType(string $type): Collection;
}
