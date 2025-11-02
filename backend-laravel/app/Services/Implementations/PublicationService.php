<?php

namespace App\Services\Implementations;

use App\Exceptions\DuplicatedResourceException;
use App\Models\Event;
use App\Models\Publication;
use App\Models\PublicationAccess;
use App\Models\PublicationInterest;
use App\Models\User;
use App\Services\Contracts\PublicationServiceInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;

class PublicationService implements PublicationServiceInterface
{
    /**
     * Create a new publication.
     *
     * @param array $data
     * @return Publication
     *
     * @throws DuplicatedResourceException
     */
    public function addPublication(array $data): Publication
    {
        // Check for duplicated title
        $existingPublication = Publication::query()->where('title', $data['title'])->first();
        if ($existingPublication) {
            throw new DuplicatedResourceException("A publication with the title: {$data['title']} already exists");
        }

        // Normalize date
        $data['published_at'] = Carbon::parse($data['published_at'])->toDateString();

        $publication = new Publication();
        $publication->fill($data);
        $publication->save();

        return $publication;
    }

    /**
     * Create a new publication about a new event.
     *
     * @param array $data
     * @param int $eventId
     * @return Publication
     */
    public function addEventPublication(array $data, int $eventId): Publication
    {
        $existingEvent = Event::query()->find($eventId);
        if (!$existingEvent) {
            throw new ResourceNotFoundException("An event with the id: {$eventId} was not found");
        }

        if ($existingEvent->publication_id) {
            throw new DuplicatedResourceException("A publication for this event already exists");
        }

        $publication = $this->addPublication($data);

        $existingEvent->publication()->associate($publication);
        $existingEvent->save();

        return $publication;
    }

    /**
     * List all publications.
     */
    public function listAllPublications(): Collection
    {
        return Publication::query()
            ->orderBy('published_at', 'desc')
            ->get();
    }

    /**
     * List all published publications (status = activo).
     */
    public function listPublishedPublications(): Collection
    {
        return Publication::query()
            ->where('status', '=', 'activo')
            ->where('visibility', '=', 'public')
            ->orderBy('published_at', 'desc')
            ->get();
    }

    /**
     * List all draft publications (status = borrador).
     */
    public function listDraftPublications(): Collection
    {
        return Publication::query()
            ->where('status', '=', 'borrador')
            ->orderBy('last_modified', 'desc')
            ->get();
    }

    /**
     * Update an existing publication by ID.
     *
     * @param int $id
     * @param array $data
     * @return Publication
     *
     * @throws ResourceNotFoundException
     * @throws DuplicatedResourceException
     */
    public function updatePublication(int $id, array $data): Publication
    {
        $publication = Publication::query()->find($id);

        if (!$publication) {
            throw new ResourceNotFoundException("The publication with ID {$id} was not found.");
        }

        // Prevent duplicate title if being updated
        if (isset($data['title'])) {
            $existing = Publication::query()
                ->where('title', $data['title'])
                ->where('id', '<>', $id)
                ->first();

            if ($existing) {
                throw new DuplicatedResourceException("A publication with the title: {$data['title']} already exists");
            }
        }

        // Normalize date if present
        if (isset($data['published_at'])) {
            $data['published_at'] = Carbon::parse($data['published_at'])->toDateString();
        }

        $publication->fill($data);
        $publication->save();

        return $publication;
    }

    /**
     * Add interests to a publication.
     *
     * @param int $id
     * @param array $interestIds
     * @return array
     */
    public function addPublicationInterests(int $id, array $interestIds): array
    {
        DB::transaction(function () use ($id, $interestIds) {
            foreach ($interestIds as $interestId) {
                $exists = PublicationInterest::query()
                    ->where('publication_id', $id)
                    ->where('interest_id', $interestId)
                    ->exists();

                if (!$exists) {
                    PublicationInterest::query()->create([
                        'publication_id' => $id,
                        'interest_id' => $interestId,
                    ]);
                }
            }
        });

        return PublicationInterest::query()
            ->where('publication_id', $id)
            ->with('publication')
            ->get()
            ->toArray();
    }

    /**
     * Grant access to one or more users or roles for a private publication.
     *
     * @param int $publicationId
     * @param array $userIds
     * @param array $roles
     * @return array
     *
     * @throws ResourceNotFoundException
     */
    public function grantPublicationAccess(int $publicationId, array $userIds = [], array $roles = []): array
    {
        $publication = Publication::query()->find($publicationId);
        if (!$publication) {
            throw new ResourceNotFoundException("The publication with ID {$publicationId} was not found.");
        }

        $targetUsers = collect();

        if (!empty($userIds)) {
            $usersById = User::query()->whereIn('id', $userIds)->get();
            $targetUsers = $targetUsers->merge($usersById);
        }

        if (!empty($roles)) {
            $usersByRole = User::query()->whereIn('role', $roles)->get();
            $targetUsers = $targetUsers->merge($usersByRole);
        }

        $createdAccesses = [];

        DB::transaction(function () use ($publicationId, $targetUsers, &$createdAccesses) {
            foreach ($targetUsers as $user) {
                $exists = PublicationAccess::query()
                    ->where('publication_id', $publicationId)
                    ->where('profile_id', $user->id)
                    ->exists();

                if (!$exists) {
                    $access = PublicationAccess::query()->create([
                        'publication_id' => $publicationId,
                        'profile_id' => $user->id,
                    ]);
                    $createdAccesses[] = $access;
                }
            }
        });

        return $createdAccesses;
    }

    /**
     * Revoke access from one or more users or roles for a publication.
     *
     * @param int $publicationId
     * @param array $userIds
     * @param array $roles
     * @return array
     *
     * @throws ResourceNotFoundException
     */
    public function revokePublicationAccess(int $publicationId, array $userIds = [], array $roles = []): array
    {
        $publication = Publication::query()->find($publicationId);
        if (!$publication) {
            throw new ResourceNotFoundException("The publication with ID {$publicationId} was not found.");
        }

        $targetUserIds = collect($userIds);

        if (!empty($roles)) {
            $usersByRoles = User::query()
                ->whereIn('role', $roles)
                ->pluck('id');
            $targetUserIds = $targetUserIds->merge($usersByRoles);
        }

        $targetUserIds = $targetUserIds->unique();

        if ($targetUserIds->isEmpty()) {
            throw new ResourceNotFoundException('No valid users found to revoke access.');
        }

        $revokedUserIds = [];

        DB::transaction(function () use ($publicationId, $targetUserIds, &$revokedUserIds) {
            $revokedUserIds = PublicationAccess::query()
                ->where('publication_id', $publicationId)
                ->whereIn('profile_id', $targetUserIds)
                ->pluck('profile_id')
                ->toArray();

            if (!empty($revokedUserIds)) {
                PublicationAccess::query()
                    ->where('publication_id', $publicationId)
                    ->whereIn('profile_id', $revokedUserIds)
                    ->delete();
            }
        });

        if (empty($revokedUserIds)) {
            throw new ResourceNotFoundException('No accesses were revoked.');
        }

        return $revokedUserIds;
    }
}
