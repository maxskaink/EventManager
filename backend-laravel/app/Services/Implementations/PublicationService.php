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
    ) {}

    public function addPublication(array $data, int $userId): Publication
    {
        return DB::transaction(function () use ($data, $userId) {

            if ($this->publicationRepo->findByTitle($data['title'])) {
                throw new DuplicatedResourceException("A publication with the title '{$data['title']}' already exists.");
            }

            $publication = $this->publicationRepo->create(array_merge(
                $data,
                ['author_id' => $userId]
            ));

            if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
                $publication->image_url = $this->processAndStoreImage($data['image']);
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

            $publication = $this->publicationRepo->findById($id);
            if (!$publication) {
                throw new ResourceNotFoundException("Publication with ID $id not found.");
            }

            if (isset($data['title'])) {
                $existing = $this->publicationRepo->findByTitle($data['title']);
                if ($existing && $existing->id !== $id) {
                    throw new DuplicatedResourceException("A publication with the title '{$data['title']}' already exists.");
                }
            }

            if (isset($data['image']) && $data['image'] instanceof UploadedFile) {

                if ($publication->image_url) {
                    $oldPath = str_replace('/storage/', '', $publication->image_url);
                    if (Storage::disk('public')->exists($oldPath)) {
                        Storage::disk('public')->delete($oldPath);
                    }
                }

                $publication->image_url = $this->processAndStoreImage($data['image']);
            }

            foreach ($data as $key => $value) {
                if ($key !== 'image') {
                    $publication->{$key} = $value;
                }
            }

            $publication->save();
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
            if (! $publication) {
                throw new ResourceNotFoundException("Publication with ID $publicationId not found.");
            }

            $existingUrl = $publication->image_url ?? null;
            $publication->image_url = $this->processAndStoreImage($image, $existingUrl);
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

        return $this->interestRepo->deleteForPublication($publicationId, $interestIds);
    }

    private function processAndStoreImage(UploadedFile $image, ?string $existingUrl = null): string
    {
        if ($image->getSize() > 2 * 1024 * 1024) {
            throw new \Exception("The image size must not exceed 2MB.");
        }

        $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (! in_array($image->getMimeType(), $allowedMimeTypes, true)) {
            throw new \Exception("Invalid image type. Only JPEG, PNG, or WEBP are allowed.");
        }

        $manager = new ImageManager(new GdDriver());
        $img = $manager->read($image->getRealPath())->scale(width: 1600);

        $width = $img->width();
        $height = $img->height();

        $img = $img->toWebp(quality: 80);

        $disk = Storage::disk('public');

        if ($existingUrl) {
            $pathFromUrl = parse_url($existingUrl, PHP_URL_PATH) ?: $existingUrl;
            $pathFromUrl = preg_replace('#^/storage/#', '', $pathFromUrl);
            $pathFromUrl = ltrim($pathFromUrl, '/');

            if ($pathFromUrl !== '') {
                $target = $pathFromUrl;
                if (! $disk->exists($target)) {
                    $basename = pathinfo($target, PATHINFO_BASENAME);
                    $target = "publications/{$basename}";
                }
                $disk->put($target, (string) $img);
                return $disk->url($target);
            }
        }

        $identifier = Str::uuid()->toString();
        $filename = "{$identifier}-{$width}-{$height}.webp";

        $path = "publications/{$filename}";
        $disk->put($path, (string) $img);

        return $disk->url($path);
    }


}
