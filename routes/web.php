<?php

use App\Http\Controllers\CourseController;
use App\Http\Controllers\AuthController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Landing');
});

Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
Route::post('/register', [AuthController::class, 'register']);

Route::middleware(['auth', 'web'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/courses', [CourseController::class, 'index'])->name('courses.index');
    Route::get('/generate', [CourseController::class, 'generatePage'])->name('generate');
    Route::post('/generate', [CourseController::class, 'generateCourse']);
});