<?php

namespace App\Repositories\Contracts;

interface PublicationAccessRepositoryInterface
{
    public function exists(int $pubId, int $profileId): bool;
    public function create(int $pubId, int $profileId): void;
    public function deleteForUsers(int $pubId, array $userIds): array;
}
