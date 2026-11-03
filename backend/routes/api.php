<?php

use App\Http\Controllers\AiRecommendationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\OpenLibraryController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Library Management System
|--------------------------------------------------------------------------
*/

// Health check
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'app' => config('app.name'),
        'timestamp' => now()->toIso8601String(),
    ]);
});

// 1. PUBLIC ROUTES (Katalog, kategori, & ringkasan umum)
Route::get('/books', [BookController::class, 'index']);
Route::get('/books/{id}', [BookController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::get('/dashboard/overview', [DashboardController::class, 'userOverview']);

// Open Library Search (Publik / User & Admin)
Route::get('/open-library/search', [OpenLibraryController::class, 'search']);

// AI Services (Publik / User & Admin)
Route::prefix('ai')->group(function () {
    Route::get('/status', [AiRecommendationController::class, 'status']);
    Route::post('/recommend', [AiRecommendationController::class, 'recommend']);
    Route::post('/chat', [AiRecommendationController::class, 'chat']);
});

// 2. AUTHENTICATION ROUTES
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

// 3. AUTHENTICATED USER ROUTES
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites/toggle/{bookId}', [FavoriteController::class, 'toggle']);
    Route::delete('/favorites/{bookId}', [FavoriteController::class, 'destroy']);
});

// 4. ADMIN ONLY ROUTES (auth:sanctum + role:admin)
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    // Admin Dashboard Stats
    Route::get('/dashboard', [DashboardController::class, 'adminStats']);

    // Admin Book CRUD
    Route::post('/books', [BookController::class, 'store']);
    Route::put('/books/{book}', [BookController::class, 'update']);
    Route::delete('/books/{book}', [BookController::class, 'destroy']);

    // Admin Category CRUD
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

    // Admin Users Management
    Route::get('/users', [UserController::class, 'index']);
    Route::put('/users/{user}/role', [UserController::class, 'updateRole']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']);

    // Admin Open Library Import to Local DB
    Route::post('/open-library/import', [OpenLibraryController::class, 'import']);
});
