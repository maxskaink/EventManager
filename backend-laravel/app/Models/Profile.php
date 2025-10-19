<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property string|null $university
 * @property string|null $academic_program
 * @property string|null $phone
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Profile extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'university',
        'academic_program',
        'phone',
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
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Get the user that owns this profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function __toString(): string
    {
        return sprintf(
            "Profile #%d: %s (%s)",
            $this->id ?? $this->getKey(),
            $this->user?->name ?? 'Unknown user',
            $this->academic_program ?? $this->university ?? 'No academic info'
        );
    }

}
