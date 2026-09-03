<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * Usage: middleware('role:admin') or middleware('role:admin,officer')
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user('api');

        if (!$user || !in_array($user->role, $roles, true)) {
            return response()->json([
                'message' => 'Anda tidak memiliki akses untuk fitur ini.',
            ], 403);
        }

        return $next($request);
    }
}
