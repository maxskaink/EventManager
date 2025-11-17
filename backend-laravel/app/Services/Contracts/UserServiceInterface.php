<?php

namespace App\Services\Contracts;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

interface UserServiceInterface
{
    /**
     * Toggle the user's role.
     *
     * @param int $userID
     * @param string $newRole
     * @return string The new role.
     */
    public function toggleRole(int $userID, string $newRole): string;

    /**
     * @return Collection<int, User>
     */
    public function listActiveUsers(): Collection;

    /**
     * @return Collection<int, User>
     */
    public function listActiveInterested(): Collection;

    /**
     * @return Collection<int, User>
     */
    public function listActiveMembers(): Collection;

    /**
     * @return Collection<int, User>
     */
    public function listActiveSeeds(): Collection;

    /**
     * @return Collection<int, User>
     */
    public function listActiveCoordinators(): Collection;

    /**
     * @return Collection<int, User>
     */
    public function listActiveMentors(): Collection;

    /**
     * @return Collection<int, User>
     */
    public function listInactiveUsers(): Collection;
}
