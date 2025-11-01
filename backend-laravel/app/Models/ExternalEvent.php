<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

/**
 * @property int $id
 * @property int $user_id
 * @property string $name
 * @property string $description
 * @property Carbon $start_date
 * @property Carbon $end_date
 * @property string $modality
 * @property string $host_organization
 * @property string|null $location
 * @property string|null $participation_url
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class ExternalEvent extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'description',
        'start_date',
        'end_date',
        'modality',
        'host_organization',
        'location',
        'participation_url',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'user_id' => 'integer',
            'start_date' => 'datetime',
            'end_date' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Get the user that owns the external event.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * String representation of the external event.
     */
    public function __toString(): string
    {
        $userName = Auth::user()?->name ?? 'Unknown user';

        return sprintf(
            "External event '%s' organized by %s (%s - %s)%s",
            $this->name,
            $this->host_organization,
            $this->start_date?->format('Y-m-d') ?? 'Unknown start',
            $this->end_date?->format('Y-m-d') ?? 'Unknown end',
            $this->location ? " at {$this->location}" : ''
        );
    }
}
