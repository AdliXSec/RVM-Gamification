<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RewardRedemptionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'cost_at_redemption' => $this->cost_at_redemption,
            'status' => $this->status,
            'reward' => new RewardResource($this->whenLoaded('reward')),
            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'nim' => $this->user->nim,
                ];
            }),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
