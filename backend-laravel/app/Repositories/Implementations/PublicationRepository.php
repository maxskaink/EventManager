<?php

namespace App\Repositories\Implementations;

use App\Models\Publication;
use App\Models\User;
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
            ->where('status', 'activo')
            ->orderByDesc('created_at')
            ->get();
    }

    public function listDrafts(): Collection
    {
        return Publication::query()
            ->where('status', 'borrador')
            ->orderByDesc('created_at')
            ->get();
    }

    public function listPublishedForUser(?User $user): Collection
    {
        $query = Publication::query()
            ->where('status', 'activo')
            ->orderByDesc('created_at')
            ->with('event');

        // Usuario no autenticado → solo públicas
        if ($user === null) {
            return $query->where('visibility', 'public')->get();
        }

        // Roles con acceso total
        if (in_array($user->role, ['mentor', 'coordinator'], true)) {
            return $query->get();
        }

        // Usuario normal → públicas o con accesso
        return $query
            ->where(function ($q) use ($user) {
                $q->where('visibility', 'public')
                    ->orWhereExists(function($sub) use ($user) {
                        $sub->from('publication_accesses')
                            ->whereColumn('publication_accesses.publication_id', 'publications.id')
                            ->where('publication_accesses.profile_id', $user->id);
                    });
            })
            ->get();
    }

}
