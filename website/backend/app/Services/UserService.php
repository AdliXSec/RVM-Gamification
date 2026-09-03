<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class UserService
{
    public function getLeaderboard(int $limit = 10): Collection
    {
        return User::topPlayers($limit)->get(['id', 'name', 'nim', 'role', 'character', 'points']);
    }

    public function getHistory(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return Transaction::where('user_id', $userId)
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }

    public function getAllHistory(int $perPage = 15): LengthAwarePaginator
    {
        return Transaction::with('user')
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }

    public function getCampusStats(): array
    {
        return Cache::remember('campus_stats', 3600, function () {
            $totalBottles = Transaction::earnings()->sum('bottles_count');

            return [
                'total_bottles' => (int) $totalBottles,
                'total_co2_saved' => round($totalBottles * 0.04, 2),
                'total_filament' => round($totalBottles * 0.2, 2),
            ];
        });
    }
}
