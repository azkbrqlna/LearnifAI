import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import NavbarLayout from "@/components/layouts/navbar";

export default function ModuleIndex({
    course,
    modules,
    activeModule,
    activeMaterial,
}) {
    // State untuk mengontrol muncul/hilangnya popup loading
    const [isLoading, setIsLoading] = useState(false);

    // Mendengarkan event dari Inertia saat berpindah halaman/menggenerate materi
    useEffect(() => {
        const removeStart = router.on("start", () => setIsLoading(true));
        const removeFinish = router.on("finish", () => setIsLoading(false));

        // Bersihkan listener saat komponen di-unmount
        return () => {
            removeStart();
            removeFinish();
        };
    }, []);

    return (
        <NavbarLayout>
            <Head title={`${activeMaterial.title} - ${course.title}`} />

            {/* POPUP LOADING OVERLAY */}
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center transform scale-100 animate-in fade-in zoom-in-95 duration-200">
                        {/* Spinner animasi */}
                        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                        <h3 className="text-lg font-bold text-gray-800">
                            Menyiapkan Materi...
                        </h3>
                        <p className="text-sm text-gray-500 mt-2 text-center max-w-xs">
                            AI sedang menyusun materi pembelajaran yang
                            komprehensif untuk Anda.
                        </p>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto py-10 px-4 md:px-8 relative">
                {/* Header Info */}
                <div className="mb-8 border-b pb-4">
                    <h1 className="text-3xl font-bold">{course.title}</h1>
                    <p className="text-gray-500 mt-2">
                        Sedang mempelajari: {activeModule.title}
                    </p>
                </div>

                {/* Tambahkan items-start agar properti sticky bekerja dengan baik */}
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* SIDEBAR: Daftar Modul & Material */}
                    <div className="w-full md:w-1/3 flex-shrink-0 sticky top-24">
                        {/* max-h dan overflow-y-auto membuat sidebar bisa discroll internal tanpa ikut scroll halaman utama */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
                            <Accordion
                                type="single"
                                collapsible
                                defaultValue={activeModule.slug}
                                className="w-full"
                            >
                                {modules.map((mod) => (
                                    <AccordionItem
                                        key={mod.id}
                                        value={mod.slug}
                                    >
                                        <AccordionTrigger className="text-left font-semibold text-sm hover:no-underline hover:text-blue-600">
                                            {mod.title}
                                        </AccordionTrigger>

                                        <AccordionContent>
                                            <ul className="flex flex-col space-y-2 mt-2 ml-2 border-l-2 border-gray-100 pl-4">
                                                {mod.materials &&
                                                mod.materials.length > 0 ? (
                                                    mod.materials.map((mat) => {
                                                        const isActive =
                                                            activeMaterial.id ===
                                                            mat.id;
                                                        return (
                                                            <li key={mat.id}>
                                                                <Link
                                                                    href={`/courses/${course.slug}/${mod.slug}?l=${mat.slug}`}
                                                                    preserveScroll
                                                                    className={`block text-sm transition-colors duration-200 py-1.5 ${
                                                                        isActive
                                                                            ? "font-bold text-blue-600"
                                                                            : "text-gray-600 hover:text-blue-500"
                                                                    }`}
                                                                >
                                                                    {mat.title}
                                                                </Link>
                                                            </li>
                                                        );
                                                    })
                                                ) : (
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        Belum ada materi.
                                                    </p>
                                                )}
                                            </ul>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </div>

                    {/* MAIN CONTENT: Menampilkan Konten Material */}
                    <div className="w-full md:w-2/3">
                        <div className="bg-white p-8 rounded-xl shadow-sm border min-h-[500px]">
                            <h2 className="text-3xl font-bold mb-6 text-gray-800">
                                {activeMaterial.title}
                            </h2>

                            {/* Render Konten AI */}
                            <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {activeMaterial.content ? (
                                    activeMaterial.content
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                                        <p>Konten belum tersedia.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </NavbarLayout>
    );
}
