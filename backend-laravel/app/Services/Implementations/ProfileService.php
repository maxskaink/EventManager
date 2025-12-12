<?php

namespace App\Services\Implementations;

use App\Repositories\Contracts\ProfileRepositoryInterface;
use App\Services\Contracts\ProfileServiceInterface;
use App\Models\Profile;
use App\Services\Contracts\UserServiceInterface;
use Illuminate\Support\Facades\DB;

class ProfileService implements ProfileServiceInterface
{
    protected ProfileRepositoryInterface $profileRepository;
    protected UserServiceInterface $userService;

    public function __construct(ProfileRepositoryInterface $profileRepository, UserServiceInterface $userService)
    {
        $this->profileRepository = $profileRepository;
        $this->userService = $userService;
    }

    /**
     * {@inheritDoc}
     */
    public function updateProfile(int $userId, array $data): Profile
    {
        return $this->profileRepository->updateOrCreateProfile($userId, $data);
    }

    /**
     * {@inheritDoc}
     */
    public function getProfile(int $userId): Profile
    {
        return $this->profileRepository->getOrCreateProfile($userId);
    }

    /**
     * {@inheritDoc}
     */
    /**
     * {@inheritDoc}
     */
    public function addProfileInterests(int $userId, array $interestIds): array
    {
        // Use a transaction to ensure all interests are added or none
        DB::transaction(function () use ($userId, $interestIds) {
            foreach ($interestIds as $interestId) {
                // Avoid duplicates by checking existence before creating
                if (!$this->profileRepository->existsProfileInterest($userId, $interestId)) {
                    $this->profileRepository->createProfileInterest($userId, $interestId);
                }
            }
        });

        return $this->profileRepository
            ->getAllProfileInterests($userId)
            ->toArray();
    }

    /**
     * {@inheritDoc}
     */
    public function getAllProfileInterests(int $userId): array
    {
        return $this->profileRepository
            ->getAllProfileInterests($userId)
            ->toArray();
    }

    /**
     * {@inheritDoc}
     */
    public function getProfileInterestById(int $userId, int $interestId): ?array
    {
        $interest = $this->profileRepository->getProfileInterestById($userId, $interestId);

        return $interest?->toArray();
    }

    /**
     * {@inheritDoc}
     */
    public function removeProfileInterest(int $userId, int $interestId): bool
    {
        return $this->profileRepository->deleteProfileInterest($userId, $interestId);
    }

    /**
     * {@inheritDoc}
     */
    public function getAllProfiles(): array
    {
        // Retrieve all active users to ensure we only get profiles for valid users
        $activeUsers = $this->userService->listActiveUsers();

        // Map users to their profiles, creating them if they don't exist
        $profiles = $activeUsers->map(function ($user) {
            return $this->profileRepository->getOrCreateProfile($user->id);
        });

        return $profiles->toArray();
    }
}
