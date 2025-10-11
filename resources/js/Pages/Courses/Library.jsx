import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NavbarLayout from "@/components/layouts/navbar";

export default function CoursesPage() {
    const { courses } = usePage().props;

    return (
        <>
            <Head title="Library" />
            <NavbarLayout>
                <div className="px-8">
                    <h1 className="text-3xl font-bold text-center mb-6">
                        Library
                    </h1>

                    {courses.length === 0 ? (
                        <p className="text-center">
                            Belum ada course tersedia.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {courses.map((course) => (
                                <Card
                                    key={course.id}
                                    className="bg-secondary-background p-6 flex items-center justify-between border-3"
                                >
                                    <CardContent className="flex flex-col md:flex-row w-full justify-between items-start md:items-center gap-3 p-0">
                                        <div>
                                            <h2>{course.title}</h2>
                                            <p className="text-sm mt-2">
                                                {course.description}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-2">
                                                Dibuat pada:{" "}
                                                {new Date(
                                                    course.created_at
                                                ).toLocaleDateString("en-US", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>

                                        <div className="ml-auto">
                                            <Link
                                                href={`/courses/${course.slug}`}
                                            >
                                                <Button size="sm">
                                                    Go to Course
                                                </Button>
                                            </Link>
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
