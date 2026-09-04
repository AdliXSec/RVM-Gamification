<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\MachineController;
use App\Http\Controllers\Api\V1\RewardController;
use App\Http\Controllers\Api\V1\TicketController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\SettingController;

/*
|--------------------------------------------------------------------------
| RVM API Routes (v1)
|--------------------------------------------------------------------------
|
| Prefix: /api/v1
| Auth: JWT via php-open-source-saver/jwt-auth
| RBAC: role:admin, role:officer,admin, etc.
|
*/

Route::prefix('v1')->group(function () {

    // ─── Public (No Auth) ────────────────────────────────────────
    Route::get('settings', [SettingController::class, 'index']);
    Route::post('auth/register', [AuthController::class, 'register']);
    Route::post('auth/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
    Route::get('users/leaderboard', [UserController::class, 'leaderboard']);
    Route::get('users/campus-stats', [UserController::class, 'campusStats']);
    Route::get('machines', [MachineController::class, 'index']);
    Route::get('faqs', [\App\Http\Controllers\Api\V1\FaqController::class, 'index']);
    Route::get('guides', [\App\Http\Controllers\Api\V1\GuideController::class, 'index']);
    Route::get('notifications', [\App\Http\Controllers\Api\V1\NotificationController::class, 'index']);
    Route::post('iot/deposit', [MachineController::class, 'iotDeposit']);

    // ─── Authenticated ───────────────────────────────────────────
    Route::middleware('auth:api')->group(function () {

        // Auth
        Route::get('auth/me', [AuthController::class, 'me']);
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::post('auth/refresh', [AuthController::class, 'refresh']);

        // Settings
        Route::post('settings', [SettingController::class, 'update'])->middleware('role:admin');
        
        // Receipts (Claiming points from RVM machine)
        Route::post('receipts/claim', [\App\Http\Controllers\Api\V1\ReceiptController::class, 'claim']);

        // CMS (FAQ & Guides)
        Route::post('faqs', [\App\Http\Controllers\Api\V1\FaqController::class, 'store'])->middleware('role:admin');
        Route::patch('faqs/{faq}', [\App\Http\Controllers\Api\V1\FaqController::class, 'update'])->middleware('role:admin');
        Route::delete('faqs/{faq}', [\App\Http\Controllers\Api\V1\FaqController::class, 'destroy'])->middleware('role:admin');
        
        Route::post('guides', [\App\Http\Controllers\Api\V1\GuideController::class, 'store'])->middleware('role:admin');
        Route::patch('guides/{guide}', [\App\Http\Controllers\Api\V1\GuideController::class, 'update'])->middleware('role:admin');
        Route::delete('guides/{guide}', [\App\Http\Controllers\Api\V1\GuideController::class, 'destroy'])->middleware('role:admin');


        // Users & Gamification (All authenticated users)
        Route::get('users/history', [UserController::class, 'history']);
        Route::get('users/history/all', [UserController::class, 'allHistory'])->middleware('role:admin');
        Route::get('users/students', [UserController::class, 'students'])->middleware('role:admin');

        // Machines (Read: all, Write: admin/IoT)
        Route::post('machines', [MachineController::class, 'store'])->middleware('role:admin');
        Route::delete('machines/{machine}', [MachineController::class, 'destroy'])->middleware('role:admin');
        Route::post('machines/{machine}/deposit', [MachineController::class, 'deposit']);
        Route::patch('machines/{machine}/capacity', [MachineController::class, 'updateCapacity'])
            ->middleware('role:admin');

        // Rewards (Read: all, Write: admin, Redeem: student)
        Route::get('rewards', [RewardController::class, 'index']);
        Route::post('rewards', [RewardController::class, 'store'])
            ->middleware('role:admin');
        Route::post('rewards/{reward}/redeem', [RewardController::class, 'redeem'])
            ->middleware('throttle:5,1');
        Route::delete('rewards/{reward}', [RewardController::class, 'destroy'])
            ->middleware('role:admin');
        Route::get('rewards/redemptions/pending', [RewardController::class, 'pendingRedemptions'])->middleware('role:admin');
        Route::patch('rewards/redemptions/{redemption}', [RewardController::class, 'updateRedemption'])->middleware('role:admin');

        // Tickets (Admin & Officer only)
        Route::middleware('role:admin,officer')->group(function () {
            Route::get('tickets', [TicketController::class, 'index']);
            Route::patch('tickets/{ticket}/accept', [TicketController::class, 'accept']);
            Route::patch('tickets/{ticket}/complete', [TicketController::class, 'complete']);
        });
    });
});
