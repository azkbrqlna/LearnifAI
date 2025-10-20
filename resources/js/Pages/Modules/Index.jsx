import React from "react";
import { Head } from "@inertiajs/react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import NavbarLayout from "@/components/layouts/navbar";

export default function ModuleIndex({ course, module }) {
    return (
        <NavbarLayout>
            <Head title={`${module.title} - ${course.title}`} />

            <div className="max-w-3xl mx-auto py-10">
                {/* Judul module */}
                <h1 className="text-3xl font-bold mb-2">{module.title}</h1>

                {/* Nama course */}
                <p className="text-gray-600 mb-6">
                    Course: <span className="font-medium">{course.title}</span>
                </p>

                {/* Daftar Materials */}
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="materials">
                        <AccordionTrigger className="text-lg font-semibold">
                            {module.title} — Materials
                        </AccordionTrigger>

                        <AccordionContent>
                            {module.materials && module.materials.length > 0 ? (
                                <ul className="list-disc pl-6 space-y-1">
                                    {module.materials.map((mat, i) => (
                                        <li
                                            key={mat.id}
                                            className="text-sm text-gray-700"
                                        >
                                            {i + 1}. {mat.title}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 italic">
                                    Belum ada materials untuk module ini.
                                </p>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </NavbarLayout>
    );
}
