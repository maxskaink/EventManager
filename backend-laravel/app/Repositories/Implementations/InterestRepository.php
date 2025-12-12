<?php

namespace App\Repositories\Implementations;

use App\Models\Interest;
use App\Repositories\Contracts\InterestRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class InterestRepository implements InterestRepositoryInterface
{
    /**
     * {@inheritDoc}
     */
    public function create(array $data): Interest
    {
        return Interest::query()->create($data);
    }

    /**
     * {@inheritDoc}
     */
    public function findByKeyword(string $keyword): ?Interest
    {
        // Case-insensitive search for an interest by keyword.
        return Interest::query()
            ->whereRaw('LOWER(keyword) = ?', [strtolower($keyword)])
            ->first();
    }

    /**
     * {@inheritDoc}
     */
    public function findAll(): Collection
    {
        return Interest::query()
            ->orderBy('keyword')
            ->get();
    }

    /**
     * {@inheritDoc}
     */
    public function findById(int $id): ?Interest
    {
        return Interest::query()->find($id);
    }

    /**
     * {@inheritDoc}
     */
    public function delete(int $id): void
    {
        $interest = Interest::query()->find($id);

        // Use optional chaining to delete if found.
        $interest?->delete();
    }
}
