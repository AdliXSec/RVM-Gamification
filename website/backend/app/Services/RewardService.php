<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Reward;
use App\Models\RewardRedemption;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class RewardService
{
    public function redeem(User $user, Reward $reward): RewardRedemption
    {
        return DB::transaction(function () use ($user, $reward) {
            // Pessimistic Lock on user row
            $lockedUser = User::lockForUpdate()->findOrFail($user->id);

            if ($lockedUser->points < $reward->cost) {
                throw new BadRequestHttpException('XP tidak cukup untuk menukar hadiah ini.');
            }

            if (!$reward->is_active) {
                throw new BadRequestHttpException('Hadiah sudah tidak tersedia.');
            }

            // Deduct points
            $lockedUser->decrement('points', $reward->cost);

            // Create redemption record with historical cost
            $redemption = RewardRedemption::create([
                'user_id' => $lockedUser->id,
                'reward_id' => $reward->id,
                'cost_at_redemption' => $reward->cost,
                'status' => 'pending',
            ]);

            // Log to transactions
            Transaction::create([
                'user_id' => $lockedUser->id,
                'type' => 'redeem',
                'description' => "Tukar: {$reward->name}",
                'amount' => -$reward->cost,
                'status' => 'completed',
            ]);

            Cache::forget('leaderboard');

            return $redemption;
        });
    }

    public function updateRedemptionStatus(RewardRedemption $redemption, string $status): RewardRedemption
    {
        if ($status === 'cancelled' && $redemption->status === 'pending') {
            // Refund XP if cancelled
            User::where('id', $redemption->user_id)->increment('points', $redemption->cost_at_redemption);

            Transaction::create([
                'user_id' => $redemption->user_id,
                'type' => 'earn',
                'description' => "Refund: {$redemption->reward->name}",
                'amount' => $redemption->cost_at_redemption,
                'status' => 'completed',
            ]);

            Cache::forget('leaderboard');
        }

        $redemption->update(['status' => $status]);
        return $redemption;
    }
}
