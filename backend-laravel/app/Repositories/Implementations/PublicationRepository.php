<?php

namespace App\Repositories\Implementations;

use App\Models\Publication;
use App\Repositories\Contracts\PublicationRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class PublicationRepository implements PublicationRepositoryInterface
{
    public function create(array $data): Publication
    {
        return Publication::query()->create($data);
    }

    public function findById(int $id): ?Publication
    {
        return Publication::query()->find($id);
    }

    public function update(int $id, array $data): Publication
    {
        $publication = Publication::query()->findOrFail($id);
        $publication->update($data);
        return $publication;
    }

    public function findByTitle(string $title): ?Publication
    {
        return Publication::query()
            ->where('title', $title)
            ->first();
    }

    public function listAll(): Collection
    {
        return Publication::query()
            ->orderByDesc('created_at')
            ->get();
    }

    public function listPublished(): Collection
    {
        return Publication::query()
            ->where('status', 'published')
            ->orderByDesc('created_at')
            ->get();
    }

    public function listDrafts(): Collection
    {
        return Publication::query()
            ->where('status', 'draft')
            ->orderByDesc('created_at')
            ->get();
    }
}
