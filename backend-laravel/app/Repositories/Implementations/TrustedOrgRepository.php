<?php

namespace App\Repositories\Implementations;

use App\Models\TrustedOrg;
use App\Repositories\Contracts\TrustedOrgRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class TrustedOrgRepository implements TrustedOrgRepositoryInterface
{
    /**
     * {@inheritDoc}
     */
    public function create(array $data): TrustedOrg
    {
        return TrustedOrg::query()->create($data);
    }

    /**
     * {@inheritDoc}
     */
    public function findByOrg(string $org): ?TrustedOrg
    {
        // Case-insensitive search for a trusted organization by org name.
        return TrustedOrg::query()
            ->whereRaw('LOWER(org) = ?', [strtolower($org)])
            ->first();
    }

    /**
     * {@inheritDoc}
     */
    public function findAll(): Collection
    {
        return TrustedOrg::query()
            ->orderBy('org')
            ->get();
    }

    /**
     * {@inheritDoc}
     */
    public function findById(int $id): ?TrustedOrg
    {
        return TrustedOrg::query()->find($id);
    }

    /**
     * {@inheritDoc}
     */
    public function update(int $id, array $data): TrustedOrg
    {
        $trustedOrg = TrustedOrg::query()->findOrFail($id);
        $trustedOrg->update($data);
        return $trustedOrg->fresh();
    }

    /**
     * {@inheritDoc}
     */
    public function delete(int $id): void
    {
        $trustedOrg = TrustedOrg::query()->find($id);

        // Use optional chaining to delete if found.
        $trustedOrg?->delete();
    }

    /**
     * {@inheritDoc}
     */
    public function findByType(string $type): Collection
    {
        $column = match($type) {
            'certificate' => 'trusted_for_certificate',
            'event' => 'trusted_for_event',
            'publication' => 'trusted_for_publication',
            default => throw new \InvalidArgumentException("Invalid type: {$type}")
        };

        return TrustedOrg::query()
            ->where($column, true)
            ->orderBy('org')
            ->get();
    }
}
