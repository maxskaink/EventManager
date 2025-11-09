<?php

namespace App\Services\Implementations;

use App\Exceptions\DuplicatedResourceException;
use App\Exceptions\InvalidActionException;
use App\Models\Event;
use App\Models\ProfileInterest;
use App\Models\Publication;
use App\Models\PublicationAccess;
use App\Models\PublicationInterest;
use App\Models\User;
use App\Notifications\NewPublicationNotification;
use App\Services\Contracts\PublicationServiceInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
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
    public function addPublication(array $data,int $userId): Publication
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
        $publication->author_id = $userId;
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
    public function addEventPublication(array $data, int $eventId, int $userId): Publication
    {
        $existingEvent = Event::query()->find($eventId);
        if (!$existingEvent) {
            throw new ResourceNotFoundException("An event with the id: {$eventId} was not found");
        }

        if ($existingEvent->publication_id) {
            throw new DuplicatedResourceException("A publication for this event already exists");
        }

        $publication = $this->addPublication($data,$userId);

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
    public function listPublishedPublications(User $user): Collection
    {
        // Mentors and coordinators can see all active publications
        if (in_array($user->role, ['mentor', 'coordinator'], true)) {
            return Publication::query()
                ->where('status', 'activo')
                ->orderBy('published_at', 'desc')
                ->get();
        }

        // Regular users can see public publications + those they have access to
        return Publication::query()
            ->where('status', 'activo')
            ->where(function ($query) use ($user) {
                $query->where('visibility', 'public')
                    ->orWhereIn('id', function ($subquery) use ($user) {
                        $subquery->select('publication_id')
                            ->from('publication_accesses')
                            ->where('profile_id', $user->id);
                    });
            })
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

    public function addPublicationInterests(int $id, array $interestIds): array
    {
        DB::transaction(function () use ($id, $interestIds) {
            foreach ($interestIds as $interestId) {
                // Check if the publication already has this interest
                $exists = PublicationInterest::query()
                    ->where('publication_id', $id)
                    ->where('interest_id', $interestId)
                    ->exists();

                // If not, create a new relationship record
                if (!$exists) {
                    PublicationInterest::query()->create([
                        'publication_id' => $id,
                        'interest_id' => $interestId,
                    ]);
                }
            }
        });

        // 🔹 Retrieve the publication
        $publication = Publication::query()->findOrFail($id);

        // 🔹 Get all user IDs that share any of the provided interests
        $userIds = ProfileInterest::query()
            ->whereIn('interest_id', $interestIds)
            ->pluck('user_id')
            ->unique()
            ->toArray();

        // 🔹 Retrieve those users
        $users = User::query()->whereIn('id', $userIds)->get();

        // 🔹 Send the notification to all matching users
        Notification::send($users, new NewPublicationNotification($publication));

        // 🔹 Return updated publication interests
        return PublicationInterest::query()
            ->where('publication_id', $id)
            ->with('publication')
            ->get()
            ->toArray();
    }



    public function grantPublicationAccess(int $publicationId, array $userIds = [], array $roles = []): array
    {
        $publication = Publication::query()->find($publicationId);

        // Throw exception if publication does not exist
        if (!$publication) {
            throw new ResourceNotFoundException("The publication with ID {$publicationId} was not found.");
        }

        // Prevent access grants for public publications
        if ($publication->visibility === 'public') {
            throw new InvalidActionException("Cannot grant access to a public publication.");
        }

        $targetUsers = collect();

        // Collect target users by IDs (excluding mentors and coordinators)
        if (!empty($userIds)) {
            $usersById = User::query()
                ->whereIn('id', $userIds)
                ->whereNotIn('role', ['mentor', 'coordinator'])
                ->get();

            $targetUsers = $targetUsers->merge($usersById);
        }

        // Collect target users by roles (excluding mentors and coordinators)
        if (!empty($roles)) {
            $usersByRole = User::query()
                ->whereIn('role', $roles)
                ->whereNotIn('role', ['mentor', 'coordinator'])
                ->get();

            $targetUsers = $targetUsers->merge($usersByRole);
        }

        $createdAccesses = [];

        DB::transaction(function () use ($publicationId, $targetUsers, &$createdAccesses) {
            foreach ($targetUsers as $user) {
                // Check if this user already has access to the publication
                $exists = PublicationAccess::query()
                    ->where('publication_id', $publicationId)
                    ->where('profile_id', $user->id)
                    ->exists();

                // Skip if access already exists
                if ($exists) {
                    continue;
                }

                // Create a new access record
                $access = PublicationAccess::query()->create([
                    'publication_id' => $publicationId,
                    'profile_id' => $user->id,
                ]);

                $createdAccesses[] = $access;
            }
        });

        // 🔹 After granting access, check for interest matches and notify users

        // Get all interests related to this publication
        $publicationInterestIds = PublicationInterest::query()
            ->where('publication_id', $publicationId)
            ->pluck('interest_id')
            ->toArray();

        // For each user who got access, check if they have any matching interests
        $usersToNotify = $targetUsers->filter(function ($user) use ($publicationInterestIds) {
            $userInterestIds = ProfileInterest::query()
                ->where('user_id', $user->id)
                ->pluck('interest_id')
                ->toArray();

            // Return true if at least one interest matches
            return count(array_intersect($userInterestIds, $publicationInterestIds)) > 0;
        });

        // Send a notification only to users with matching interests
        if ($usersToNotify->isNotEmpty()) {
            Notification::send($usersToNotify, new NewPublicationNotification($publication));
        }

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
