<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $profile_id
 * @property string $title
 * @property string $message
 * @property string $type
 * @property string $status
 * @property Carbon|null $read_at
 * @property string|null $url
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Notification extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'profile_id',
        'title',
        'message',
        'type',
        'status',
        'read_at',
        'url',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'profile_id' => 'integer',
            'read_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Get the profile associated with this notification.
     */
    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class);
    }

    public function __toString(): string
    {
        return sprintf(
            "Notification #%d: %s - %s",
            $this->id ?? $this->getKey(),
            $this->title ?? 'No title',
            $this->profile?->user?->name ?? ($this->profile?->id ?? 'Unknown profile')
        );
    }
}
