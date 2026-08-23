"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

/**
 * Theme toggle.
 *
 * Both icons are always rendered and CSS picks which one shows, so the markup
 * is identical on the server and the client. That avoids the usual `mounted`
 * flag — and the hydration flash that comes with it — entirely.
 */
export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();

    return (
        <button
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="flex size-8 items-center justify-center rounded-md border border-hairline text-muted-foreground transition-colors hover:border-accent-edge hover:text-accent-ink"
            aria-label="Toggle between light and dark theme"
            title="Toggle theme"
        >
            <Moon className="size-3.5 dark:hidden" aria-hidden="true" />
            <Sun className="hidden size-3.5 dark:block" aria-hidden="true" />
        </button>
    );
}
