<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue; // optional to queue notifications
use Illuminate\Notifications\Messages\DatabaseMessage;
use App\Models\Publication;

class NewPublicationNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Publication $publication
    ) {}

    /**
     * Define which channels the notification will be delivered through.
     */
    public function via($notifiable): array
    {
        // Using the database channel only
        return ['database'];
    }

    /**
     * Define the data structure stored in the database notifications table.
     */
    public function toDatabase($notifiable): DatabaseMessage
    {
        return new DatabaseMessage([
            'title' => 'New publication matching your interests!',
            'publication_id' => $this->publication->id,
            'publication_title' => $this->publication->title,
            'author_id' => $this->publication->author_id,
            'type' => $this->publication->type,
            'message' => "A new publication related to your interests was added.",
        ]);
    }
}
