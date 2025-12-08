<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\User;

class EventPolicy
{
    /**
     * Determine whether the user can view any events.
     *
     * @param User $user
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view a single event.
     *
     * @param User $user
     * @param Event $event
     * @return bool
     */
    public function view(User $user, Event $event): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create an event.
     *
     * @param User $user
     * @return bool
     */
    public function create(User $user): bool
    {
        return in_array($user->role, ['mentor', 'coordinator'], true);
    }

    /**
     * Determine whether the user can update an event.
     *
     * @param User $user
     * @param Event $event
     * @return bool
     */
    public function update(User $user, Event $event): bool
    {
        return $user->id === $event->user_id ||
            in_array($user->role, ['mentor', 'coordinator'], true);
    }

    /**
     * Determine whether the user can delete an event.
     *
     * @param User $user
     * @param Event $event
     * @return bool
     */
    public function delete(User $user, Event $event): bool
    {
        return $user->id === $event->user_id ||
            in_array($user->role, ['mentor', 'coordinator'], true);
    }

    /**
     * Determine whether the user can enroll in an event.
     *
     * @param User $authUser
     * @return bool
     */
    public function enroll(User $authUser): bool
    {
        return $authUser->id !== null;
    }

    /**
     * Determine whether the user can cancel their enrollment.
     *
     * @param User $authUser
     * @return bool
     */
    public function cancelEnrollment(User $authUser): bool
    {
        return $authUser->id !== null;
    }

    /**
     * Determine whether the user can view past events.
     *
     * @param User $user
     * @return bool
     */
    public function viewPast(User $user): bool
    {
        return in_array($user->role, ['mentor', 'coordinator'], true);
    }

    /**
     * Determine whether the user can mark attendance for an event.
     *
     * @param User $user
     * @param Event $event
     * @return bool
     */
    public function markAttendance(User $user, Event $event): bool
    {
        return in_array($user->role, ['mentor', 'coordinator'], true);
    }

    /**
     * Determine whether the user can list all participations.
     *
     * @param User $user
     * @return bool
     */
    public function listAllParticipations(User $user): bool
    {
        return in_array($user->role, ['mentor', 'coordinator'], true);
    }

    /**
     * Determine whether the user can list participations for a specific event.
     *
     * @param User $user
     * @param Event $event
     * @return bool
     */
    public function listParticipationsByEvent(User $user, Event $event): bool
    {
        return in_array($user->role, ['mentor', 'coordinator'], true);
    }

    /**
     * Determine whether the user can list participations for a specific user.
     *
     * @param User $authUser
     * @param string $model
     * @param int $userId
     * @return bool
     */
    public function listParticipationsByUser(User $authUser, string $model, int $userId): bool
    {
        return $authUser->id === $userId ||
            in_array($authUser->role, ['mentor', 'coordinator'], true);
    }
}
