<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

abstract class Controller
{
    protected function response(array $data = [], int $status = 200, bool $success = true): JsonResponse
    {
        return response()->json([
            'success' => $success,
            ...$data,
        ], $status);
    }
}
