"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function getInitialDark(): boolean {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("gemini-pulse-theme");
    return saved !== "light";
}

export default function ThemeToggle() {
    const [dark, setDark] = useState(true);
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        const saved = localStorage.getItem("gemini-pulse-theme");
        const isDark = saved !== "light";

        if (isDark) {
            document.documentElement.classList.add("dark");
            document.documentElement.classList.remove("light");
        } else {
            document.documentElement.classList.remove("dark");
            document.documentElement.classList.add("light");
        }

        // Use a microtask to defer the state update so it doesn't
        // count as a synchronous setState inside the effect body.
        queueMicrotask(() => {
            setDark(isDark);
        });
    }, []);

    const toggle = useCallback(() => {
        const next = !dark;
        setDark(next);
        localStorage.setItem("gemini-pulse-theme", next ? "dark" : "light");
        if (next) {
            document.documentElement.classList.add("dark");
            document.documentElement.classList.remove("light");
        } else {
            document.documentElement.classList.remove("dark");
            document.documentElement.classList.add("light");
        }
    }, [dark]);

    return (
        <button
            onClick={toggle}
            className="glass flex h-9 w-9 items-center justify-center rounded-xl hover:bg-white/10 dark:hover:bg-white/10 transition-colors"
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
            aria-label="Toggle theme"
        >
            <AnimatePresence mode="wait" initial={false}>
                {dark ? (
                    <motion.div
                        key="sun"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Sun className="h-4 w-4 text-amber-300" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="moon"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Moon className="h-4 w-4 text-indigo-400" />
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    );
}
