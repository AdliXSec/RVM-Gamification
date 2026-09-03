<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MachineResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'location' => $this->location,
            'max_capacity' => $this->max_capacity,
            'current_bottles' => $this->current_bottles,
            'percentage' => $this->percentage,
            'status' => $this->status,
        ];
    }
}
