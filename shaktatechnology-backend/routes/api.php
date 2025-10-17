<?php

use App\Http\Controllers\API\CareerController;
use App\Http\Controllers\API\FaqController;
use App\Http\Controllers\API\MemberController;
use App\Http\Controllers\API\ProjectController;
use App\Http\Controllers\API\ServiceController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ContactController;
use App\Http\Controllers\API\SettingController;
use App\Http\Controllers\API\GalleryController;
use App\Http\Controllers\API\NewsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Authentication routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Public routes (no authentication required)
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{id}', [ServiceController::class, 'show']);

Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/projects/{id}', [ProjectController::class, 'show']);

Route::get('/members', [MemberController::class, 'index']);
Route::get('/members/{id}', [MemberController::class, 'show']);

Route::get('/faqs', [FaqController::class, 'index']);
Route::get('/faqs/{id}', [FaqController::class, 'show']);

Route::get('/careers', [CareerController::class, 'index']);
Route::get('/careers/{id}', [CareerController::class, 'show']);

Route::get('/contacts', [ContactController::class, 'index']);
Route::get('/contacts/{id}', [ContactController::class, 'show']);

Route::get('/settings', [SettingController::class, 'index']);
Route::get('/settings/{id}', [SettingController::class, 'show']);

Route::get('/galleries',[GalleryController::class, 'index']);
Route::get('/galleries/{id}',[GalleryController::class, 'show']);

Route::get('/news',[NewsController::class, 'index']);
Route::get('/news/{id}',[NewsController::class, 'show']);

// Routes protected by Sanctum
Route::middleware('auth:sanctum')->group(function () {
    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Protected CRUD operations
    Route::apiResource('services', ServiceController::class)->except(['index', 'show']);
    Route::apiResource('projects', ProjectController::class)->except(['index', 'show']);
    Route::apiResource('members', MemberController::class)->except(['index', 'show']);
    Route::apiResource('faqs', FaqController::class)->except(['index', 'show']);
    Route::apiResource('careers', CareerController::class)->except(['index', 'show']);
    Route::apiResource('contacts', ContactController::class)->except(['index', 'show']);
    Route::apiResource('settings', SettingController::class)->except(['index', 'show']);
    Route::apiResource('galleries', GalleryController::class)->except(['index', 'show']);
    Route::apiResource('news',NewsController::class)->except(['index', 'show']);

    // Authenticated user info
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
