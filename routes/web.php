<?php

use App\Http\Controllers\CourseController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LibraryController;
use App\Http\Controllers\ModuleController;
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
    Route::get('/courses/{slug}', [CourseController::class, 'index'])->name('courses.index');
    Route::get('/generate', [CourseController::class, 'generatePage'])->name('generate');
    Route::post('/generate', [CourseController::class, 'generateCourse']);
    
    Route::get('/library', [LibraryController::class, 'index'])->name('library');


   Route::post('/modules/generate', [ModuleController::class, 'generateModule'])
    ->name('modules.generate');

    Route::get('/courses/{course_slug}/{module_slug}', [ModuleController::class, 'index'])
    ->name('modules.index');

});