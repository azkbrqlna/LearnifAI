import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeMode() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
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
