<?php

namespace App\Http\Controllers;

use App\Traits\ApiResponse;

/**
 * @method \Illuminate\Http\JsonResponse success(mixed $data = null, string $message = 'Success', int $code = 200)
 * @method \Illuminate\Http\JsonResponse error(string $message = 'Error', int $code = 400, mixed $errors = null)
 */
abstract class Controller
{
    use ApiResponse;
}
