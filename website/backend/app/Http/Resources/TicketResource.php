<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TicketResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'ticket_code' => $this->ticket_code,
            'capacity_at_issue' => $this->capacity_at_issue,
            'status' => $this->status,
            'machine' => new MachineResource($this->whenLoaded('machine')),
            'officer' => new UserResource($this->whenLoaded('officer')),
            'accepted_at' => $this->accepted_at?->toISOString(),
            'completed_at' => $this->completed_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
