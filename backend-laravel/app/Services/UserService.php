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
     * @param string $newRole Role to set for the user.
     * @return string The new role of the user.
     * @throws InvalidRoleException If the user is not a mentor.
     */
    public function toggleRole(string $newRole): string
    {
        /** @var User|null $user */
        $user = auth()->user();

        if ($user->getRoleAttribute() != 'mentor') {
            throw new InvalidRoleException('Invalid role to perform this action.');
        }

        if (!in_array($newRole, ['interested', 'member', 'coordinator','mentor']) ) {
            throw new InvalidArgumentException('Invalid role provided.');
        }

        $user->setRoleAttribute($newRole);
        $user->save();

        return $newRole;
    }
}
