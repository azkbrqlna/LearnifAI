import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NavbarLayout from "@/components/layouts/navbar";

export default function CoursesIndex() {
    const { courses } = usePage().props;

    return (
        <>
            <NavbarLayout>
                <h1 className="text-2xl font-bold mb-6">My Courses</h1>

                {courses.length === 0 ? (
                    <p className="text-gray-600">
                        Belum ada course. Silakan generate dulu 🚀
                    </p>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <Card
                                key={course.id}
                                className="flex flex-col bg-secondary-background"
                            >
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        {course.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm ">
                                        {course.description}
                                    </p>
                                </CardContent>
                                <CardFooter className="mt-auto">
                                    <Link
                                        href={`/courses/${course.id}`}
                                        className="w-full"
                                    >
                                        <Button className="w-full">
                                            Start Course
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </NavbarLayout>
        </>
    );
}
