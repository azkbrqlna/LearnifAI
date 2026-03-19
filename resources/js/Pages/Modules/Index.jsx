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
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
    oneLight,
    oneDark,
} from "react-syntax-highlighter/dist/esm/styles/prism";

// =========================================================================
// HOOK: Deteksi dark mode
// =========================================================================
function useDarkMode() {
    const [isDark, setIsDark] = useState(() =>
        document.documentElement.classList.contains("dark"),
    );

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains("dark"));
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });
        return () => observer.disconnect();
    }, []);

    return isDark;
}

// =========================================================================
// KOMPONEN: Custom Markdown Renderers
// =========================================================================
function MarkdownContent({ content }) {
    const isDark = useDarkMode();

    const components = {
        // ── Blok kode dengan syntax highlighting ──
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");

            if (!inline && match) {
                return (
                    <div className="my-6 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-sm">
                        <div className="flex items-center justify-between px-4 py-2 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                            <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                                {match[1]}
                            </span>
                        </div>
                        <SyntaxHighlighter
                            style={isDark ? oneDark : oneLight}
                            language={match[1]}
                            PreTag="div"
                            showLineNumbers={true}
                            lineNumberStyle={{
                                minWidth: "2.5em",
                                paddingRight: "1em",
                                color: isDark ? "#4b5563" : "#9ca3af",
                                userSelect: "none",
                            }}
                            customStyle={{
                                margin: 0,
                                padding: "1rem 1.25rem",
                                fontSize: "0.8125rem",
                                lineHeight: "1.6",
                                background: isDark ? "#18181b" : "#fafafa",
                            }}
                            {...props}
                        >
                            {codeString}
                        </SyntaxHighlighter>
                    </div>
                );
            }

            // Inline code
            return (
                <code
                    className="px-1.5 py-0.5 rounded text-[13px] font-mono
                               bg-zinc-100 dark:bg-zinc-800
                               text-zinc-800 dark:text-zinc-200
                               border border-zinc-200 dark:border-zinc-700"
                    {...props}
                >
                    {children}
                </code>
            );
        },

        // ── Heading H2 ──
        h2({ children }) {
            return (
                <h2
                    className="scroll-mt-20 text-2xl font-bold tracking-tight
                               text-zinc-900 dark:text-zinc-50
                               mt-10 mb-4 pb-3
                               border-b border-zinc-100 dark:border-zinc-800"
                >
                    {children}
                </h2>
            );
        },

        // ── Heading H3 ──
        h3({ children }) {
            return (
                <h3
                    className="scroll-mt-20 text-xl font-bold tracking-tight
                               text-zinc-800 dark:text-zinc-100
                               mt-8 mb-3"
                >
                    {children}
                </h3>
            );
        },

        // ── Heading H4 ──
        h4({ children }) {
            return (
                <h4
                    className="text-base font-semibold
                               text-zinc-800 dark:text-zinc-200
                               mt-6 mb-2"
                >
                    {children}
                </h4>
            );
        },

        // ── Paragraf ──
        p({ children }) {
            return (
                <p
                    className="text-[15px] leading-relaxed mb-5
                              text-zinc-600 dark:text-zinc-400"
                >
                    {children}
                </p>
            );
        },

        // ── Unordered List ──
        ul({ children }) {
            return (
                <ul className="my-4 space-y-1.5 pl-0 list-none">{children}</ul>
            );
        },

        // ── Ordered List ──
        ol({ children }) {
            return (
                <ol className="my-4 space-y-1.5 pl-0 list-none counter-reset-item">
                    {children}
                </ol>
            );
        },

        // ── List Item ──
        li({ children, ordered, index }) {
            return (
                <li
                    className="flex items-start gap-2.5 text-[15px] leading-relaxed
                               text-zinc-600 dark:text-zinc-400"
                >
                    <span
                        className="flex-shrink-0 mt-[5px] w-1.5 h-1.5 rounded-full
                                     bg-zinc-400 dark:bg-zinc-500"
                    ></span>
                    <span>{children}</span>
                </li>
            );
        },

        // ── Blockquote (sebagai callout) ──
        blockquote({ children }) {
            return (
                <blockquote
                    className="my-6 flex gap-3 items-start
                                       rounded-xl p-4
                                       bg-zinc-50 dark:bg-zinc-900
                                       border border-zinc-200 dark:border-zinc-700
                                       border-l-4 border-l-zinc-400 dark:border-l-zinc-500
                                       not-italic"
                >
                    <span className="flex-shrink-0 text-base mt-0.5">💡</span>
                    <div
                        className="text-[14px] leading-relaxed
                                    text-zinc-600 dark:text-zinc-400 [&>p]:mb-0"
                    >
                        {children}
                    </div>
                </blockquote>
            );
        },

        // ── Strong / Bold ──
        strong({ children }) {
            return (
                <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {children}
                </strong>
            );
        },

        // ── Link ──
        a({ href, children }) {
            return (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-900 dark:text-zinc-200
                               underline underline-offset-2
                               decoration-zinc-300 dark:decoration-zinc-600
                               hover:decoration-zinc-700 dark:hover:decoration-zinc-300
                               transition-all"
                >
                    {children}
                </a>
            );
        },

        // ── Horizontal Rule ──
        hr() {
            return <hr className="my-8 border-zinc-100 dark:border-zinc-800" />;
        },

        // ── Tabel ──
        table({ children }) {
            return (
                <div
                    className="my-6 overflow-x-auto rounded-xl border
                                border-zinc-200 dark:border-zinc-700"
                >
                    <table className="w-full text-sm border-collapse">
                        {children}
                    </table>
                </div>
            );
        },

        thead({ children }) {
            return (
                <thead className="bg-zinc-50 dark:bg-zinc-800/60">
                    {children}
                </thead>
            );
        },

        th({ children }) {
            return (
                <th
                    className="px-4 py-3 text-left text-xs font-semibold
                               uppercase tracking-wider
                               text-zinc-700 dark:text-zinc-300
                               border-b border-zinc-200 dark:border-zinc-700"
                >
                    {children}
                </th>
            );
        },

        td({ children }) {
            return (
                <td
                    className="px-4 py-3 text-[14px]
                               text-zinc-600 dark:text-zinc-400
                               border-b border-zinc-100 dark:border-zinc-800
                               last:border-b-0"
                >
                    {children}
                </td>
            );
        },

        // ── Gambar ──
        img({ src, alt }) {
            return (
                <img
                    src={src}
                    alt={alt}
                    className="my-6 rounded-xl shadow-sm w-full object-cover
                               border border-zinc-100 dark:border-zinc-800"
                />
            );
        },
    };

    return (
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
            {content}
        </ReactMarkdown>
    );
}

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

// =========================================================================
// HALAMAN UTAMA
// =========================================================================
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
                <SidebarInset className="flex flex-col border-2 dark:border-zinc-800 min-h-full bg-white dark:bg-zinc-950 rounded-xl overflow-hidden">
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
                                <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 leading-tight tracking-tight">
                                    {activeMaterial.title}
                                </h1>
                                <div className="mt-5 h-px bg-zinc-100 dark:bg-zinc-800" />
                            </div>

                            {/* Body Konten Markdown */}
                            {activeMaterial.content ? (
                                <MarkdownContent
                                    content={activeMaterial.content}
                                />
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
