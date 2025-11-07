<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $publication_id
 * @property int $interest_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class PublicationInterest extends Model
{
    use HasFactory;

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'publication_id',
        'interest_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'id',
            'publication_id' => 'integer',
            'interest_id' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Get the publication associated with this interest.
     */
    public function publication(): BelongsTo
    {
        return $this->belongsTo(Publication::class);
    }

    public function __toString(): string
    {
        return sprintf(
            "PublicationInterest #%d: %s on publication %s",
            $this->interest_id ?? $this->getKey(),
            $this->interest ?? 'No interest',
            $this->publication?->title ?? $this->publication_id ?? 'Unknown publication'
        );
    }
}
