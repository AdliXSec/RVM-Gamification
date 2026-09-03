<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    public function __construct(
        private readonly AuthService $authService
    ) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $user = $this->authService->register($request->validated());
        $authData = $this->authService->loginUser($user);

        return $this->success([
            'user' => new UserResource($authData['user']),
            'token' => $authData['token'],
        ], 'Registrasi berhasil.', 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $authData = $this->authService->login($request->validated());

        return $this->success([
            'user' => new UserResource($authData['user']),
            'token' => $authData['token'],
        ], 'Login berhasil.');
    }

    public function me(): JsonResponse
    {
        return $this->success([
            'user' => new UserResource($this->authService->me()),
        ]);
    }

    public function logout(): JsonResponse
    {
        $this->authService->logout();

        return $this->success(null, 'Logout berhasil.');
    }

    public function refresh(): JsonResponse
    {
        $tokenData = $this->authService->refresh();

        return $this->success(['token' => $tokenData]);
    }
}
