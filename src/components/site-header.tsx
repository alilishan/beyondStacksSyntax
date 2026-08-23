"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { nav, site } from "@/lib/site";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
    const pathname = usePathname();
    const [open, setOpen] = React.useState(false);
    const close = React.useCallback(() => setOpen(false), []);

    return (
        <header className="sticky top-0 z-50 border-b border-hairline bg-background/85 backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
                <Link
                    href="/"
                    className="group flex items-baseline gap-[0.3ch] font-mono text-[0.8125rem] font-bold tracking-tight text-ink"
                >
                    <span>Beyond</span>
                    <span>Stacks</span>
                    <span className="text-faint" aria-hidden="true">
                        &amp;
                    </span>
                    <span>Syntax</span>
                </Link>

                <div className="flex items-center gap-1.5">
                    <nav aria-label="Main" className="hidden sm:block">
                        <ul className="flex items-center gap-1">
                            {nav.map((item) => {
                                const active =
                                    pathname === item.href ||
                                    pathname.startsWith(`${item.href}/`);
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            aria-current={active ? "page" : undefined}
                                            className={cn(
                                                "rounded-md px-2.5 py-1.5 font-mono text-xs tracking-tight transition-colors",
                                                active
                                                    ? "text-accent-ink"
                                                    : "text-muted-foreground hover:text-ink",
                                            )}
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    <ThemeToggle />

                    <button
                        type="button"
                        onClick={() => setOpen((value) => !value)}
                        aria-expanded={open}
                        aria-controls="mobile-nav"
                        aria-label={open ? "Close menu" : "Open menu"}
                        className="flex size-8 items-center justify-center rounded-md border border-hairline text-muted-foreground transition-colors hover:border-accent-edge hover:text-accent-ink sm:hidden"
                    >
                        {open ? (
                            <X className="size-3.5" aria-hidden="true" />
                        ) : (
                            <Menu className="size-3.5" aria-hidden="true" />
                        )}
                    </button>
                </div>
            </div>

            {open ? (
                <nav
                    id="mobile-nav"
                    aria-label="Main"
                    className="border-t border-hairline bg-background sm:hidden"
                >
                    <ul className="mx-auto max-w-6xl px-5 py-2">
                        {nav.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    onClick={close}
                                    className="block border-b border-hairline py-3 font-mono text-sm text-muted-foreground last:border-b-0 hover:text-accent-ink"
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                        <li>
                            <a
                                href={site.author.resume}
                                onClick={close}
                                className="block py-3 font-mono text-sm text-muted-foreground hover:text-accent-ink"
                            >
                                Résumé ↗
                            </a>
                        </li>
                    </ul>
                </nav>
            ) : null}
        </header>
    );
}
