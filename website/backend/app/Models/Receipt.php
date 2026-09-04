<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Receipt extends Model
{
    protected $fillable = [
        'claim_code',
        'machine_id',
        'bottles_count',
        'xp_value',
        'is_claimed',
        'claimed_by',
        'claimed_at',
        'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'is_claimed' => 'boolean',
            'claimed_at' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    public function machine(): BelongsTo
    {
        return $this->belongsTo(Machine::class);
    }

    public function claimer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'claimed_by');
    }
}
