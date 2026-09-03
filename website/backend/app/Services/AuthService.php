<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class AuthService
{
    public function register(array $data): User
    {
        return User::create([
            'name' => $data['name'],
            'nim' => $data['nim'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'character' => $data['character'] ?? 'ninja.png',
            'role' => 'student',
        ]);
    }

    public function login(array $credentials): array
    {
        $token = JWTAuth::attempt($credentials);

        if (!$token) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        return [
            'user' => JWTAuth::user(),
            'token' => $this->respondWithToken((string) $token)
        ];
    }

    public function loginUser(User $user): array
    {
        $token = JWTAuth::fromUser($user);
        return [
            'user' => $user,
            'token' => $this->respondWithToken((string) $token)
        ];
    }

    public function me(): User
    {
        /** @var User $user */
        $user = JWTAuth::parseToken()->authenticate();
        return $user;
    }

    public function logout(): void
    {
        JWTAuth::invalidate(JWTAuth::getToken());
    }

    public function refresh(): array
    {
        $token = JWTAuth::parseToken()->refresh();
        return $this->respondWithToken((string) $token);
    }

    private function respondWithToken(string $token): array
    {
        return [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => (int) config('jwt.ttl') * 60,
        ];
    }
}
