<?php

namespace App\Services\Implementations;

use App\Exceptions\DuplicatedResourceException;
use App\Exceptions\InvalidActionException;
use App\Models\Event;
use App\Models\Publication;
use App\Models\User;
use App\Notifications\NewPublicationNotification;
use App\Services\Contracts\PublicationServiceInterface;
use App\Repositories\Contracts\PublicationRepositoryInterface;
use App\Repositories\Contracts\PublicationInterestRepositoryInterface;
use App\Repositories\Contracts\PublicationAccessRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;

class PublicationService implements PublicationServiceInterface
{
    public function __construct(
        protected PublicationRepositoryInterface $publicationRepo,
        protected PublicationInterestRepositoryInterface $interestRepo,
        protected PublicationAccessRepositoryInterface $accessRepo,
        protected UserRepositoryInterface $userRepo
    ) {}

    public function addPublication(array $data, int $userId): Publication
    {
        return DB::transaction(function () use ($data, $userId) {

            $image = null;
            $filename = null;

            if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
                $image = $data['image'];

                if ($image->getSize() > 2 * 1024 * 1024) {
                    throw new \Exception("The image size must not exceed 2MB.");
                }

                $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
                if (!in_array($image->getMimeType(), $allowedMimeTypes)) {
                    throw new \Exception("Invalid image type. Only JPEG, PNG, or WEBP are allowed.");
                }

                $filename = Str::uuid() . '.' . $image->getClientOriginalExtension();
            }

            if ($this->publicationRepo->findByTitle($data['title'])) {
                throw new DuplicatedResourceException("A publication with the title '{$data['title']}' already exists.");
            }

            // Create publication without saving the image yet
            $publication = $this->publicationRepo->create(array_merge(
                $data,
                ['author_id' => $userId]
            ));

            // Save image only after publication has been successfully created
            if ($image && $filename) {
                $path = $image->storeAs('publications', $filename);
                $publication->image_url = Storage::url($path);
                $publication->save();
            }

            return $publication;
        });
    }


    /**
     * @throws \Exception
     */
    public function addEventPublication(array $data, int $eventId, int $userId): Publication
    {
        $event = Event::query()->find($eventId);
        if (!$event) {
            throw new ResourceNotFoundException("Event with ID $eventId not found.");
        }

        if ($event->publication_id) {
            throw new DuplicatedResourceException("A publication for this event already exists.");
        }

        $publication = $this->addPublication($data, $userId);
        $event->publication()->associate($publication);
        $event->save();

        return $publication;
    }

    public function listAllPublications(): Collection
    {
        return $this->publicationRepo->listAll();
    }

    public function listPublishedPublications(User $user): Collection
    {
        if (in_array($user->role, ['mentor', 'coordinator'], true)) {
            return $this->publicationRepo->listPublished();
        }

        $allPublished = $this->publicationRepo->listPublished();
        return $allPublished->filter(function (Publication $pub) use ($user) {
            if ($pub->visibility === 'public') {
                return true;
            }

            return $this->accessRepo->exists($pub->id, $user->id);
        });
    }

    public function listDraftPublications(): Collection
    {
        return $this->publicationRepo->listDrafts();
    }


    public function updatePublication(int $id, array $data): Publication
    {
        return DB::transaction(function () use ($id, $data) {
            Log::info('UpdatePublication called', ['id' => $id, 'data' => $data]);

            $publication = $this->publicationRepo->findById($id);
            if (!$publication) {
                Log::warning("Publication not found", ['id' => $id]);
                throw new ResourceNotFoundException("Publication with ID $id not found.");
            }

            if (isset($data['title'])) {
                Log::info('Title to update', ['title' => $data['title']]);
                $existing = $this->publicationRepo->findByTitle($data['title']);
                if ($existing && $existing->id !== $id) {
                    Log::error('Duplicated title detected', ['existingId' => $existing->id]);
                    throw new DuplicatedResourceException("A publication with the title '{$data['title']}' already exists.");
                }
            }


            if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
                Log::info('Image detected', ['image' => $data['image']->getClientOriginalName()]);
                $image = $data['image'];
                $filename = Str::uuid() . '.' . $image->getClientOriginalExtension();
                $path = $image->storeAs('publications', $filename);
                $publication->image_url = Storage::url($path);
                $publication->save();
            }

            foreach ($data as $key => $value) {
                if ($key !== 'image') {
                    Log::info("Updating field $key", ['value' => $value]);
                    $publication->{$key} = $value;
                }
            }
            $publication->save();

            Log::info('Publication updated successfully', ['publication_id' => $publication->id]);

            return $publication;
        });
    }


    public function addPublicationInterests(int $publicationId, array $interestIds): array
    {
        DB::transaction(function () use ($publicationId, $interestIds) {
            foreach ($interestIds as $interestId) {
                if (!$this->interestRepo->exists($publicationId, $interestId)) {
                    $this->interestRepo->create($publicationId, $interestId);
                }
            }
        });

        $publication = $this->publicationRepo->findById($publicationId);

        $userIds = [];
        foreach ($interestIds as $id) {
            $users = $this->userRepo->getUsersByIds(
                $this->userRepo->getUsersByRoles([])->pluck('id')->toArray()
            );
            $userIds = array_merge($userIds, $users->pluck('id')->toArray());
        }

        $users = $this->userRepo->getUsersByIds($userIds);
        Notification::send($users, new NewPublicationNotification($publication));

        return $this->interestRepo->getByPublication($publicationId)->toArray();
    }

    public function grantPublicationAccess(int $publicationId, array $userIds = [], array $roles = []): array
    {
        $publication = $this->publicationRepo->findById($publicationId);
        if (!$publication) {
            throw new ResourceNotFoundException("Publication not found.");
        }

        if ($publication->visibility === 'public') {
            throw new InvalidActionException("Cannot grant access to a public publication.");
        }

        $targetUsers = collect();
        if (!empty($userIds)) {
            $targetUsers = $targetUsers->merge($this->userRepo->getUsersByIds($userIds));
        }
        if (!empty($roles)) {
            $targetUsers = $targetUsers->merge($this->userRepo->getUsersByRoles($roles));
        }

        $createdAccesses = [];
        foreach ($targetUsers as $user) {
            if (!$this->accessRepo->exists($publicationId, $user->id)) {
                $this->accessRepo->create($publicationId, $user->id);
                $createdAccesses[] = ['publication_id' => $publicationId, 'profile_id' => $user->id];
            }
        }

        // Notify users with matching interests
        $publicationInterestIds = $this->interestRepo->getInterestIds($publicationId);
        $usersToNotify = $targetUsers->filter(fn(User $u) =>
            count(array_intersect($this->userRepo->getUserInterestIds($u->id), $publicationInterestIds)) > 0
        );

        if ($usersToNotify->isNotEmpty()) {
            Notification::send($usersToNotify, new NewPublicationNotification($publication));
        }

        return $createdAccesses;
    }

    public function revokePublicationAccess(int $publicationId, array $userIds = [], array $roles = []): array
    {
        $publication = $this->publicationRepo->findById($publicationId);
        if (!$publication) {
            throw new ResourceNotFoundException("Publication not found.");
        }

        $allUserIds = $userIds;

        if (!empty($roles)) {
            $roleUsers = $this->userRepo->getUsersByRoles($roles)->pluck('id')->toArray();
            $allUserIds = array_merge($allUserIds, $roleUsers);
        }

        return $this->accessRepo->deleteForUsers($publicationId, $allUserIds);
    }

    public function getPublicationById(int $id, User $user): Publication
    {
        $publication = $this->publicationRepo->findById($id);
        if (!$publication) {
            throw new ResourceNotFoundException("Publication not found.");
        }

        if (in_array($user->role, ['mentor', 'coordinator'], true)) {
            return $publication;
        }

        $hasAccess = $publication->visibility === 'public' || $this->accessRepo->exists($id, $user->id);
        if (!$hasAccess) {
            throw new ResourceNotFoundException("You don't have access to this publication.");
        }

        return $publication;
    }
    public function setPublicationImage(int $publicationId, UploadedFile $image): Publication
    {
        return DB::transaction(function () use ($publicationId, $image) {

            $publication = $this->publicationRepo->findById($publicationId);
            if (!$publication) {
                throw new ResourceNotFoundException("Publication with ID $publicationId not found.");
            }

            if ($image->getSize() > 2 * 1024 * 1024) {
                throw new \Exception("The image size must not exceed 2MB.");
            }

            $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!in_array($image->getMimeType(), $allowedMimeTypes)) {
                throw new \Exception("Invalid image type. Only JPEG, PNG, or WEBP are allowed.");
            }

            $filename = Str::uuid() . '.' . $image->getClientOriginalExtension();
            $path = $image->storeAs('publications', $filename);
            $imageUrl = Storage::url($path);


            if ($publication->image_url) {
                $oldPath = str_replace('/storage/', '', $publication->image_url);
                if (Storage::exists($oldPath)) {
                    Storage::delete($oldPath);
                }
            }

            $publication->image_url = $imageUrl;
            $publication->save();

            return $publication;
        });
    }

    public function removePublicationInterests(int $publicationId, array $interestIds): array
    {
        $publication = $this->publicationRepo->findById($publicationId);
        if (!$publication) {
            throw new ResourceNotFoundException("Publication not found.");
        }

        DB::transaction(function () use ($publicationId, $interestIds) {
            $this->interestRepo->deleteForPublication($publicationId, $interestIds);
        });

        return $this->interestRepo->getByPublication($publicationId)->toArray();
    }


}
