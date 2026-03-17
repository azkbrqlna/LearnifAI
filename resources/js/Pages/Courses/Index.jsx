import React, { useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NavbarLayout from "@/components/layouts/navbar";
import LoadingOverlay from "@/components/fragments/loading";
import ErrorModal from "@/components/fragments/error";

export default function CourseDetail() {
    const { course, course_modules } = usePage().props;
    const [loadingModuleTitle, setLoadingModuleTitle] = useState(null);

    // State baru untuk menghandle pesan error
    const [errorMessage, setErrorMessage] = useState(null);

    const handleSubmit = async (moduleTitle) => {
        setLoadingModuleTitle(moduleTitle);
        setErrorMessage(null); // Reset error saat mencoba lagi

        router.post(
            "/modules/generate",
            { title: moduleTitle },
            {
                onFinish: () => setLoadingModuleTitle(null),
                onSuccess: () => router.reload({ only: ["course_modules"] }),
                onError: (err) => {
                    console.error(err);
                    // Ganti alert bawaan dengan modal error yang estetik
                    setErrorMessage(
                        err.error ||
                            "Gagal membuat module. AI mungkin sedang sibuk, silakan coba beberapa saat lagi.",
                    );
                },
            },
        );
    };

    return (
        <>
            <Head title={course.title} />
            <NavbarLayout>
                <LoadingOverlay isLoading={loadingModuleTitle !== null} />

                <ErrorModal
                    isOpen={errorMessage !== null}
                    message={errorMessage}
                    onClose={() => setErrorMessage(null)}
                />

                <div className="px-8 py-6">
                    <div className="mb-6">
                        <h1 className="text-xl font-bold mb-3">
                            {course.title}
                        </h1>
                        <p className="text-base">{course.description}</p>
                    </div>

                    {course_modules.length === 0 ? (
                        <p className="text-center text-gray-500">
                            Tidak ada module untuk kursus ini.
                        </p>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-6">
                            {course_modules.map((module) => (
                                <Card
                                    key={module.id}
                                    className="bg-secondary-background border-3 flex flex-col"
                                >
                                    <CardHeader>
                                        <CardTitle>{module.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col justify-between flex-grow">
                                        <p className="text-sm mb-4">
                                            {module.description}
                                        </p>
                                        <div className="mt-auto flex justify-end">
                                            <Button
                                                size="sm"
                                                onClick={() =>
                                                    handleSubmit(module.title)
                                                }
                                                disabled={
                                                    loadingModuleTitle ===
                                                    module.title
                                                }
                                            >
                                                {loadingModuleTitle ===
                                                module.title
                                                    ? "Generating..."
                                                    : "Start Course"}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </NavbarLayout>
        </>
    );
}
