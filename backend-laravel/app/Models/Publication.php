<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $author_id
 * @property string $title
 * @property string $content
 * @property string $type
 * @property Carbon $published_at
 * @property string $status
 * @property Carbon $last_modified
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
        'title',
        'content',
        'type',
        'published_at',
        'status',
        'last_modified',
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
            'published_at' => 'date',
            'last_modified' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Get the author associated with this publication.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
