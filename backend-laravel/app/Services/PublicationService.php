<?php

namespace App\Services;

use App\Exceptions\DuplicatedResourceException;
use App\Exceptions\InvalidRoleException;
use App\Models\Event;
use App\Models\Publication;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;

class PublicationService
{
    /**
     * Create a new publication.
     *
     * @param array $data
     * @return Publication
     *
     * @throws InvalidRoleException
     * @throws DuplicatedResourceException
     */
    public function addPublication(array $data): Publication
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();


        if (!$authUser || ($authUser->role !== 'mentor' && $authUser->role !== 'coordinator')) {
            throw new InvalidRoleException('Only mentors or coordinators can create publications.');
        }

        // Check for duplicated title
        $existingPublication = Publication::query()->where('title', $data['title'])->first();
        if ($existingPublication) {
            throw new DuplicatedResourceException("A publication with the title: {$data['title']} already exists");
        }

        // Normalize date
        $data['published_at'] = Carbon::parse($data['published_at'])->toDateString();

        // Assign the authenticated user as the author if not explicitly provided
        $data['author_id'] = $authUser->id;

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
     *
     */
    public function addEventPublication(array $data, int $eventId): Publication
    {
        // Check for existing event
        $existingEvent = Event::query()->find($eventId);
        if (!$existingEvent) {
            throw new ResourceNotFoundException("A event with the id: {$eventId} was not found");
        }

        if($existingEvent->publication_id){
            throw new DuplicatedResourceException("A publication for this event already exists");
        }


       $publication = $this->addPublication($data);

        $existingEvent->publication()->associate($publication);
        $existingEvent->save();

        return $publication;
    }

    /**
     * List all publications.
     *
     */
    public function listAllPublications(): Collection
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();
        // Only authors or editors can view drafts
        if ($authUser && !in_array($authUser->role, ['mentor', 'coordinator'])) {
            throw new AuthorizationException('You are not allowed to view all publications.');
        }
        return Publication::query()
            ->orderBy('published_at', 'desc')
            ->get();
    }

    /**
     * List all published publications (status = activo).
     *
     */
    public function listPublishedPublications(): Collection
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();
        if (!$authUser) {
            throw new InvalidRoleException('Only authenticated users can list published publications.');
        }

        return Publication::query()
            ->where('status', '=', 'activo')
            ->where('visibility', '=', 'public')
            ->orderBy('published_at', 'desc')
            ->get();
    }

    /**
     * List all draft publications (status = borrador).
     *
     * @throws AuthorizationException
     */
    public function listDraftPublications(): Collection
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        // Only authors or editors can view drafts
        if ($authUser && !in_array($authUser->role, ['mentor', 'coordinator'])) {
            throw new AuthorizationException('You are not allowed to view draft publications.');
        }

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
     * @throws InvalidRoleException
     */
    public function updatePublication(int $id, array $data): Publication
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        if (!$authUser || ($authUser->role !== 'mentor' && $authUser->role !== 'coordinator')) {
            throw new InvalidRoleException('Only mentors or coordinators can update publications.');
        }

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
}
