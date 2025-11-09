<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'google_id',
        'avatar',
        'role',
        'last_login_at',
        'email_verified_at',
    ];

    protected $hidden = [
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
        ];
    }

    public function getRoleAttribute(): string
    {
        return $this->attributes['role'] ?? 'interested';
    }

    public function setRoleAttribute(string $value): void
    {
        $this->attributes['role'] = $value;
    }

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

    public function profile(): HasOne
    {
        return $this->hasOne(Profile::class, 'user_id');
    }
}
