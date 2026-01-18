<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ExpenseController;

// Categories routes
Route::apiResource('categories', CategoryController::class);

// Expenses routes
Route::get('expenses/summary', [ExpenseController::class, 'summary']);
Route::apiResource('expenses', ExpenseController::class);

// Health check
Route::get('/health', function () {
    return response()->json([
        'success' => true,
        'message' => 'Spently API is running',
        'timestamp' => now()
    ]);
});
