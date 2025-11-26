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

    public function updateProfile(int $userId, array $data): Profile
    {
        return $this->profileRepository->updateOrCreateProfile($userId, $data);
    }

    public function getProfile(int $userId): Profile
    {
        return $this->profileRepository->getOrCreateProfile($userId);
    }

    public function addProfileInterests(int $userId, array $interestIds): array
    {
        DB::transaction(function () use ($userId, $interestIds) {
            foreach ($interestIds as $interestId) {
                if (!$this->profileRepository->existsProfileInterest($userId, $interestId)) {
                    $this->profileRepository->createProfileInterest($userId, $interestId);
                }
            }
        });

        return $this->profileRepository
            ->getAllProfileInterests($userId)
            ->toArray();
    }

    public function getAllProfileInterests(int $userId): array
    {
        return $this->profileRepository
            ->getAllProfileInterests($userId)
            ->toArray();
    }

    public function getProfileInterestById(int $userId, int $interestId): ?array
    {
        $interest = $this->profileRepository->getProfileInterestById($userId, $interestId);

        return $interest?->toArray();
    }

    public function removeProfileInterest(int $userId, int $interestId): bool
    {
        return $this->profileRepository->deleteProfileInterest($userId, $interestId);
    }

    public function getAllProfiles(): array
    {
        $activeUsers = $this->userService->listActiveUsers();

        $profiles = $activeUsers->map(function ($user) {
            return $this->profileRepository->getOrCreateProfile($user->id);
        });

        return $profiles->toArray();
    }
}
