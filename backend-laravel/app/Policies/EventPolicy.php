<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\User;

class EventPolicy
{
    // List all events (any authenticated user)
    public function viewAny(User $user): bool
    {
        return true;
    }

    // View a single event
    public function view(User $user, Event $event): bool
    {
        return true;
    }

    // Create an event
    public function create(User $user): bool
    {
        return in_array($user->role, ['mentor', 'coordinator'], true);
    }

    // Update an event
    public function update(User $user, Event $event): bool
    {
        return $user->id === $event->user_id ||
            in_array($user->role, ['mentor', 'coordinator'], true);
    }

    // Delete an event
    public function delete(User $user, Event $event): bool
    {
        return $user->id === $event->user_id ||
            in_array($user->role, ['mentor', 'coordinator'], true);
    }

    // Self-enrollment only
    public function enroll(User $authUser): bool
    {
        return $authUser->id !== null;
    }

    // Cancel own enrollment
    public function cancelEnrollment(User $authUser): bool
    {
        return $authUser->id !== null;
    }

    // List past events
    public function viewPast(User $user): bool
    {
        return in_array($user->role, ['mentor', 'coordinator'], true);
    }

    // Mark attendance
    public function markAttendance(User $user, Event $event): bool
    {
        return in_array($user->role, ['mentor', 'coordinator'], true);
    }

    // List all participations
    public function listAllParticipations(User $user): bool
    {
        return in_array($user->role, ['mentor', 'coordinator'], true);
    }

    // List participations for a specific event
    public function listParticipationsByEvent(User $user, Event $event): bool
    {
        return in_array($user->role, ['mentor', 'coordinator'], true);
    }


    public function listParticipationsByUser(User $authUser, string $model, int $userId): bool
    {
        return $authUser->id === $user_id ||
            in_array($authUser->role, ['mentor', 'coordinator'], true);
    }

}
