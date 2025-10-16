<?php

namespace App\Services;

use App\Exceptions\InvalidRoleException;
use App\Models\User;
use InvalidArgumentException;

class UserService
{
    /**
     * Toggle the user's role between 'interested' and 'organizer'.
     *
     * @param int $userID ID of the user to toggle.
     * @param string $newRole Role to set for the user.
     * @return string The new role of the user.
     */
    public function toggleRole(int $userID, string $newRole): string
    {
        $user = User::query()->findOrFail($userID);

        $user->role = $newRole;

        $user->save();

        return $newRole;
    }

}
