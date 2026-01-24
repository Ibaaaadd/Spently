<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ExpenseController;
use App\Http\Controllers\Api\ProfileController;

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('auth/google', [AuthController::class, 'handleGoogleCallback']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('me', [AuthController::class, 'me']);
    
    Route::get('profile', [ProfileController::class, 'show']);
    Route::put('profile', [ProfileController::class, 'update']);
    Route::post('profile/avatar', [ProfileController::class, 'updateAvatar']);
    Route::delete('profile/avatar', [ProfileController::class, 'deleteAvatar']);
    
    Route::apiResource('categories', CategoryController::class);
    
    Route::get('expenses/summary', [ExpenseController::class, 'summary']);
    Route::get('expenses/export', [ExpenseController::class, 'export']);
    Route::apiResource('expenses', ExpenseController::class);
});

Route::get('/health', function () {
    return response()->json([
        'success' => true,
        'message' => 'Spently API is running',
        'timestamp' => now()
    ]);
});
