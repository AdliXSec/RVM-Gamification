<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\DepositRequest;
use App\Http\Requests\UpdateCapacityRequest;
use App\Http\Resources\MachineResource;
use App\Http\Resources\TransactionResource;
use Illuminate\Http\Request;
use App\Models\Machine;
use App\Services\MachineService;
use Illuminate\Http\JsonResponse;

class MachineController extends Controller
{
    public function __construct(
        private readonly MachineService $machineService
    ) {}

    public function index(): JsonResponse
    {
        $machines = Machine::all();

        return $this->success([
            'machines' => MachineResource::collection($machines),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:machines,name',
            'location' => 'nullable|string|max:255',
            'max_capacity' => 'nullable|integer|min:1',
        ]);

        $machine = Machine::create([
            'name' => $data['name'],
            'location' => $data['location'] ?? null,
            'max_capacity' => $data['max_capacity'] ?? 250,
        ]);
        return $this->success(['machine' => new MachineResource($machine)], 'Mesin berhasil ditambahkan.', 201);
    }

    public function deposit(DepositRequest $request, Machine $machine): JsonResponse
    {
        $transaction = $this->machineService->deposit(
            $machine,
            (int) $request->validated('user_id'),
            (int) $request->validated('bottles')
        );

        return $this->success([
            'transaction' => new TransactionResource($transaction),
            'machine' => new MachineResource($machine->fresh()),
        ], 'Penyetoran berhasil.');
    }

    public function iotDeposit(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|exists:machines,name',
            'bottles' => 'required|integer|min:1',
            'claim_code' => 'required|string|unique:receipts,claim_code',
        ]);

        $machine = Machine::where('name', $data['name'])->firstOrFail();
        
        // Simpan struk & update botol menggunakan MachineService
        $receipt = $this->machineService->iotDeposit($machine, (int) $data['bottles'], $data['claim_code']);

        return response()->json([
            'status' => 'success',
            'message' => 'Deposit IoT berhasil dicatat',
            'receipt' => $receipt
        ]);
    }

    public function updateCapacity(UpdateCapacityRequest $request, Machine $machine): JsonResponse
    {
        $updated = $this->machineService->updateCapacity(
            $machine,
            (int) $request->validated('max_capacity')
        );

        return $this->success([
            'machine' => new MachineResource($updated),
        ], 'Kapasitas mesin berhasil diperbarui.');
    }

    public function destroy(Machine $machine): JsonResponse
    {
        $machine->delete();
        return $this->success(null, 'Mesin berhasil dihapus.');
    }
}
