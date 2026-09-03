<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'machine_id',
        'type',
        'description',
        'amount',
        'bottles_count',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'integer',
            'bottles_count' => 'integer',
        ];
    }

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function machine(): BelongsTo
    {
        return $this->belongsTo(Machine::class);
    }

    // Scopes
    public function scopeEarnings($query)
    {
        return $query->where('type', 'earn');
    }

    public function scopeRedeems($query)
    {
        return $query->where('type', 'redeem');
    }
}
