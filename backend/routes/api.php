<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\InvoiceController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');

// Protected routes (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::apiResource('invoices', InvoiceController::class);
    Route::get('/invoices-export', [InvoiceController::class, 'export']);
    Route::post('/invoices-import', [InvoiceController::class, 'import']);
    Route::get('/stats', [InvoiceController::class, 'stats']);
});
