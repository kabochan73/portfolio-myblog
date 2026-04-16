<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// 認証
Route::post('/login', [App\Http\Controllers\Api\AuthController::class, 'login']);

// 公開エンドポイント
Route::get('/posts', [App\Http\Controllers\Api\PostController::class, 'index']);
Route::get('/posts/{slug}', [App\Http\Controllers\Api\PostController::class, 'show']);
Route::get('/tags', [App\Http\Controllers\Api\TagController::class, 'index']);

// 管理者エンドポイント（要認証）
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [App\Http\Controllers\Api\AuthController::class, 'logout']);

    Route::get('/admin/posts', [App\Http\Controllers\Api\PostController::class, 'adminIndex']);
    Route::get('/admin/posts/drafts', [App\Http\Controllers\Api\PostController::class, 'adminDrafts']);
    Route::post('/admin/posts', [App\Http\Controllers\Api\PostController::class, 'store']);
    Route::put('/admin/posts/{id}', [App\Http\Controllers\Api\PostController::class, 'update']);
    Route::delete('/admin/posts/{id}', [App\Http\Controllers\Api\PostController::class, 'destroy']);

    Route::post('/admin/tags', [App\Http\Controllers\Api\TagController::class, 'store']);
    Route::delete('/admin/tags/{id}', [App\Http\Controllers\Api\TagController::class, 'destroy']);
});
