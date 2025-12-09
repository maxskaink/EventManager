<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $publication_id
 * @property string $name
 * @property string $description
 * @property Carbon $start_date
 * @property Carbon $end_date
 * @property string $event_type
 * @property string $modality
 * @property string|null $location
 * @property string|null $virtual_url
 * @property string $status
 * @property int|null $capacity
 * @property int $enrolled_participants
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Event extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'publication_id',
        'name',
        'description',
        'start_date',
        'end_date',
        'event_type',
        'modality',
        'location',
        'virtual_url',
        'status',
        'capacity',
        'enrolled_participants',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'start_date' => 'datetime',
            'end_date' => 'datetime',
            'capacity' => 'integer',
            'enrolled_participants' => 'integer',
            'publication_id' => 'integer',
            'virtual_url' => 'string',
            'created_at' => 'datetime',
            'updated_at' => 'datetime'
        ];
    }

    /**
     * Get a string representation of the event.
     *
     * @return string
     */
    public function __toString(): string
    {
        return sprintf(
            "Event #%d: %s (%s - %s)",
            $this->id,
            $this->name,
            $this->start_date?->format('Y-m-d'),
            $this->end_date?->format('Y-m-d')
        );
    }

    /**
     * Get the publication associated with the event.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function publication(): BelongsTo
    {
        return $this->belongsTo(Publication::class);
    }
}
