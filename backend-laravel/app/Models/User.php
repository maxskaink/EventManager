<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Laravel\Sanctum\HasApiTokens;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string|null $google_id
 * @property string|null $avatar
 * @property string $role
 * @property Carbon|null $last_login_at
 * @property Carbon|null $email_verified_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'google_id',
        'avatar',
        'role',
        'last_login_at',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
        ];
    }

    /**
     * Get the user's role.
     *
     * @return string
     */
    public function getRoleAttribute(): string
    {
        return $this->attributes['role'] ?? 'interested';
    }

    /**
     * Set the user's role.
     *
     * @param string $value
     * @return void
     */
    public function setRoleAttribute(string $value): void
    {
        $this->attributes['role'] = $value;
    }

    /**
     * Get a string representation of the user.
     *
     * @return string
     */
    public function __toString(): string
    {
        return sprintf(
            "User #%d: %s <%s> (%s)",
            $this->id ?? $this->getKey(),
            $this->name ?? 'Unknown',
            $this->email ?? 'no-email',
            $this->role ?? 'interested'
        );
    }

    /**
     * Get the profile associated with the user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function profile(): HasOne
    {
        return $this->hasOne(Profile::class, 'user_id');
    }
}
