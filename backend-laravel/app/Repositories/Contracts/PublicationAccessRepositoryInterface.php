<?php

namespace App\Repositories\Contracts;

interface PublicationAccessRepositoryInterface
{
    /**
     * Check if a profile has access to a publication.
     *
     * @param int $pubId
     * @param int $profileId
     * @return bool
     */
    public function exists(int $pubId, int $profileId): bool;

    /**
     * Grant access to a publication for a profile.
     *
     * @param int $pubId
     * @param int $profileId
     * @return void
     */
    public function create(int $pubId, int $profileId): void;

    /**
     * Revoke access to a publication for multiple users.
     *
     * @param int $pubId
     * @param array $userIds
     * @return array
     */
    public function deleteForUsers(int $pubId, array $userIds): array;
}
