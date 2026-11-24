import { cn } from "@/lib/utils";
import type { ProjectHighlight, ProjectLink, ProjectStatus as Status } from "@/lib/projects";

/**
 * Status is carried by fill, not hue — the palette is monochrome. A filled
 * dot means you can use it today; a hollow one means you can't yet.
 */
const live: Status[] = [
    "Operational",
    "Operational — Private Deployment",
    "Publicly Available",
    "Early Access",
];

export function ProjectStatus({ status, className }: { status: Status; className?: string }) {
    const isLive = live.includes(status);
    return (
        <span
            className={cn(
                "inline-flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground",
                className,
            )}
        >
            <span
                aria-hidden="true"
                className={cn(
                    "size-1.5 rounded-full border border-accent-ink",
                    isLive ? "bg-accent-ink" : "bg-transparent",
                )}
            />
            <span>
                <span className="sr-only">Status: </span>
                {status}
            </span>
        </span>
    );
}

export function ProjectTags({ tags, className }: { tags: string[]; className?: string }) {
    if (tags.length === 0) return null;
    return (
        <ul className={cn("flex flex-wrap gap-1.5", className)} aria-label="Tags">
            {tags.map((tag) => (
                <li
                    key={tag}
                    className="rounded-full border border-hairline px-2.5 py-0.5 font-mono text-[0.625rem] text-muted-foreground"
                >
                    {tag}
                </li>
            ))}
        </ul>
    );
}

/**
 * Every project link leaves the site, so each one carries the ↗ the rest of
 * the site already uses for the résumé, plus a spoken equivalent.
 */
export function ProjectLinks({
    links,
    className,
}: {
    links: ProjectLink[];
    className?: string;
}) {
    if (links.length === 0) return null;
    return (
        <ul className={cn("flex flex-wrap items-center gap-x-5 gap-y-2", className)}>
            {links.map((link) => (
                <li key={link.kind}>
                    <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative z-10 font-mono text-[0.6875rem] text-ink underline decoration-mark underline-offset-4 transition-colors hover:decoration-current"
                    >
                        {link.label}
                        <span aria-hidden="true" className="ml-1 text-faint no-underline">
                            ↗
                        </span>
                        <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                </li>
            ))}
        </ul>
    );
}

export function ProjectHighlights({
    highlights,
    className,
}: {
    highlights: ProjectHighlight[];
    className?: string;
}) {
    if (highlights.length === 0) return null;
    return (
        <dl
            className={cn(
                "grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-2",
                className,
            )}
        >
            {highlights.map((highlight) => (
                <div key={highlight.label} className="flex flex-col bg-paper p-5">
                    <dt className="order-2 mt-2 font-reading text-sm leading-relaxed text-muted-foreground">
                        {highlight.label}
                    </dt>
                    <dd className="order-1 font-mono text-xl font-bold tracking-tight text-ink tabular-nums">
                        {highlight.value}
                    </dd>
                </div>
            ))}
        </dl>
    );
}

/** Marks a `published: false` project. Only ever rendered under `next dev`. */
export function UnpublishedBadge() {
    return (
        <span className="inline-flex items-center rounded-full border border-dashed border-accent-edge px-2.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
            Unpublished · dev only
        </span>
    );
}
