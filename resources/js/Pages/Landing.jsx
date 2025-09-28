import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "@inertiajs/react";

export default function LandingPage() {
    const [isOpen, setIsOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            {/* Navbar */}
            <nav className="w-full flex items-center justify-between px-6 py-4 bg-secondary-background border-b-3 border-border  relative">
                <div className="text-2xl font-heading font-extrabold tracking-tight">
                    LearnifAI
                </div>

                {/* Desktop Buttons */}
                <div className="hidden md:flex gap-4 items-center">
                    <Button className="bg-pink-400">
                        <Link href="/login">Login</Link>
                    </Button>
                    <Button className="bg-green-400">
                        <Link href="/register">Register</Link>
                    </Button>

                    {/* Dark Mode Toggle */}
                    <Button
                        onClick={() => setDarkMode(!darkMode)}
                        className="bg-yellow-300 dark:bg-gray-700 dark:text-white"
                    >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </Button>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden flex gap-2">
                    {/* Dark toggle for mobile */}
                    <Button
                        variant="ghost"
                        onClick={() => setDarkMode(!darkMode)}
                        className="border-2 border-border bg-yellow-300 dark:bg-gray-700 shadow-shadow"
                    >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </Button>
                    <Button
                        variant="reverse"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </Button>
                </div>

                {/* Mobile Menu Animated */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            key="mobile-menu"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="absolute top-16 right-6 flex flex-col gap-3 bg-secondary-background p-4 border-4 border-border shadow-shadow md:hidden"
                        >
                            <Button className="bg-pink-400">Login</Button>
                            <Button className="bg-green-400">Register</Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            <section className="flex flex-col items-center justify-center text-center px-6 py-20 min-h-[calc(100vh-80px)]">
                <Card className="max-w-3xl w-full border-3 bg-secondary-background p-8">
                    <CardHeader>
                        <h1 className="text-4xl md:text-6xl font-heading font-extrabold leading-tight">
                            Belajar Cepat dengan <br />
                            <span className="text-main">LearnifAI</span>
                        </h1>
                    </CardHeader>

                    <CardContent>
                        <p className="mt-4 text-lg md:text-xl font-medium">
                            Platform AI yang secara otomatis membuat kursus,
                            modul, materi, dan quiz sesuai dengan apa yang ingin
                            kamu pelajari.
                        </p>

                        <div className="mt-8 flex flex-col md:flex-row justify-center gap-4">
                            <Button className="bg-green-400 ">
                                <Link href="/home">Mulai Belajar</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
