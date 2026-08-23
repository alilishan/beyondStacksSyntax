"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import type { Heading } from "@/lib/headings";

/**
 * The signature device, in its fullest form.
 *
 * A hairline gutter beside the article that fills with accent as you read and
 * names the section you're currently in. The publication is about margin notes,
 * so the margin is where the navigation lives.
 */
export function ArticleGutter({
    headings,
    targetId,
}: {
    headings: Heading[];
    targetId: string;
}) {
    const [activeId, setActiveId] = React.useState<string | null>(
        headings[0]?.id ?? null,
    );
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
        const article = document.getElementById(targetId);
        if (!article) return;

        let frame = 0;

        const measure = () => {
            frame = 0;

            const rect = article.getBoundingClientRect();
            const scrolled = -rect.top;
            const scrollable = rect.height - window.innerHeight;
            const ratio = scrollable > 0 ? scrolled / scrollable : scrolled > 0 ? 1 : 0;
            setProgress(Math.min(1, Math.max(0, ratio)));

            // The active section is the last heading whose top has passed the
            // reading line, a little below the sticky header.
            const line = 140;
            let current: string | null = headings[0]?.id ?? null;
            for (const heading of headings) {
                const element = document.getElementById(heading.id);
                if (element && element.getBoundingClientRect().top <= line) {
                    current = heading.id;
                } else {
                    break;
                }
            }
            setActiveId(current);
        };

        const onScroll = () => {
            if (frame) return;
            frame = window.requestAnimationFrame(measure);
        };

        measure();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });

        return () => {
            if (frame) window.cancelAnimationFrame(frame);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [headings, targetId]);

    if (headings.length === 0) return null;

    return (
        <nav
            aria-label="On this page"
            className="sticky top-24 hidden max-h-[calc(100vh-8rem)] lg:block"
        >
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-faint">
                On this page
            </p>

            <div className="mt-4 flex gap-3">
                {/* the rule that fills as you read */}
                <div
                    aria-hidden="true"
                    className="relative w-px shrink-0 bg-hairline"
                    role="presentation"
                >
                    <div
                        className="absolute inset-x-0 top-0 bg-accent-ink transition-[height] duration-150 ease-out"
                        style={{ height: `${progress * 100}%` }}
                    />
                </div>

                <ul className="min-w-0 space-y-2.5 overflow-y-auto pr-1">
                    {headings.map((heading) => {
                        const active = heading.id === activeId;
                        return (
                            <li
                                key={heading.id}
                                className={cn(heading.level === 3 && "pl-3")}
                            >
                                <a
                                    href={`#${heading.id}`}
                                    aria-current={active ? "true" : undefined}
                                    className={cn(
                                        "block font-mono text-[0.6875rem] leading-snug tracking-tight transition-colors",
                                        active
                                            ? "text-accent-ink"
                                            : "text-faint hover:text-muted-foreground",
                                    )}
                                >
                                    {active ? (
                                        <span aria-hidden="true" className="mr-1">
                                            {"//"}
                                        </span>
                                    ) : null}
                                    {heading.text}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
}

/** Thin progress bar under the header, for screens without room for the gutter. */
export function ReadingProgressBar({ targetId }: { targetId: string }) {
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
        const article = document.getElementById(targetId);
        if (!article) return;

        let frame = 0;

        const measure = () => {
            frame = 0;
            const rect = article.getBoundingClientRect();
            const scrollable = rect.height - window.innerHeight;
            const scrolled = -rect.top;
            const ratio = scrollable > 0 ? scrolled / scrollable : scrolled > 0 ? 1 : 0;
            setProgress(Math.min(1, Math.max(0, ratio)));
        };

        const onScroll = () => {
            if (frame) return;
            frame = window.requestAnimationFrame(measure);
        };

        measure();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });

        return () => {
            if (frame) window.cancelAnimationFrame(frame);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [targetId]);

    return (
        <div
            aria-hidden="true"
            className="fixed inset-x-0 top-14 z-40 h-px bg-transparent lg:hidden"
        >
            <div
                className="h-full bg-accent-ink"
                style={{ width: `${progress * 100}%` }}
            />
        </div>
    );
}
