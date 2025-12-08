<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $author_id
 * @property int|null $event_id
 * @property string $title
 * @property string $content
 * @property string $type
 * @property string $status
 * @property string|null $image_url
 * @property string|null $summary
 * @property string $visibility
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Publication extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'author_id',
        'event_id',
        'title',
        'content',
        'type',
        'status',
        'image_url',
        'summary',
        'visibility',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'author_id' => 'integer',
            'event_id' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Get the author of the publication.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Get the event associated with the publication.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class, 'event_id');
    }

    /**
     * The interests associated with the publication.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function interests(): BelongsToMany
    {
        return $this->belongsToMany(
            Interest::class,
            'publication_interests',
            'publication_id',
            'interest_id'
        );
    }

    /**
     * Get a string representation of the publication.
     *
     * @return string
     */
    public function __toString(): string
    {
        $author = $this->author?->name ?? 'Unknown author';

        $eventInfo = $this->event
            ? "Event: {$this->event->id} - {$this->event->title}"
            : "No associated event";

        return sprintf(
            "Publication #%d: %s by %s | %s",
            $this->id ?? $this->getKey(),
            $this->title ?? 'Untitled',
            $author,
            $eventInfo
        );
    }
}
