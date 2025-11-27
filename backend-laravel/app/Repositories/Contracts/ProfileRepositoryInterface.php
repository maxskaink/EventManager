<?php

namespace App\Repositories\Contracts;

use App\Models\Profile;
use App\Models\ProfileInterest;
use Illuminate\Database\Eloquent\Collection;

interface ProfileRepositoryInterface
{
    public function updateOrCreateProfile(int $userId, array $data): Profile;

    public function getOrCreateProfile(int $userId): Profile;

    public function existsProfileInterest(int $userId, int $interestId): bool;

    public function createProfileInterest(int $userId, int $interestId): void;

    public function getAllProfileInterests(int $userId): Collection;

    public function getProfileInterestById(int $userId, int $interestId): ?ProfileInterest;

    public function deleteProfileInterest(int $userId, int $interestId): bool;
    public function getAllProfiles(): Collection;
}
