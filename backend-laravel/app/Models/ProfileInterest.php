<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property int $interest_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class ProfileInterest extends Model
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
        'id',
        'user_id',
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
            'interest_id' => 'integer',
            'user_id' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Get the user that owns this interest.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    public function __toString(): string
    {
        return sprintf(
            "ProfileInterest #%d: %s by %s",
            $this->interest_id ?? $this->getKey(),
            $this->keyword ?? 'No keyword',
            $this->user?->name ?? 'Unknown user'
        );
    }

}
