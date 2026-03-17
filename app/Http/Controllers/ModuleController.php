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
    public function index(Request $request, $course_slug, $module_slug)
    {
        // 1. Dapatkan Course & Course Module
        $course = Course::where('slug', $course_slug)->firstOrFail();
        $courseModule = CourseModule::where('course_id', $course->id)->firstOrFail();

        // 2. Ambil SEMUA modul beserta materialnya untuk ditampilkan di Sidebar
        $allModules = Module::with('materials')
            ->where('course_modules_id', $courseModule->id)
            ->get();

        // 3. Tentukan Active Module berdasarkan URL slug
        $activeModule = $allModules->firstWhere('slug', $module_slug);
        if (!$activeModule) abort(404);

        // 4. Tentukan Active Material berdasarkan parameter ?l=
        $materialSlug = $request->query('l');
        
        if ($materialSlug) {
            $activeMaterial = $activeModule->materials->firstWhere('slug', $materialSlug);
        } else {
            // Jika tidak ada parameter ?l=, gunakan material pertama dari modul tersebut
            $activeMaterial = $activeModule->materials->first();
        }

        if (!$activeMaterial) abort(404);

        // 5. GENERATE KONTEN ON-THE-FLY (Jika belum ada)
        if (is_null($activeMaterial->content)) {
            $prompt = "Buatkan materi pembelajaran yang sangat detail, informatif, dan mudah dipahami untuk topik '{$activeMaterial->title}'. Topik ini adalah bagian dari bab '{$activeModule->title}' dalam kursus '{$course->title}'. Gunakan format Markdown yang rapi (dengan heading, list, atau kode jika relevan). Jangan gunakan block markdown ```markdown di awal dan akhir, berikan langsung teks markdownnya.";

            $response = Http::timeout(120) // Perpanjang timeout karena generate teks panjang
                ->withHeaders(['Content-Type' => 'application/json'])
                ->post(env('GEMINI_API_URL') . env('GEMINI_API_KEY'), [
                    'contents' => [
                        ['parts' => [['text' => $prompt]]]
                    ]
                ]);

            if ($response->successful()) {
                $content = $response->json()['candidates'][0]['content']['parts'][0]['text'] ?? 'Gagal membuat konten.';
                
                // Simpan ke database agar selanjutnya tidak perlu generate ulang
                $activeMaterial->update([
                    'content' => $content
                ]);
            } else {
                $activeMaterial->content = "Terjadi kesalahan saat menghubungi AI. Silakan muat ulang halaman.";
            }
        }

        // 6. Kirim data ke Frontend
        return inertia('Modules/Index', [
            'course' => $course,
            'modules' => $allModules,
            'activeModule' => $activeModule,
            'activeMaterial' => $activeMaterial,
        ]);
    }

    public function generateModule(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $courseModule = CourseModule::with('course')->where('title', $request->title)->first();

        if (!$courseModule) {
            return back()->withErrors(['error' => 'Course module tidak ditemukan.']);
        }

        $courseSlug = $courseModule->course->slug ?? null;

        $prompt = "
        Buatkan 5 module tentang topik '{$courseModule->title}' dalam format JSON berikut:
        [
            {
                \"module_title\": \"Judul Modul 1\",
                \"materials\": [
                    {\"title\": \"Judul Material 1\"},
                    {\"title\": \"Judul Material 2\"}
                ]
            }
        ]
        Pastikan menghasilkan 5 module, dan setiap module punya 5 materials.
        Kembalikan hanya JSON valid.
        ";

        $response = Http::timeout(90)
            ->withHeaders(['Content-Type' => 'application/json'])
            ->post(env('GEMINI_API_URL') . env('GEMINI_API_KEY'), [
                'contents' => [['parts' => [['text' => $prompt]]]]
            ]);

        if (!$response->successful()) {
            return back()->withErrors(['error' => 'Gagal mendapatkan respons API.']);
        }

        $text = $response->json()['candidates'][0]['content']['parts'][0]['text'] ?? null;
        $cleaned = preg_replace('/^```json\s*|\s*```$/', '', trim($text));
        $data = json_decode($cleaned, true);

        if (!is_array($data)) return back()->withErrors(['error' => 'Format JSON tidak valid.']);

        foreach ($data as $mod) {
            $moduleTitle = trim($mod['module_title'] ?? 'Untitled Module');

            $module = Module::create([
                'course_modules_id' => $courseModule->id,
                'title' => $moduleTitle,
                'slug' => Str::slug($moduleTitle),
            ]);

            if (isset($mod['materials']) && is_array($mod['materials'])) {
                foreach ($mod['materials'] as $mat) {
                    $materialTitle = trim($mat['title'] ?? 'Untitled Material');

                    Material::create([
                        'module_id' => $module->id,
                        'title' => $materialTitle,
                        'slug' => Str::slug($materialTitle), // Generate slug untuk material
                        'content' => null,
                    ]);
                }
            }
        }

        $firstModule = Module::where('course_modules_id', $courseModule->id)->first();
        $firstMaterial = Material::where('module_id', $firstModule->id)->first();

        // Redirect langsung menyertakan parameter ?l=
        return redirect()->route('modules.index', [
            'course_slug' => $courseSlug,
            'module_slug' => $firstModule->slug,
            'l' => $firstMaterial->slug ?? null
        ])->with('success', 'Modul berhasil dibuat!');
    }
}