import React from "react";
import { Head, usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NavbarLayout from "@/components/layouts/navbar";

export default function CourseDetail() {
    const { course, course_modules } = usePage().props;

    return (
        <>
            <Head title={course.title} />
            <NavbarLayout>
                <div className="px-8">
                    {/* Course Info */}
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
                                    className="bg-secondary-background border-3"
                                >
                                    <CardHeader>
                                        <CardTitle>{module.title}</CardTitle>
                                    </CardHeader>

                                    <CardContent className="flex flex-col justify-between flex-grow">
                                        <p className="text-sm mb-4 ">
                                            {module.description}
                                        </p>

                                        <div className="mt-auto flex justify-end">
                                            <Button
                                                size="sm"
                                                onClick={() =>
                                                    alert("Mulai belajar 🚀")
                                                }
                                            >
                                                Start Course
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
