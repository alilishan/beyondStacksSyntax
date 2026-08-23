import Link from "next/link";

import { cn } from "@/lib/utils";
import { getCategory } from "@/lib/taxonomy";

export function CategoryChip({
    category,
    className,
    asLink = true,
}: {
    category: string;
    className?: string;
    asLink?: boolean;
}) {
    const meta = getCategory(category);
    if (!meta) return null;

    const classes = cn(
        "inline-flex items-center rounded-full border border-hairline px-2.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground transition-colors",
        asLink && "hover:border-accent-edge hover:bg-accent-wash hover:text-ink",
        className,
    );

    if (!asLink) {
        return <span className={classes}>{meta.name}</span>;
    }

    return (
        <Link href={`/topics/${meta.slug}`} className={classes}>
            {meta.name}
        </Link>
    );
}

export function SeriesTag({
    name,
    slug,
    className,
}: {
    name: string;
    slug: string;
    className?: string;
}) {
    return (
        <Link
            href={`/series/${slug}`}
            className={cn(
                "inline-flex items-center gap-1.5 font-mono text-[0.6875rem] tracking-tight text-muted-foreground transition-colors hover:text-ink",
                className,
            )}
        >
            <span aria-hidden="true" className="text-faint">
                {"/*"}
            </span>
            {name}
            <span aria-hidden="true" className="text-faint">
                {"*/"}
            </span>
        </Link>
    );
}
