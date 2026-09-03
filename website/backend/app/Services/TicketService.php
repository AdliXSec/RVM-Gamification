<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Machine;
use App\Models\PickUpTicket;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class TicketService
{
    public function accept(PickUpTicket $ticket, User $officer): PickUpTicket
    {
        if ($ticket->status !== 'pending') {
            throw new BadRequestHttpException('Tiket ini sudah ditangani.');
        }

        return DB::transaction(function () use ($ticket, $officer) {
            $ticket->update([
                'officer_id' => $officer->id,
                'status' => 'accepted',
                'accepted_at' => now(),
            ]);

            Machine::where('id', $ticket->machine_id)->update(['status' => 'maintenance']);

            return $ticket->fresh();
        });
    }

    public function complete(PickUpTicket $ticket): PickUpTicket
    {
        if ($ticket->status !== 'accepted') {
            throw new BadRequestHttpException('Tiket harus di-accept terlebih dahulu.');
        }

        return DB::transaction(function () use ($ticket) {
            $ticket->update([
                'status' => 'completed',
                'completed_at' => now(),
            ]);

            Machine::where('id', $ticket->machine_id)->update([
                'current_bottles' => 0,
                'status' => 'online',
            ]);

            return $ticket->fresh();
        });
    }
}
