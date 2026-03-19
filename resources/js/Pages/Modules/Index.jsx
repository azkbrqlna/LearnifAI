import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import NavbarLayout from "@/components/layouts/navbar";
import LoadingOverlay from "@/components/fragments/loading";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarTrigger,
    SidebarInset,
} from "@/components/ui/sidebar";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    ChevronRight,
    LayoutDashboard,
    Circle,
    CheckCircle2,
} from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// =========================================================================
// KOMPONEN SIDEBAR
// =========================================================================
function CourseSidebar({ course, modules, activeModule, activeMaterial }) {
    return (
        <Sidebar>
            {/* Header: Judul Kursus */}
            <SidebarHeader className="mt-16 px-5 pt-6 pb-4">
                <h2 className="text-sm font-bold leading-snug line-clamp-2">
                    {course.title}
                </h2>
            </SidebarHeader>

            <SidebarContent className="px-3 py-4 overflow-y-auto custom-scrollbar">
                <SidebarGroup>
                    <SidebarMenu className="gap-1">
                        {modules.map((mod, modIndex) => {
                            const isModuleActive = activeModule.id === mod.id;
                            return (
                                <Collapsible
                                    key={mod.id}
                                    asChild
                                    defaultOpen={isModuleActive}
                                    className="group/collapsible"
                                >
                                    <SidebarMenuItem>
                                        {/* Trigger Modul */}
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton
                                                tooltip={mod.title}
                                                className={`
                                                    w-full rounded-lg px-3 py-2.5 flex items-center gap-2.5
                                                    transition-all duration-200 text-left
                                                    ${
                                                        isModuleActive
                                                            ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                                                            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
                                                    }
                                                `}
                                            >
                                                <span
                                                    className={`
                                                    flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center
                                                    text-[10px] font-bold border
                                                    ${
                                                        isModuleActive
                                                            ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-transparent"
                                                            : "border-zinc-300 dark:border-zinc-600 text-zinc-500 dark:text-zinc-400"
                                                    }
                                                `}
                                                >
                                                    {modIndex + 1}
                                                </span>
                                                <span className="flex-1 text-xs font-semibold truncate">
                                                    {mod.title}
                                                </span>
                                                <ChevronRight
                                                    className={`
                                                    flex-shrink-0 w-3.5 h-3.5 transition-transform duration-200
                                                    group-data-[state=open]/collapsible:rotate-90
                                                    ${isModuleActive ? "text-zinc-300 dark:text-zinc-600" : "text-zinc-400 dark:text-zinc-500"}
                                                `}
                                                />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>

                                        {/* Sub-item Materi */}
                                        <CollapsibleContent>
                                            <SidebarMenuSub className="ml-5 pl-3 mt-1 mb-2 border-l border-zinc-200 dark:border-zinc-700 space-y-0.5">
                                                {mod.materials &&
                                                mod.materials.length > 0 ? (
                                                    mod.materials.map((mat) => {
                                                        const isActive =
                                                            activeMaterial.id ===
                                                            mat.id;
                                                        return (
                                                            <SidebarMenuSubItem
                                                                key={mat.id}
                                                            >
                                                                <SidebarMenuSubButton
                                                                    asChild
                                                                    isActive={
                                                                        isActive
                                                                    }
                                                                    className={`
                                                                        group/item w-full rounded-md px-3 py-2 flex items-center gap-2
                                                                        transition-all duration-150 text-xs
                                                                        ${
                                                                            isActive
                                                                                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold"
                                                                                : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 hover:text-zinc-800 dark:hover:text-zinc-200 font-medium"
                                                                        }
                                                                    `}
                                                                >
                                                                    <Link
                                                                        href={`/courses/${course.slug}/${mod.slug}?l=${mat.slug}`}
                                                                        preserveScroll
                                                                        className="flex items-center gap-2 w-full"
                                                                    >
                                                                        {isActive ? (
                                                                            <CheckCircle2 className="flex-shrink-0 w-3 h-3 text-zinc-900 dark:text-zinc-100" />
                                                                        ) : (
                                                                            <Circle className="flex-shrink-0 w-3 h-3 text-zinc-300 dark:text-zinc-600 group-hover/item:text-zinc-400" />
                                                                        )}
                                                                        <span className="truncate leading-snug">
                                                                            {
                                                                                mat.title
                                                                            }
                                                                        </span>
                                                                    </Link>
                                                                </SidebarMenuSubButton>
                                                            </SidebarMenuSubItem>
                                                        );
                                                    })
                                                ) : (
                                                    <p className="px-3 py-2 text-[11px] text-zinc-400 dark:text-zinc-500 italic">
                                                        Belum ada materi.
                                                    </p>
                                                )}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}

export default function ModuleIndex({
    course,
    modules,
    activeModule,
    activeMaterial,
}) {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const removeStart = router.on("start", () => setIsLoading(true));
        const removeFinish = router.on("finish", () => {
            setIsLoading(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
        return () => {
            removeStart();
            removeFinish();
        };
    }, []);

    return (
        <NavbarLayout>
            <Head title={`${activeMaterial.title} — ${course.title}`} />
            <LoadingOverlay isLoading={isLoading} />

            <SidebarProvider
                className="min-h-[calc(100vh-64px)]"
                style={{
                    "--sidebar-background": "255 255 255",
                    "--sidebar-foreground": "24 24 27",
                    "--sidebar-accent": "244 244 245",
                    "--sidebar-accent-foreground": "24 24 27",
                    "--sidebar-border": "228 228 231",
                    "--sidebar-ring": "transparent",
                }}
            >
                {/* SIDEBAR */}
                <CourseSidebar
                    course={course}
                    modules={modules}
                    activeModule={activeModule}
                    activeMaterial={activeMaterial}
                />

                {/* ── MAIN INSET ── */}
                <SidebarInset className="flex flex-col border-2 dark:border-zinc-800 min-h-full bg-white dark:bg-zinc-950 rounded-xl overflow-hidden ">
                    {/* ── HEADER SEKUNDER ── */}
                    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm px-5 border-b border-zinc-100 dark:border-zinc-800">
                        <SidebarTrigger />

                        <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-700" />

                        {/* Breadcrumb */}
                        <nav className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 min-w-0">
                            <span className="truncate max-w-[100px] sm:max-w-[200px] font-medium">
                                {activeModule.title}
                            </span>
                            <ChevronRight className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate max-w-[120px] sm:max-w-[280px] font-semibold text-zinc-700 dark:text-zinc-200">
                                {activeMaterial.title}
                            </span>
                        </nav>
                    </header>

                    {/* ── KONTEN MATERI ── */}
                    <main className="flex-1 bg-white dark:bg-zinc-950">
                        <div className="max-w-3xl mx-auto px-6 py-12 md:px-10 md:py-16">
                            {/* Judul Materi */}
                            <div className="mb-10">
                                <p className="text-[11px] font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500 mb-3">
                                    {activeModule.title}
                                </p>
                                <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 leading-tight tracking-tight">
                                    {activeMaterial.title}
                                </h1>
                                <div className="mt-5 h-px bg-zinc-100 dark:bg-zinc-800" />
                            </div>

                            {/* Body Konten Markdown */}
                            {activeMaterial.content ? (
                                <div
                                    className={`
                                    prose max-w-none dark:prose-invert
                                    prose-headings:font-bold prose-headings:tracking-tight
                                    prose-headings:text-zinc-900 dark:prose-headings:text-zinc-50
                                    prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                                    prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                                    prose-p:text-zinc-600 dark:prose-p:text-zinc-400
                                    prose-p:leading-relaxed prose-p:mb-5 prose-p:text-[15px]
                                    prose-a:text-zinc-900 dark:prose-a:text-zinc-200
                                    prose-a:underline prose-a:underline-offset-2
                                    prose-a:decoration-zinc-300 dark:prose-a:decoration-zinc-600
                                    hover:prose-a:decoration-zinc-700 dark:hover:prose-a:decoration-zinc-300
                                    prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100 prose-strong:font-semibold
                                    prose-li:text-zinc-600 dark:prose-li:text-zinc-400
                                    prose-li:text-[15px] prose-li:leading-relaxed
                                    prose-ul:my-4 prose-ol:my-4
                                    prose-blockquote:border-l-2
                                    prose-blockquote:border-zinc-300 dark:prose-blockquote:border-zinc-600
                                    prose-blockquote:pl-4 prose-blockquote:not-italic
                                    prose-blockquote:text-zinc-500 dark:prose-blockquote:text-zinc-400
                                    prose-code:text-zinc-800 dark:prose-code:text-zinc-200
                                    prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800
                                    prose-code:rounded prose-code:px-1.5 prose-code:py-0.5
                                    prose-code:text-[13px] prose-code:font-mono
                                    prose-pre:bg-zinc-900 dark:prose-pre:bg-zinc-800/80
                                    prose-pre:text-zinc-100 prose-pre:rounded-xl
                                    prose-pre:shadow-sm prose-pre:text-[13px]
                                    prose-img:rounded-xl prose-img:shadow-sm
                                    prose-hr:border-zinc-100 dark:prose-hr:border-zinc-800 prose-hr:my-8
                                    prose-table:text-sm
                                    prose-th:text-zinc-800 dark:prose-th:text-zinc-200 prose-th:font-semibold
                                    prose-td:text-zinc-600 dark:prose-td:text-zinc-400
                                `}
                                >
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {activeMaterial.content}
                                    </ReactMarkdown>
                                </div>
                            ) : (
                                /* Empty state */
                                <div className="flex flex-col items-center justify-center py-24 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900">
                                    <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                                        <LayoutDashboard className="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
                                    </div>
                                    <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                                        Konten belum tersedia
                                    </p>
                                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                                        Sedang disiapkan. Coba lagi beberapa
                                        saat.
                                    </p>
                                </div>
                            )}
                        </div>
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </NavbarLayout>
    );
}
