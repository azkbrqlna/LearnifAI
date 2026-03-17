<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseModule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CourseController extends Controller
{
 
    public function generatePage()
    {
        return Inertia::render('Generate');
    }

    public function index(Request $request, $slug)
    {
        $user = $request->user();

        $course = Course::with('course_modules')
            ->where('user_id', $user->id)
            ->where('slug', $slug)
            ->firstOrFail();

        return Inertia::render('Courses/Index', [
            'course' => $course,
            'course_modules' => $course->course_modules, 
            'auth' => ['user' => $user],
            'slug' => $slug,
        ]);
    }

    /**
     * Generate courses dan modules via Gemini.
     */
    public function generateCourse(Request $request)
    {
        $request->validate([
            'topic' => 'required|string|max:255',
        ]);

        // 1. Buat slug dari topik yang diinput
        $slug = Str::slug($request->topic);
        $user = $request->user();

        // 2. Cek apakah course dengan slug ini sudah pernah digenerate oleh user
        $existingCourse = Course::where('slug', $slug)
            ->where('user_id', $user->id)
            ->first();

        // 3. Jika sudah ada, langsung redirect ke halaman course tersebut
        if ($existingCourse) {
            return redirect()->route('courses.index', ['slug' => $slug])
                ->with('info', 'Course sudah pernah di-generate sebelumnya.');
        }

        // --- KODE LAMA DI BAWAH INI TETAP SAMA ---
        $prompt = "
        Buatkan kursus tentang topik '{$request->topic}' dalam format JSON berikut:
        [
        {
            \"title\": \"Judul Kursus Utama\",
            \"description\": \"Deskripsi kursus.\",
            \"modules\": [
            {
                \"title\": \"Judul Modul\",
                \"description\": \"Deskripsi singkat modul.\"
            },
            ]
        }
    ]

    Kembalikan **hanya** JSON array tanpa teks tambahan.
    Pastikan JSON valid dan mudah di-decode oleh JSON parser PHP.
    Modules hanya 5 saja.
    ";

        $response = Http::timeout(60)
            ->withHeaders(['Content-Type' => 'application/json'])
            ->post(env('GEMINI_API_URL') . env('GEMINI_API_KEY'), [
                'contents' => [
                    [
                        'parts' => [['text' => $prompt]]
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
            $course = Course::create([
                'title' => $courseData['title'],
                'slug' => $slug, // Menggunakan slug yang sudah dicek di atas
                'description' => $courseData['description'] ?? null,
                'user_id' => $request->user()->id,
            ]);

            if (isset($courseData['modules']) && is_array($courseData['modules'])) {
                foreach ($courseData['modules'] as $module) {
                    CourseModule::create([
                        'course_id' => $course->id,
                        'title' => $module['title'],
                        'description' => $module['description'] ?? null,
                    ]);
                }
            }
        }

        return redirect()->route('courses.index', ['slug' => $slug])->with('success', 'Courses created successfully.');
    }
}
