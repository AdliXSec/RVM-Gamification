<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\TicketResource;
use App\Models\PickUpTicket;
use App\Services\TicketService;
use Illuminate\Http\JsonResponse;

class TicketController extends Controller
{
    public function __construct(
        private readonly TicketService $ticketService
    ) {}

    public function index(): JsonResponse
    {
        $tickets = PickUpTicket::with(['machine', 'officer'])
            ->active()
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'tickets' => TicketResource::collection($tickets),
        ]);
    }

    public function accept(PickUpTicket $ticket): JsonResponse
    {
        /** @var \App\Models\User $officer */
        $officer = request()->user();

        $updated = $this->ticketService->accept($ticket, $officer);

        return response()->json([
            'message' => 'Tiket di-accept. Silakan menuju lokasi mesin.',
            'ticket' => new TicketResource($updated->load(['machine', 'officer'])),
        ]);
    }

    public function complete(PickUpTicket $ticket): JsonResponse
    {
        $updated = $this->ticketService->complete($ticket);

        return response()->json([
            'message' => 'Evakuasi selesai. Mesin kembali Online.',
            'ticket' => new TicketResource($updated->load(['machine', 'officer'])),
        ]);
    }
}
