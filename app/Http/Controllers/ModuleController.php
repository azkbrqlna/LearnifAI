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
        // 1. Dapatkan Course berdasarkan URL
        $course = Course::where('slug', $course_slug)->firstOrFail();

        // 2. Langsung cari Active Module berdasarkan slug di URL
        $activeModule = Module::with('materials')->where('slug', $module_slug)->firstOrFail();

        // 3. Dapatkan Course Module (Bab utama) yang menaungi Active Module ini
        $courseModule = CourseModule::findOrFail($activeModule->course_modules_id);

        // 4. Pastikan module ini benar-benar milik course yang diakses di URL (Keamanan)
        if ($courseModule->course_id !== $course->id) {
            abort(404);
        }

        // 5. Ambil SEMUA modul beserta materialnya yang satu grup dengan Bab ini untuk Sidebar
        $allModules = Module::with('materials')
            ->where('course_modules_id', $courseModule->id)
            ->get();

        // 6. Tentukan Active Material berdasarkan parameter ?l=
        $materialSlug = $request->query('l');
        
        if ($materialSlug) {
            $activeMaterial = $activeModule->materials->firstWhere('slug', $materialSlug);
        } else {
            $activeMaterial = $activeModule->materials->first();
        }

        if (!$activeMaterial) abort(404);

        // 7. GENERATE KONTEN ON-THE-FLY (Jika belum ada)
        if (is_null($activeMaterial->content)) {
            
            // --- UPDATE PROMPT DI SINI ---
            // Tambahkan deskripsi courseModule agar isi materi tidak keluar jalur
            $prompt = "Buatkan materi pembelajaran yang ringkas, padat, dan jelas untuk topik '{$activeMaterial->title}'. 
Topik ini adalah bagian dari bab '{$activeModule->title}' dalam kursus '{$course->title}'. 
Fokus utama bab ini adalah: \"{$courseModule->description}\". Pastikan materi yang dibuat relevan dengan fokus tersebut.

Ketentuan SUPER KETAT pembuatan materi:
1. LANGSUNG BERIKAN ISI MATERI. DILARANG KERAS menambahkan kalimat basa-basi, pengantar, atau penutup (seperti 'Tentu, ini materi pembelajarannya...', 'Berikut adalah...', dsb). Mulailah langsung dengan judul atau isi paragraf pertama!
2. FORMATTING PARAGRAF: Berikan jeda satu baris kosong (enter 2 kali) di antara setiap paragraf, sub-judul, dan list agar tulisan tidak menumpuk dan nyaman dibaca.
3. Jangan terlalu panjang, fokus pada inti pembahasan (sekitar 3-4 paragraf atau 300-400 kata).
4. Penjelasan harus 'to the point' dan mudah dipahami oleh pemula.
5. Wajib menyertakan poin-poin penting (bullet points) atau contoh singkat untuk memperjelas konsep.
6. Gunakan format Markdown yang rapi (Gunakan ## untuk Sub Judul, **bold**, list, atau blok kode jika relevan).";


            $response = Http::timeout(120)
                ->withHeaders(['Content-Type' => 'application/json'])
                ->post(env('GEMINI_API_URL') . env('GEMINI_API_KEY'), [
                    'contents' => [
                        ['parts' => [['text' => $prompt]]]
                    ]
                ]);

            if ($response->successful()) {
                $content = $response->json()['candidates'][0]['content']['parts'][0]['text'] ?? 'Gagal membuat konten.';
                
                $activeMaterial->update([
                    'content' => $content
                ]);
            } else {
                $activeMaterial->content = "Terjadi kesalahan saat menghubungi AI. Silakan muat ulang halaman.";
            }
        }

        // 8. Kirim data ke Frontend
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

        $existingModule = Module::where('course_modules_id', $courseModule->id)->first();

        if ($existingModule) {
            $firstMaterial = Material::where('module_id', $existingModule->id)->first();
            
            return redirect()->route('modules.index', [
                'course_slug' => $courseSlug,
                'module_slug' => $existingModule->slug,
                'l' => $firstMaterial->slug ?? null
            ])->with('info', 'Modul sudah ada, langsung diarahkan.');
        }

        // --- UPDATE PROMPT DI SINI ---
        // Sertakan deskripsi agar AI tahu persis ruang lingkup (scope) yang harus di-generate
        $prompt = "
        Anda adalah pembuat kurikulum. Buatkan 5 module pembelajaran untuk bab '{$courseModule->title}' yang merupakan bagian dari kursus '{$courseModule->course->title}'.

        PENTING: Fokus pembahasan, ruang lingkup, dan materi HARUS mencakup panduan deskripsi berikut:
        \"{$courseModule->description}\"

        Format output HARUS JSON murni berikut:
        [
            {
                \"module_title\": \"Judul Modul 1\",
                \"materials\": [
                    {\"title\": \"Judul Material 1\"},
                    {\"title\": \"Judul Material 2\"}
                ]
            }
        ]
        Pastikan menghasilkan tepat 5 module, dan setiap module punya tepat 5 materials.
        Kembalikan HANYA JSON valid tanpa teks pengantar atau penutup.
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
                        'slug' => Str::slug($materialTitle),
                        'content' => null,
                    ]);
                }
            }
        }

        $firstModule = Module::where('course_modules_id', $courseModule->id)->first();
        $firstMaterial = Material::where('module_id', $firstModule->id)->first();

        return redirect()->route('modules.index', [
            'course_slug' => $courseSlug,
            'module_slug' => $firstModule->slug,
            'l' => $firstMaterial->slug ?? null
        ])->with('success', 'Modul berhasil dibuat!');
    }
}