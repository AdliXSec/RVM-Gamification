<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\TransactionResource;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function __construct(
        private readonly UserService $userService
    ) {}

    public function leaderboard(): JsonResponse
    {
        $leaders = $this->userService->getLeaderboard();

        return $this->success([
            'leaderboard' => UserResource::collection($leaders),
        ]);
    }

    public function history(): JsonResponse
    {
        $userId = request()->user()->id;
        $history = $this->userService->getHistory((int) $userId);

        return $this->success(
            TransactionResource::collection($history)->response()->getData(true)
        );
    }

    public function allHistory(): JsonResponse
    {
        $history = $this->userService->getAllHistory();
        return $this->success(
            TransactionResource::collection($history)->response()->getData(true)
        );
    }

    public function campusStats(): JsonResponse
    {
        return $this->success([
            'stats' => $this->userService->getCampusStats(),
        ]);
    }


    public function students(): \Illuminate\Http\JsonResponse
    {
        $students = \App\Models\User::students()->select(['id', 'name', 'nim'])->orderBy('name')->get();
        return $this->success(['students' => $students]);
    }
}
