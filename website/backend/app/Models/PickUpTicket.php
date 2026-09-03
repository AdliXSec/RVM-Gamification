<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PickUpTicket extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_code',
        'machine_id',
        'officer_id',
        'capacity_at_issue',
        'status',
        'accepted_at',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'capacity_at_issue' => 'integer',
            'accepted_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    // Relationships
    public function machine(): BelongsTo
    {
        return $this->belongsTo(Machine::class);
    }

    public function officer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'officer_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->whereIn('status', ['pending', 'accepted']);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    // Helpers
    public static function generateCode(): string
    {
        return 'TCK-' . str_pad((string) random_int(1, 9999), 4, '0', STR_PAD_LEFT);
    }
}
