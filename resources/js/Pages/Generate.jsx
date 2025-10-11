import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import NavbarLayout from "@/components/layouts/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Loading from "@/components/fragments/loading";

export default function GeneratePage() {
    const [loading, setLoading] = useState(false);
    const { data, setData, post, reset, errors } = useForm({
        topic: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        post("/generate", {
            onFinish: () => {
                setLoading(false);
                reset();
            },
        });
    };

    return (
        <NavbarLayout>
            <Head title="Generate Course" />

            <div className="max-w-xl mx-auto mt-10">
                <Card className="border-3 bg-secondary-background">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">
                            Generate Course
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <p className="text-muted-foreground text-center mb-6">
                            Type the topic you want to learn. LearnifAI will
                            automatically create a complete course, including
                            modules, materials, and quizzes for you
                        </p>

                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-4"
                        >
                            <Input
                                type="text"
                                name="topic"
                                placeholder="Example: Learn React from Scratch"
                                value={data.topic}
                                onChange={(e) =>
                                    setData("topic", e.target.value)
                                }
                                required
                            />
                            {errors.topic && (
                                <p className="text-red-500 text-sm">
                                    {errors.topic}
                                </p>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-main hover:bg-main/90 text-white"
                            >
                                {loading ? "Generating..." : "Generate Course"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
            <Loading open={loading} title="Sedang Menggenerate Kursus..." />
        </NavbarLayout>
    );
}
