<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'nim' => $this->nim,
            'email' => $this->when($this->id === request()->user()?->id, $this->email),
            'role' => $this->role,
            'character' => $this->character,
            'points' => $this->points,
            'level' => $this->getLevel(),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
