<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $keyword
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Interest extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'keyword',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Get a string representation of this interest.
     */
    public function __toString(): string
    {
        return sprintf(
            "Interest #%d: %s",
            $this->id ?? $this->getKey(),
            $this->keyword ?? 'Unknown keyword'
        );
    }
}
