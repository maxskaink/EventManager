<?php

namespace App\Repositories\Implementations;

use App\Models\Publication;
use App\Models\User;
use App\Repositories\Contracts\PublicationRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
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

    public function listAll(int $perPage = 15): LengthAwarePaginator
    {
        return Publication::query()
            ->with('event')
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }

    public function listPublished(int $perPage = 15): LengthAwarePaginator
    {
        return Publication::query()
            ->with('event')
            ->where('status', 'activo')
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }

    public function listDrafts(int $perPage = 15): LengthAwarePaginator
    {
        return Publication::query()
            ->with('event')
            ->where('status', 'borrador')
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }

    public function listPublishedForUser(?User $user, int $perPage = 15): LengthAwarePaginator
    {
        $query = Publication::query()
            ->where('status', 'activo')
            ->orderByDesc('created_at')
            ->with('event');

        // Usuario no autenticado → solo públicas
        if ($user === null) {
            return $query->where('visibility', 'public')->paginate($perPage);
        }

        // Roles con acceso total
        if (in_array($user->role, ['mentor', 'coordinator'], true)) {
            return $query->paginate($perPage);
        }

        // Usuario normal → públicas o con accesso
        return $query
            ->where(function ($q) use ($user) {
                $q->where('visibility', 'public')
                    ->orWhereExists(function ($sub) use ($user) {
                        $sub->from('publication_accesses')
                            ->whereColumn('publication_accesses.publication_id', 'publications.id')
                            ->where('publication_accesses.profile_id', $user->id);
                    });
            })
            ->paginate($perPage);
    }

    public function listFiltered(array $filters, ?User $user, int $perPage = 15): LengthAwarePaginator
    {
        $query = Publication::query()
            ->where('status', 'activo')
            ->orderByDesc('created_at')
            ->with('event');

        // Apply filters
        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (!empty($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('content', 'like', '%' . $filters['search'] . '%');
            });
        }

        // Visibility logic (same as listPublishedForUser)
        if ($user === null) {
            return $query->where('visibility', 'public')->paginate($perPage);
        }

        if (in_array($user->role, ['mentor', 'coordinator'], true)) {
            return $query->paginate($perPage);
        }

        return $query
            ->where(function ($q) use ($user) {
                $q->where('visibility', 'public')
                    ->orWhereExists(function ($sub) use ($user) {
                        $sub->from('publication_accesses')
                            ->whereColumn('publication_accesses.publication_id', 'publications.id')
                            ->where('publication_accesses.profile_id', $user->id);
                    });
            })
            ->paginate($perPage);
    }

}
