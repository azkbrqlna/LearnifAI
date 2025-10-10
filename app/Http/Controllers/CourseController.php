<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function generatePage()
    {
        return Inertia::render('Generate');
    }

    public function index()
    {
         $user = auth()->user();

        // Ambil hanya course milik user yang sedang login
        $courses = Course::where('user_id', $user->id)->get();

        return Inertia::render('Courses/Index', [
            'courses' => $courses,
            'auth' => [
                'user' => $user,
            ],
        ]);
    }

    public function generateCourse(Request $request)
    {
        $request->validate([
            'topic' => 'required|string',
        ]);

        $prompt = "Buatkan 5 judul kursus tentang '{$request->topic}' dengan format JSON array seperti contoh berikut:\n\n" .
            "[{\"title\": \"Judul Kursus 1\", \"description\": \"Deskripsi singkat kursus 1\"}, " .
            "{\"title\": \"Judul Kursus 2\", \"description\": \"Deskripsi singkat kursus 2\"}]\n\n" .
            "Hanya kembalikan JSON array tanpa teks lain.";

        $response = Http::timeout(60)->withHeaders([
            'Content-Type' => 'application/json',
        ])->post(env('GEMINI_API_URL') . env('GEMINI_API_KEY'), [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt]
                    ]
                ]
            ]
        ]);

        if (!$response->successful()) {
            return back()->withErrors(['topic' => 'Failed to get response from Gemini']);
        }

        $text = $response->json()['candidates'][0]['content']['parts'][0]['text'] ?? null;
        $cleaned = preg_replace('/^```json\s*|\s*```$/', '', trim($text));
        $data = json_decode($cleaned, true);

        if (json_last_error() !== JSON_ERROR_NONE || !is_array($data)) {
            return back()->withErrors(['topic' => 'Invalid response format']);
        }

        foreach ($data as $courseData) {
            Course::create([
                'title' => $courseData['title'],
                'description' => $courseData['description'],
                'user_id' => $request->user()->id,
            ]);
        }

        return redirect()->route('courses.index')->with('success', 'Courses created successfully');
        
    }

}
