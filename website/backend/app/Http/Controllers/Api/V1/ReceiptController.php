<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Receipt;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class ReceiptController extends Controller
{
    public function claim(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'claim_code' => 'required|string'
        ]);

        $code = strtoupper(trim($validated['claim_code']));

        /** @var User $user */
        $user = $request->user();

        return DB::transaction(function () use ($code, $user) {
            $receipt = Receipt::where('claim_code', $code)->lockForUpdate()->first();

            if (!$receipt) {
                return response()->json(['message' => 'Kode struk tidak valid.'], 404);
            }

            if ($receipt->is_claimed) {
                return response()->json(['message' => 'Struk ini sudah diklaim.'], 400);
            }

            if (now()->greaterThan($receipt->expires_at)) {
                return response()->json(['message' => 'Kode struk sudah kedaluwarsa.'], 400);
            }

            // Claim it
            $receipt->update([
                'is_claimed' => true,
                'claimed_by' => $user->id,
                'claimed_at' => now(),
            ]);

            // Add points
            $user->increment('points', $receipt->xp_value);

            // Log transaction
            Transaction::create([
                'user_id' => $user->id,
                'machine_id' => $receipt->machine_id,
                'type' => 'earn',
                'description' => "Klaim Struk (RVM-{$receipt->machine_id})",
                'amount' => $receipt->xp_value,
                'bottles_count' => $receipt->bottles_count,
                'status' => 'completed',
            ]);

            // Clear cache
            Cache::forget('leaderboard');
            Cache::forget('campus_stats');

            return response()->json([
                'message' => "Klaim berhasil! Mendapatkan {$receipt->xp_value} XP.",
                'receipt' => $receipt,
            ]);
        });
    }
}
