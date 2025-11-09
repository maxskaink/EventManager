<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

/**
 * @property int $user_id
 * @property string $name
 * @property string $issuing_organization
 * @property Carbon $issue_date
 * @property Carbon|null $expiration_date
 * @property string|null $credential_id
 * @property string|null $credential_url
 * @property bool $does_not_expire
 * @property bool $deleted
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Certificate extends Model
{
    use HasFactory;

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
        'user_id',
        'name',
        'issuing_organization',
        'issue_date',
        'expiration_date',
        'credential_id',
        'credential_url',
        'does_not_expire',
        'deleted',
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
            'issue_date' => 'date',
            'expiration_date' => 'date',
            'does_not_expire' => 'boolean',
            'deleted' => 'boolean',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Get the user who owns this certificate.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * String representation of the certificate for debugging/logging.
     */
    public function __toString(): string
    {
        $userName = Auth::user()?->name ?? 'Unknown user';
        return sprintf(
            'Certificate for %s: %s issued by %s on %s%s',
            $userName,
            $this->name,
            $this->issuing_organization,
            $this->issue_date?->format('Y-m-d') ?? 'Unknown date',
            $this->deleted ? ' [Deleted]' : ''
        );
    }
}
