import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeMode() {
    const [darkMode, setDarkMode] = useState(false);

    // Ambil preferensi tema dari localStorage saat komponen pertama kali dimount
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            setDarkMode(true);
            document.documentElement.classList.add("dark");
        } else {
            setDarkMode(false);
            document.documentElement.classList.remove("dark");
        }
    }, []);

    // Update class dan simpan preferensi ke localStorage setiap kali darkMode berubah
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    return (
        <Button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-yellow-300 dark:bg-gray-700 dark:text-white"
        >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
    );
}
