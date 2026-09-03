<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRewardRequest;
use App\Http\Resources\RewardRedemptionResource;
use App\Http\Resources\RewardResource;
use App\Http\Resources\UserResource;
use App\Models\Reward;
use App\Services\RewardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RewardController extends Controller
{
    public function __construct(
        private readonly RewardService $rewardService
    ) {}

    public function index(): JsonResponse
    {
        $rewards = Reward::active()->get();

        return response()->json([
            'rewards' => RewardResource::collection($rewards),
        ]);
    }

    public function store(StoreRewardRequest $request): JsonResponse
    {
        $reward = Reward::create($request->validated());

        return response()->json([
            'message' => 'Hadiah berhasil ditambahkan.',
            'reward' => new RewardResource($reward),
        ], 201);
    }

    public function redeem(Reward $reward): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = request()->user();

        $redemption = $this->rewardService->redeem($user, $reward);

        return response()->json([
            'message' => 'Hadiah berhasil ditukar!',
            'redemption' => new RewardRedemptionResource($redemption->load('reward')),
            'remaining_points' => $user->fresh()->points,
        ]);
    }

    public function destroy(Reward $reward): JsonResponse
    {
        $reward->delete();

        return response()->json(['message' => 'Hadiah berhasil dihapus.']);
    }


    public function pendingRedemptions(): JsonResponse
    {
        $redemptions = \App\Models\RewardRedemption::with(['user', 'reward'])->where('status', 'pending')->get();
        return $this->success(['redemptions' => \App\Http\Resources\RewardRedemptionResource::collection($redemptions)]);
    }

    public function updateRedemption(Request $request, \App\Models\RewardRedemption $redemption): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:completed,cancelled'
        ]);

        $updated = $this->rewardService->updateRedemptionStatus($redemption, $validated['status']);

        return response()->json([
            'message' => 'Status redemption berhasil diupdate.',
            'redemption' => new \App\Http\Resources\RewardRedemptionResource($updated->load('reward')),
        ]);
    }
}
