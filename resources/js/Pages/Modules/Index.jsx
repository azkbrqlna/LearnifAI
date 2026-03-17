import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import NavbarLayout from "@/components/layouts/navbar";

// Import ikon untuk tombol di mobile
import { BookOpen, X, Menu } from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import LoadingOverlay from "@/components/fragments/loading";

export default function ModuleIndex({
    course,
    modules,
    activeModule,
    activeMaterial,
}) {
    const [isLoading, setIsLoading] = useState(false);
    // State untuk mengontrol sidebar di tampilan mobile
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    useEffect(() => {
        const removeStart = router.on("start", () => setIsLoading(true));
        const removeFinish = router.on("finish", () => {
            setIsLoading(false);
            // Otomatis scroll ke atas setelah materi selesai digenerate/dimuat
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

        return () => {
            removeStart();
            removeFinish();
        };
    }, []);

    return (
        <NavbarLayout>
            <Head title={`${activeMaterial.title} - ${course.title}`} />

            {/* KOMPONEN LOADING OVERLAY */}
            <LoadingOverlay isLoading={isLoading} />

            <div className="max-w-7xl mx-auto py-6 md:py-10 px-4 md:px-8 relative">
                {/* Header Info */}
                <div className="mb-6 md:mb-8 border-b pb-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                        {course.title}
                    </h1>
                    <p className="text-sm md:text-base text-gray-500 mt-2 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Sedang mempelajari:{" "}
                        <span className="font-semibold text-gray-700">
                            {activeModule.title}
                        </span>
                    </p>
                </div>

                {/* TOMBOL TOGGLE SIDEBAR MOBILE */}
                <div className="md:hidden mb-4">
                    <button
                        onClick={() =>
                            setIsMobileSidebarOpen(!isMobileSidebarOpen)
                        }
                        className="w-full flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border font-semibold text-gray-700 active:scale-[0.98] transition-all"
                    >
                        <span className="flex items-center gap-2">
                            <Menu className="w-5 h-5" /> Daftar Materi
                        </span>
                        {isMobileSidebarOpen ? (
                            <X className="w-5 h-5" />
                        ) : (
                            <span className="text-xs bg-blue-100 text-blue-600 py-1 px-2 rounded-full">
                                Buka
                            </span>
                        )}
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                    {/* SIDEBAR */}
                    {/* Di mobile akan tersembunyi kecuali isMobileSidebarOpen = true. Di desktop (md) selalu muncul */}
                    <div
                        className={`w-full md:w-1/3 flex-shrink-0 md:sticky md:top-24 transition-all duration-300 ${
                            isMobileSidebarOpen ? "block" : "hidden md:block"
                        }`}
                    >
                        <div className="bg-white p-4 rounded-xl shadow-sm border md:max-h-[calc(100vh-120px)] md:overflow-y-auto custom-scrollbar">
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
                                        <AccordionTrigger className="text-left font-semibold text-sm hover:no-underline hover:text-blue-600 px-1">
                                            {mod.title}
                                        </AccordionTrigger>

                                        <AccordionContent>
                                            <ul className="flex flex-col space-y-1 mt-2 ml-2 border-l-2 border-gray-100 pl-4">
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
                                                                    // Tutup sidebar di mobile saat link diklik
                                                                    onClick={() =>
                                                                        setIsMobileSidebarOpen(
                                                                            false,
                                                                        )
                                                                    }
                                                                    className={`block text-sm transition-colors duration-200 py-2 ${
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

                    {/* MAIN CONTENT */}
                    <div className="w-full md:w-2/3">
                        <div className="bg-white p-5 md:p-8 rounded-xl shadow-sm border min-h-[500px]">
                            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 leading-snug">
                                {activeMaterial.title}
                            </h2>

                            <div className="prose prose-sm md:prose-base prose-blue max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-p:text-gray-700 prose-a:text-blue-600 prose-li:text-gray-700">
                                {activeMaterial.content ? (
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {activeMaterial.content}
                                    </ReactMarkdown>
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
