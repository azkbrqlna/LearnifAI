<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseModule;
use App\Models\Module;
use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class ModuleController extends Controller
{
   public function index($course_slug, $module_slug)
{
    $course = Course::where('slug', $course_slug)->firstOrFail();

    // Cari course module milik course ini
    $courseModule = CourseModule::where('course_id', $course->id)->firstOrFail();

    // Ambil module dan materials
    $module = Module::with('materials')
        ->where('slug', $module_slug)
        ->where('course_modules_id', $courseModule->id)
        ->firstOrFail();

    return inertia('Modules/Index', [
        'course' => $course,
        'module' => $module,
    ]);
}


    public function generateModule(Request $request)
    {
        // Validasi input
        $request->validate([
            'title' => 'required|string|max:255',
        ]);

        // Cari CourseModule berdasarkan title dan muat relasi ke Course
        $courseModule = CourseModule::with('course')->where('title', $request->title)->first();

        if (!$courseModule) {
            return back()->withErrors(['error' => 'Course module dengan judul tersebut tidak ditemukan.']);
        }

        // Pastikan course ada dan punya slug
        $courseSlug = $courseModule->course->slug ?? null;
        if (!$courseSlug) {
            return back()->withErrors(['error' => 'Course terkait tidak memiliki slug.']);
        }

        // Prompt untuk Gemini API
        $prompt = "
        Buatkan 5 module tentang topik '{$courseModule->title}' dalam format JSON berikut:
        [
            {
                \"module_title\": \"Judul Modul 1\",
                \"materials\": [
                    {\"title\": \"Judul Material 1\"},
                    {\"title\": \"Judul Material 2\"},
                    {\"title\": \"Judul Material 3\"},
                    {\"title\": \"Judul Material 4\"},
                    {\"title\": \"Judul Material 5\"}
                ]
            }
        ]
        Pastikan menghasilkan **5 module** (array berisi 5 objek),
        dan setiap module punya **5 materials**.
        Kembalikan **hanya JSON valid** tanpa teks tambahan.
        ";

        // Panggil Gemini API
        $response = Http::timeout(90)
            ->withHeaders(['Content-Type' => 'application/json'])
            ->post(env('GEMINI_API_URL') . env('GEMINI_API_KEY'), [
                'contents' => [
                    [
                        'parts' => [['text' => $prompt]]
                    ]
                ]
            ]);

        if (!$response->successful()) {
            return back()->withErrors(['error' => 'Gagal mendapatkan respons dari Gemini API.']);
        }

        // Ambil teks dari response Gemini
        $text = $response->json()['candidates'][0]['content']['parts'][0]['text'] ?? null;

        // Bersihkan dari tanda ```json ... ```
        $cleaned = preg_replace('/^```json\s*|\s*```$/', '', trim($text));
        $data = json_decode($cleaned, true);

        if (!is_array($data)) {
            return back()->withErrors(['error' => 'Format JSON tidak valid.']);
        }

        // Loop semua modules yang dikembalikan Gemini
        foreach ($data as $mod) {
            $moduleTitle = trim($mod['module_title'] ?? 'Untitled Module');

            $module = Module::create([
                'course_modules_id' => $courseModule->id,
                'title' => $moduleTitle,
                'slug' => Str::slug($moduleTitle),
            ]);

            // Tambahkan materials di setiap module
            if (isset($mod['materials']) && is_array($mod['materials'])) {
                foreach ($mod['materials'] as $mat) {
                    $materialTitle = trim($mat['title'] ?? 'Untitled Material');

                    Material::create([
                        'module_id' => $module->id,
                        'title' => $materialTitle,
                        'content' => null,
                    ]);
                }
            }
        }

        // Ambil module pertama (yang baru saja dibuat)
        $firstModule = Module::where('course_modules_id', $courseModule->id)->first();

        // Redirect ke halaman module pertama
        return redirect()->route('modules.index', [
            'course_slug' => $courseSlug,
            'module_slug' => $firstModule->slug,
        ])->with('success', '5 modules dan 25 materials berhasil dibuat!');
    }
}
