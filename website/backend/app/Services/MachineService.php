<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Machine;
use App\Models\PickUpTicket;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use App\Models\Setting;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class MachineService
{
    public function deposit(Machine $machine, int $userId, int $bottles): Transaction
    {
        return DB::transaction(function () use ($machine, $userId, $bottles) {
            $lockedMachine = Machine::lockForUpdate()->findOrFail($machine->id);

            if ($lockedMachine->isFull() || $lockedMachine->isUnderMaintenance()) {
                throw new BadRequestHttpException('Mesin tidak tersedia.');
            }

            $actualBottles = min($bottles, $lockedMachine->max_capacity - $lockedMachine->current_bottles);

            if ($actualBottles <= 0) {
                throw new BadRequestHttpException('Mesin sudah penuh.');
            }

            $newBottles = $lockedMachine->current_bottles + $actualBottles;
            $isFull = $newBottles >= $lockedMachine->max_capacity;

            $lockedMachine->update([
                'current_bottles' => $newBottles,
                'status' => $isFull ? 'full' : 'online',
            ]);

            $xpPerBottle = (int) Cache::rememberForever('settings.all', function () {
                return Setting::pluck('value', 'key')->toArray();
            })['xp_per_bottle'] ?? 100;
            $xp = $actualBottles * $xpPerBottle;

            User::where('id', $userId)->increment('points', $xp);

            $transaction = Transaction::create([
                'user_id' => $userId,
                'machine_id' => $machine->id,
                'type' => 'earn',
                'description' => "{$actualBottles} botol masuk ke {$machine->name}",
                'amount' => $xp,
                'bottles_count' => $actualBottles,
                'status' => 'completed',
            ]);

            // Invalidate caches
            Cache::forget('campus_stats');
            Cache::forget('leaderboard');

            // Auto-create ticket if >= 80%
            $percentage = round(($newBottles / $lockedMachine->max_capacity) * 100);
            if ($percentage >= 80) {
                $existingActive = PickUpTicket::where('machine_id', $machine->id)->active()->exists();
                if (!$existingActive) {
                    PickUpTicket::create([
                        'ticket_code' => PickUpTicket::generateCode(),
                        'machine_id' => $machine->id,
                        'capacity_at_issue' => $newBottles,
                        'status' => 'pending',
                    ]);
                }
            }

            return $transaction;
        });
    }

    public function iotDeposit(Machine $machine, int $bottles, string $claimCode): \App\Models\Receipt
    {
        return DB::transaction(function () use ($machine, $bottles, $claimCode) {
            $lockedMachine = Machine::lockForUpdate()->findOrFail($machine->id);

            // Kita biarkan IoT menambah botol meskipun di sistem statusnya full,
            // Karena jika mesin fisik menerima botol, berarti secara fisik belum full atau sudah dikosongkan tanpa konfirmasi app.
            $actualBottles = $bottles;

            $newBottles = $lockedMachine->current_bottles + $actualBottles;
            $isFull = $newBottles >= $lockedMachine->max_capacity;

            $lockedMachine->update([
                'current_bottles' => min($newBottles, $lockedMachine->max_capacity),
                'status' => $isFull ? 'full' : 'online',
            ]);

            $xpPerBottle = (int) Cache::rememberForever('settings.all', function () {
                return Setting::pluck('value', 'key')->toArray();
            })['xp_per_bottle'] ?? 100;
            $xp = $actualBottles * $xpPerBottle;

            $receipt = \App\Models\Receipt::create([
                'claim_code' => $claimCode,
                'machine_id' => $machine->id,
                'bottles_count' => $actualBottles,
                'xp_value' => $xp,
                'is_claimed' => false,
                'expires_at' => now()->addDays(7),
            ]);

            \App\Models\Transaction::create([
                'user_id' => null,
                'machine_id' => $machine->id,
                'receipt_id' => $receipt->id,
                'type' => 'earn',
                'description' => "{$actualBottles} botol masuk ke {$machine->name} (Menunggu Klaim)",
                'amount' => $xp,
                'bottles_count' => $actualBottles,
                'status' => 'pending',
            ]);

            // Invalidate caches
            Cache::forget('campus_stats');
            Cache::forget('leaderboard');

            // Auto-create ticket if >= 80%
            $percentage = round(($newBottles / $lockedMachine->max_capacity) * 100);
            if ($percentage >= 80) {
                $existingActive = PickUpTicket::where('machine_id', $machine->id)->active()->exists();
                if (!$existingActive) {
                    PickUpTicket::create([
                        'ticket_code' => PickUpTicket::generateCode(),
                        'machine_id' => $machine->id,
                        'capacity_at_issue' => $newBottles,
                        'status' => 'pending',
                    ]);
                }
            }

            return $receipt;
        });
    }

    public function updateCapacity(Machine $machine, int $maxCapacity): Machine
    {
        $machine->update(['max_capacity' => $maxCapacity]);

        if ($machine->current_bottles >= $maxCapacity) {
            $machine->update(['status' => 'full']);
        }

        return $machine->fresh();
    }
}
