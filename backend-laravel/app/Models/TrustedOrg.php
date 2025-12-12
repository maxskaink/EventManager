<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

/**
 * TrustedOrg Model
 *
 * Represents a trusted organization that can be verified for certificates,
 * events, or publications.
 *
 * @property int $id
 * @property string $org Organization domain/name
 * @property bool $trusted_for_certificate Trusted for certificate issuance
 * @property bool $trusted_for_event Trusted for event management
 * @property bool $trusted_for_article Trusted for articles
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class TrustedOrg extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'trusted_orgs';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'org',
        'trusted_for_certificate',
        'trusted_for_event',
        'trusted_for_article',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'trusted_for_certificate' => 'boolean',
            'trusted_for_event' => 'boolean',
            'trusted_for_article' => 'boolean',
        ];
    }

    /**
     * Scope a query to only include organizations trusted for certificates.
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopeTrustedForCertificate(Builder $query): Builder
    {
        return $query->where('trusted_for_certificate', true);
    }

    /**
     * Scope a query to only include organizations trusted for events.
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopeTrustedForEvent(Builder $query): Builder
    {
        return $query->where('trusted_for_event', true);
    }

    /**
     * Scope a query to only include organizations trusted for articles.
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopeTrustedForArticle(Builder $query): Builder
    {
        return $query->where('trusted_for_article', true);
    }
}
