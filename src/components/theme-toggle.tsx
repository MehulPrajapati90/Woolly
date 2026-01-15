"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ModeToggle() {

    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true);
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <Button
            size="icon"
            className="rounded-full z-10 bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white border-2 dark:border-neutral-700 hover:bg-white/90 dark:hover:bg-neutral-800"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
    )
}