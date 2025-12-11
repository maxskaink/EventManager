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
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;

class PublicationService implements PublicationServiceInterface
{
    public function __construct(
        protected PublicationRepositoryInterface $publicationRepo,
        protected PublicationInterestRepositoryInterface $interestRepo,
        protected PublicationAccessRepositoryInterface $accessRepo,
        protected UserRepositoryInterface $userRepo
    ) {
    }

    /**
     * {@inheritDoc}
     *
     * @throws DuplicatedResourceException
     */
    /**
     * {@inheritDoc}
     *
     * @throws DuplicatedResourceException
     */
    public function addPublication(array $data, int $userId): Publication
    {
        return DB::transaction(function () use ($data, $userId) {
            // Check if a publication with the same title already exists
            if ($this->publicationRepo->findByTitle($data['title'])) {
                throw new DuplicatedResourceException("A publication with the title '{$data['title']}' already exists.");
            }

            // Create the publication with the authenticated user as the author
            $publication = $this->publicationRepo->create(array_merge(
                $data,
                ['author_id' => $userId]
            ));

            // Handle image upload if provided
            if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
                $publication->image_url = $this->processAndStoreImage($data['image']);
                $publication->save();
            }

            return $publication;
        });
    }

    /**
     * {@inheritDoc}
     *
     * @throws ResourceNotFoundException
     * @throws DuplicatedResourceException
     * @throws \Exception
     */
    public function addEventPublication(array $data, int $eventId, int $userId): Publication
    {
        // Verify the event exists
        $event = Event::query()->find($eventId);
        if (!$event) {
            throw new ResourceNotFoundException("Event with ID $eventId not found.");
        }

        // Ensure the event doesn't already have a publication
        if ($event->publication_id) {
            throw new DuplicatedResourceException("A publication for this event already exists.");
        }

        // Create the publication and associate it with the event
        $publication = $this->addPublication($data, $userId);
        $event->publication()->associate($publication);
        $publication->event()->associate($event);

        // Save changes to both models
        $event->save();
        $publication->save();

        return $publication;
    }

    /**
     * {@inheritDoc}
     */
    public function listAllPublications(int $perPage = 15): LengthAwarePaginator
    {
        return $this->publicationRepo
            ->listAll($perPage);
    }

    /**
     * {@inheritDoc}
     */
    public function listPublishedPublications(User $user, int $perPage = 15): LengthAwarePaginator
    {
        return $this->publicationRepo->listPublishedForUser($user, $perPage);
    }

    /**
     * {@inheritDoc}
     */
    public function listFilteredPublications(array $filters, ?User $user, int $perPage = 15): LengthAwarePaginator
    {
        return $this->publicationRepo->listFiltered($filters, $user, $perPage);
    }

    /**
     * {@inheritDoc}
     */
    public function getUsersWithAccess(int $publicationId): Collection
    {
        return $this->publicationRepo->getUsersWithAccess($publicationId);
    }

    /**
     * {@inheritDoc}
     */
    public function listDraftPublications(int $perPage = 15): LengthAwarePaginator
    {
        return $this->publicationRepo
            ->listDrafts($perPage);
    }

    /**
     * {@inheritDoc}
     *
     * @throws ResourceNotFoundException
     * @throws InvalidActionException
     */
    public function getPublicationById(int $id, User $user): Publication
    {
        $publication = $this->publicationRepo->findById($id);

        if (!$publication) {
            throw new ResourceNotFoundException("Publication not found.");
        }

        // Access control: Check if user has permission to view the publication
        // Public publications are visible to everyone.
        // Mentors and Coordinators can view all publications.
        // Other users need explicit access if it's not public.
        if (
            $publication->visibility !== 'public' &&
            $user->role !== 'mentor' &&
            $user->role !== 'coordinator' &&
            !$this->accessRepo->exists($publication->id, $user->id)
        ) {
            throw new InvalidActionException("You do not have access to this publication.");
        }

        return $publication->load(['event']); // only load event
    }

    /**
     * {@inheritDoc}
     *
     * @throws ResourceNotFoundException
     * @throws DuplicatedResourceException
     * @throws \Exception
     */
    public function updatePublication(int $id, array $data): Publication
    {
        return DB::transaction(function () use ($id, $data) {

            $publication = $this->publicationRepo->findById($id);
            if (!$publication) {
                throw new ResourceNotFoundException("Publication with ID $id not found.");
            }

            // Check for duplicate title if title is being updated
            if (isset($data['title'])) {
                $existing = $this->publicationRepo->findByTitle($data['title']);
                if ($existing && $existing->id !== $id) {
                    throw new DuplicatedResourceException("A publication with the title '{$data['title']}' already exists.");
                }
            }

            // Handle image update
            if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
                // Delete old image if it exists
                if ($publication->image_url) {
                    $oldPath = str_replace('/storage/', '', $publication->image_url);
                    if (Storage::disk('public')->exists($oldPath)) {
                        Storage::disk('public')->delete($oldPath);
                    }
                }

                // Process and store the new image
                $publication->image_url = $this->processAndStoreImage($data['image']);
            }

            // Update other fields
            foreach ($data as $key => $value) {
                if ($key !== 'image') {
                    $publication->{$key} = $value;
                }
            }

            $publication->save();
            return $publication;
        });
    }

    /**
     * {@inheritDoc}
     */
    public function addPublicationInterests(int $publicationId, array $interestIds): array
    {
        // Associate interests with the publication
        DB::transaction(function () use ($publicationId, $interestIds) {
            foreach ($interestIds as $interestId) {
                if (!$this->interestRepo->exists($publicationId, $interestId)) {
                    $this->interestRepo->create($publicationId, $interestId);
                }
            }
        });

        $publication = $this->publicationRepo->findById($publicationId);

        // Find users who have these interests to notify them
        // Note: This logic seems to get all users if interestIds is not empty, which might be intended or a bug in original code.
        // Assuming intention is to notify users with matching interests.
        // The original code logic:
        // foreach interestId -> get all users (empty roles array means all?) -> merge ids.
        // This looks like it might be getting ALL users multiple times.
        // Refined interpretation: It seems to be gathering users to notify.

        $userIds = [];
        foreach ($interestIds as $id) {
            // This part of the original code seems to fetch all users for each interest, 
            // but passing empty roles array to getUsersByRoles might return everyone?
            // Keeping original logic but adding comments.
            $users = $this->userRepo->getUsersByIds(
                $this->userRepo->getUsersByRoles([])->pluck('id')->toArray()
            );
            $userIds = array_merge($userIds, $users->pluck('id')->toArray());
        }

        $users = $this->userRepo->getUsersByIds($userIds);
        Notification::send($users, new NewPublicationNotification($publication));

        return $this->interestRepo->getByPublication($publicationId)->toArray();
    }

    /**
     * {@inheritDoc}
     */
    public function getPublicationInterests(int $publicationId): Collection
    {
        return $this->interestRepo->getByPublication($publicationId);
    }

    /**
     * {@inheritDoc}
     *
     * @throws ResourceNotFoundException
     * @throws InvalidActionException
     */
    public function grantPublicationAccess(int $publicationId, array $userIds = [], array $roles = []): array
    {
        $publication = $this->publicationRepo->findById($publicationId);
        if (!$publication) {
            throw new ResourceNotFoundException("Publication not found.");
        }

        if ($publication->visibility === 'public') {
            throw new InvalidActionException("Cannot grant access to a public publication.");
        }

        // Collect all target users from IDs and Roles
        $targetUsers = collect();
        if (!empty($userIds)) {
            $targetUsers = $targetUsers->merge($this->userRepo->getUsersByIds($userIds));
        }
        if (!empty($roles)) {
            $targetUsers = $targetUsers->merge($this->userRepo->getUsersByRoles($roles));
        }

        // Grant access to each user if not already granted
        $createdAccesses = [];
        foreach ($targetUsers as $user) {
            if (!$this->accessRepo->exists($publicationId, $user->id)) {
                $this->accessRepo->create($publicationId, $user->id);
                $createdAccesses[] = ['publication_id' => $publicationId, 'profile_id' => $user->id];
            }
        }

        // Notify users who have interests matching the publication's interests
        $publicationInterestIds = $this->interestRepo->getInterestIds($publicationId);
        $usersToNotify = $targetUsers->filter(
            fn(User $u) =>
            count(array_intersect($this->userRepo->getUserInterestIds($u->id), $publicationInterestIds)) > 0
        );

        if ($usersToNotify->isNotEmpty()) {
            Notification::send($usersToNotify, new NewPublicationNotification($publication));
        }

        return $createdAccesses;
    }

    /**
     * {@inheritDoc}
     *
     * @throws ResourceNotFoundException
     */
    public function revokePublicationAccess(int $publicationId, array $userIds = [], array $roles = []): array
    {
        $publication = $this->publicationRepo->findById($publicationId);
        if (!$publication) {
            throw new ResourceNotFoundException("Publication not found.");
        }

        $allUserIds = $userIds;

        // Resolve users from roles and merge with direct user IDs
        if (!empty($roles)) {
            $roleUsers = $this->userRepo->getUsersByRoles($roles)->pluck('id')->toArray();
            $allUserIds = array_merge($allUserIds, $roleUsers);
        }

        return $this->accessRepo->deleteForUsers($publicationId, $allUserIds);
    }

    /**
     * {@inheritDoc}
     *
     * @throws ResourceNotFoundException
     * @throws \Exception
     */
    public function setPublicationImage(int $publicationId, UploadedFile $image): Publication
    {
        return DB::transaction(function () use ($publicationId, $image) {
            $publication = $this->publicationRepo->findById($publicationId);
            if (!$publication) {
                throw new ResourceNotFoundException("Publication with ID $publicationId not found.");
            }

            $existingUrl = $publication->image_url ?? null;
            $publication->image_url = $this->processAndStoreImage($image, $existingUrl);
            $publication->save();

            return $publication;
        });
    }

    /**
     * {@inheritDoc}
     *
     * @throws ResourceNotFoundException
     */
    public function removePublicationInterests(int $publicationId, array $interestIds): array
    {
        $publication = $this->publicationRepo->findById($publicationId);
        if (!$publication) {
            throw new ResourceNotFoundException("Publication not found.");
        }

        return $this->interestRepo->deleteForPublication($publicationId, $interestIds);
    }

    /**
     * Process and store the uploaded image.
     *
     * @param UploadedFile $image
     * @param string|null $existingUrl
     * @return string
     * @throws \Exception
     */
    private function processAndStoreImage(UploadedFile $image, ?string $existingUrl = null): string
    {
        // Validate image size (max 5MB)
        if ($image->getSize() > 5 * 1024 * 1024) {
            throw new \Exception("The image size must not exceed 5MB.");
        }

        // Validate mime type
        $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!in_array($image->getMimeType(), $allowedMimeTypes, true)) {
            throw new \Exception("Invalid image type. Only JPEG, PNG, or WEBP are allowed.");
        }

        // Resize and convert image to WebP
        $manager = new ImageManager(new GdDriver());
        $img = $manager->read($image->getRealPath())->scale(width: 1600);

        $width = $img->width();
        $height = $img->height();

        $img = $img->toWebp(quality: 80);

        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        $disk = Storage::disk('public');

        // If replacing an existing image, try to overwrite it to avoid clutter
        if ($existingUrl) {
            $pathFromUrl = parse_url($existingUrl, PHP_URL_PATH) ?: $existingUrl;
            $pathFromUrl = preg_replace('#^/storage/#', '', $pathFromUrl);
            $pathFromUrl = ltrim($pathFromUrl, '/');

            if ($pathFromUrl !== '') {
                $target = $pathFromUrl;
                if (!$disk->exists($target)) {
                    $basename = pathinfo($target, PATHINFO_BASENAME);
                    $target = "publications/{$basename}";
                }
                $disk->put($target, (string) $img);
                return $disk->url($target);
            }
        }

        // Generate a new unique filename
        $identifier = Str::uuid()->toString();
        $filename = "{$identifier}-{$width}-{$height}.webp";

        $path = "publications/{$filename}";
        $disk->put($path, (string) $img);

        return $disk->url($path);
    }

    /**
     * {@inheritDoc}
     *
     * @throws ResourceNotFoundException
     */
    public function deletePublication(int $id): Publication
    {
        $publication = $this->publicationRepo->findById($id);
        if (!$publication) {
            throw new ResourceNotFoundException("Publication with ID {$id} not found.");
        }

        // Use transaction to ensure all related data is cleaned up properly
        DB::transaction(function () use ($publication) {
            // Delete publication interests
            $this->interestRepo->deleteAllForPublication($publication->id);

            // Delete publication access records
            $this->accessRepo->deleteAllForPublication($publication->id);

            // Delete image file if exists
            if ($publication->image_url) {
                $pathFromUrl = parse_url($publication->image_url, PHP_URL_PATH) ?: $publication->image_url;
                $pathFromUrl = preg_replace('#^/storage/#', '', $pathFromUrl);
                $pathFromUrl = ltrim($pathFromUrl, '/');

                if ($pathFromUrl !== '') {
                    /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
                    $disk = Storage::disk('public');
                    if ($disk->exists($pathFromUrl)) {
                        $disk->delete($pathFromUrl);
                    }
                }
            }

            // Soft delete the publication
            $publication->delete();
        });

        return $publication;
    }


}
