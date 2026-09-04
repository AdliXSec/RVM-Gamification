<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Reward;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    public function index(): JsonResponse
    {
        // 12 hours limit
        $timeLimit = now()->subHours(12);

        $rewards = Reward::where('created_at', '>=', $timeLimit)->get();
        
        $transactions = Transaction::with('user:id,name')
                            ->whereIn('type', ['earn', 'redeem'])
                            ->where('created_at', '>=', $timeLimit)
                            ->latest()
                            ->take(50)
                            ->get();

        $notifs = collect();

        foreach($rewards as $r) {
            $notifs->push([
                'id' => 'rew_'.$r->id,
                'type' => 'reward',
                'message' => "NEW REWARD: {$r->name}",
                'timestamp' => $r->created_at
            ]);
        }

        foreach($transactions as $t) {
            $name = $t->user ? $t->user->name : 'Seseorang';
            // Extract first name for brevity
            $shortName = explode(' ', trim($name))[0];
            
            if ($t->type === 'redeem') {
                $notifs->push([
                    'id' => 'trx_'.$t->id,
                    'type' => 'redeem',
                    'message' => "{$shortName} menukarkan hadiah (" . abs($t->amount) . " XP)",
                    'timestamp' => $t->created_at
                ]);
            } else if ($t->type === 'earn') {
                if ($t->bottles_count > 0) {
                    $notifs->push([
                        'id' => 'trx_'.$t->id,
                        'type' => 'deposit',
                        'message' => "{$shortName} mendaur ulang {$t->bottles_count} botol (+{$t->amount} XP)",
                        'timestamp' => $t->created_at
                    ]);
                }
                // Jika bottles_count == 0 (seperti refund dari admin), kita tidak perlu memunculkannya di feed publik
            }
        }

        $notifs = $notifs->sortByDesc('timestamp')->values();

        return $this->success(['notifications' => $notifs]);
    }
}
