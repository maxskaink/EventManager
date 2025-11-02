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
 * @property string $description
 * @property Carbon $issue_date
 * @property string $document_url
 * @property string|null $comment
 * @property bool $deleted
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Certificate extends Model
{
    use HasFactory;

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'user_id';

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
        'description',
        'issue_date',
        'document_url',
        'comment',
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
            'deleted' => 'boolean',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Get the user associated with the certificate.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function __toString(): string
    {
        $userName = Auth::user()?->name ?? 'Unknown user';
        return sprintf(
            "Certificate for %s: %s issued on %s%s",
            $userName,
            $this->name,
            $this->issue_date?->format('Y-m-d') ?? 'Unknown date',
            $this->deleted ? ' [Deleted]' : ''
        );
    }

}
