<?php

namespace App\Repositories\Implementations;

use App\Models\Publication;
use App\Models\User;
use App\Repositories\Contracts\PublicationRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class PublicationRepository implements PublicationRepositoryInterface
{
    /**
     * {@inheritDoc}
     */
    public function create(array $data): Publication
    {
        return Publication::query()->create($data);
    }

    /**
     * {@inheritDoc}
     */
    public function findById(int $id): ?Publication
    {
        return Publication::query()->find($id);
    }

    /**
     * {@inheritDoc}
     */
    public function update(int $id, array $data): Publication
    {
        $publication = Publication::query()->findOrFail($id);
        $publication->update($data);
        return $publication;
    }

    /**
     * {@inheritDoc}
     */
    public function findByTitle(string $title): ?Publication
    {
        return Publication::query()
            ->where('title', $title)
            ->first();
    }

    /**
     * {@inheritDoc}
     */
    public function listAll(int $perPage = 15): LengthAwarePaginator
    {
        // List all publications, including event details, ordered by creation date.
        return Publication::query()
            ->with('event')
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }

    /**
     * {@inheritDoc}
     */
    public function listPublished(int $perPage = 15): LengthAwarePaginator
    {
        // List only active publications.
        return Publication::query()
            ->with('event')
            ->where('status', 'activo')
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }

    /**
     * {@inheritDoc}
     */
    public function listDrafts(int $perPage = 15): LengthAwarePaginator
    {
        // List only draft publications.
        return Publication::query()
            ->with('event')
            ->where('status', 'borrador')
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }

    /**
     * {@inheritDoc}
     */
    public function listPublishedForUser(?User $user, int $perPage = 15): LengthAwarePaginator
    {
        $query = Publication::query()
            ->where('status', 'activo')
            ->orderByDesc('created_at')
            ->with('event');

        // Unauthenticated user -> public only
        if ($user === null) {
            return $query->where('visibility', 'public')->paginate($perPage);
        }

        // Roles with full access
        if (in_array($user->role, ['mentor', 'coordinator'], true)) {
            return $query->paginate($perPage);
        }

        // Standard user -> public or explicitly granted access
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

    /**
     * {@inheritDoc}
     */
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

    /**
     * {@inheritDoc}
     */
    public function getUsersWithAccess(int $publicationId): Collection
    {
        // Retrieve users who have an entry in publication_accesses for this publication.
        return User::query()
            ->whereIn('id', function ($query) use ($publicationId) {
                $query->select('profile_id')
                    ->from('publication_accesses')
                    ->where('publication_id', $publicationId);
            })
            ->get();
    }

}
