<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\User;

class EventPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role === 'mentor' || $user->role === 'coordinator';
    }

    public function viewByUser(User $authUser, $targetUser): bool
    {
        $targetUserId = $targetUser instanceof User ? $targetUser->id : (int) $targetUser;
        return $authUser->id === $targetUserId || $authUser->role === 'mentor' || $authUser->role === 'coordinator';
    }

    public function create(User $authUser): bool
    {
        return in_array($authUser->role, ['mentor', 'coordinator'], true);
    }

    public function update(User $authUser, Event $event): bool
    {
        return $authUser->id === $event->user_id || in_array($authUser->role, ['mentor', 'coordinator'], true);
    }

    public function delete(User $authUser, Event $event): bool
    {
        return $authUser->id === $event->user_id || in_array($authUser->role, ['mentor', 'coordinator'], true);
    }

    public function markAttendance(User $authUser): bool
    {
        return in_array($authUser->role, ['mentor', 'coordinator'], true);
    }

    public function viewUpcoming(User $user): bool
    {
        return $user->role === 'mentor' || $user->role === 'coordinator';
    }

    public function viewPast(User $user): bool
    {
        return $user->role === 'mentor' || $user->role === 'coordinator';
    }

    /**
     * Determine whether the user can list all participations.
     * (Used in listAllParticipations)
     */
    public function listAllParticipations(User $user): bool
    {
        return in_array($user->role, ['mentor', 'coordinator'], true);
    }

    /**
     * Determine whether the user can view participations of a specific event.
     * (Used in listParticipationsByEvent)
     */
    public function listParticipationsByEvent(User $user, Event $event): bool
    {
        return in_array($user->role, ['mentor', 'coordinator'], true);
    }

    /**
     * Determine whether the user can view participations of a specific user.
     * (Used in listParticipationsByUser)
     */
    public function listParticipationsByUser(User $authUser, $targetUser): bool
    {
        $targetUserId = $targetUser instanceof User ? $targetUser->id : (int) $targetUser;
        return $authUser->id === $targetUserId || in_array($authUser->role, ['mentor', 'coordinator'], true);
    }
}
