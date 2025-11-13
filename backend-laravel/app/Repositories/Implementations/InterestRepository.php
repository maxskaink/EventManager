<?php

namespace App\Repositories\Implementations;

use App\Models\Interest;
use App\Repositories\Contracts\InterestRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class InterestRepository implements InterestRepositoryInterface
{
    public function create(array $data): Interest
    {
        return Interest::query()->create($data);
    }

    public function findByKeyword(string $keyword): ?Interest
    {
        return Interest::query()
            ->whereRaw('LOWER(keyword) = ?', [strtolower($keyword)])
            ->first();
    }

    public function findAll(): Collection
    {
        return Interest::query()
            ->orderBy('keyword')
            ->get();
    }

    public function findById(int $id): ?Interest
    {
        return Interest::query()->find($id);
    }

    public function delete(int $id): void
    {
        $interest = Interest::query()->find($id);

        $interest?->delete();
    }
}
