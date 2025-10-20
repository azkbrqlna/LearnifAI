<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LibraryController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $courses = Course::where('user_id', $user->id)
            ->latest()  
            ->get();

        return Inertia::render('Courses/Library', [
            'courses' => $courses,
        ]);
    }
}
