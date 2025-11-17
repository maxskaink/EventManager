<?php

namespace App\Services\Implementations;

use App\Repositories\Contracts\ProfileRepositoryInterface;
use App\Services\Contracts\ProfileServiceInterface;
use App\Models\Profile;
use Illuminate\Support\Facades\DB;

class ProfileService implements ProfileServiceInterface
{
    protected ProfileRepositoryInterface $profileRepository;

    public function __construct(ProfileRepositoryInterface $profileRepository)
    {
        $this->profileRepository = $profileRepository;
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
}
