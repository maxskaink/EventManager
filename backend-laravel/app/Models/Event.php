<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

class Event extends Model
{
    use HasFactory;

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
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'datetime',
            'end_date' => 'datetime',
            'capacity' => 'integer',
            'publication_id' => 'integer',
            'virtual_url' => 'string',
            'created_at' => 'datetime',
            'updated_at' => 'datetime'
        ];
    }

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

    public function publication(): BelongsTo
    {
        return $this->belongsTo(Publication::class);
    }
}
