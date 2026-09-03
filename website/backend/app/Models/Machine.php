<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Machine extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'location',
        'max_capacity',
        'current_bottles',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'max_capacity' => 'integer',
            'current_bottles' => 'integer',
        ];
    }

    // Relationships
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function tickets(): HasMany
    {
        return $this->hasMany(PickUpTicket::class);
    }

    // Accessors
    public function getPercentageAttribute(): int
    {
        if ($this->max_capacity === 0) return 0;
        return (int) round(($this->current_bottles / $this->max_capacity) * 100);
    }

    // Scopes
    public function scopeOnline($query)
    {
        return $query->where('status', 'online');
    }

    // Helpers
    public function isFull(): bool
    {
        return $this->current_bottles >= $this->max_capacity;
    }

    public function isUnderMaintenance(): bool
    {
        return $this->status === 'maintenance';
    }
}
