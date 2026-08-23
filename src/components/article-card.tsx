import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatDate, formatDateShort, type ArticleMeta } from "@/lib/articles";
import { CategoryChip, SeriesTag } from "@/components/category-chip";

/** Featured card — used on the homepage grid. */
export function ArticleCard({
    article,
    className,
}: {
    article: ArticleMeta;
    className?: string;
}) {
    return (
        <article
            className={cn(
                "group relative flex flex-col rounded-lg border border-hairline bg-paper p-6 transition-colors hover:border-accent-edge",
                className,
            )}
        >
            <div className="flex items-center gap-3">
                <CategoryChip category={article.category} asLink={false} />
                {article.series && article.seriesName ? (
                    <SeriesTag name={article.seriesName} slug={article.series} />
                ) : null}
            </div>

            <h3 className="mt-4 text-[1.0625rem] font-bold leading-snug tracking-tight decoration-mark underline-offset-4 group-hover:underline">
                <Link href={`/articles/${article.slug}`} className="after:absolute after:inset-0">
                    {article.title}
                </Link>
            </h3>

            <p className="mt-3 font-reading text-[0.9375rem] leading-relaxed text-muted-foreground">
                {article.description}
            </p>

            <ArticleMetaLine article={article} className="mt-5 pt-4 border-t border-hairline" />

            <ArrowUpRight
                aria-hidden="true"
                className="absolute right-5 top-5 size-4 text-faint opacity-0 transition-opacity group-hover:opacity-100"
            />
        </article>
    );
}

/**
 * Index row. The date hangs in the gutter, which is the one piece of metadata
 * that genuinely orders the list — so it earns the position.
 */
export function ArticleRow({
    article,
    className,
}: {
    article: ArticleMeta;
    className?: string;
}) {
    return (
        <article
            className={cn(
                "group relative grid grid-cols-1 gap-x-8 gap-y-2 border-b border-hairline py-7 sm:grid-cols-[5.5rem_minmax(0,1fr)]",
                className,
            )}
        >
            <time
                dateTime={article.isoDate}
                className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-faint sm:pt-1.5"
            >
                {formatDateShort(article.isoDate)}
                <span className="ml-1.5 sm:ml-0 sm:block sm:mt-1">
                    {new Date(article.isoDate).getUTCFullYear()}
                </span>
            </time>

            <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <CategoryChip category={article.category} asLink={false} />
                    {article.series && article.seriesName ? (
                        <SeriesTag name={article.seriesName} slug={article.series} />
                    ) : null}
                </div>

                <h3 className="mt-3 text-base font-bold leading-snug tracking-tight decoration-mark underline-offset-4 group-hover:underline">
                    <Link
                        href={`/articles/${article.slug}`}
                        className="after:absolute after:inset-0"
                    >
                        {article.title}
                    </Link>
                </h3>

                <p className="mt-2 max-w-[62ch] font-reading text-[0.9375rem] leading-relaxed text-muted-foreground">
                    {article.description}
                </p>

                <p className="mt-3 font-mono text-[0.6875rem] tracking-tight text-faint">
                    {article.readingMinutes} min read
                </p>
            </div>
        </article>
    );
}

/** Compact link used for related reading and prev/next. */
export function ArticleLinkCard({
    article,
    eyebrow,
    align = "left",
}: {
    article: ArticleMeta;
    eyebrow: string;
    align?: "left" | "right";
}) {
    return (
        <Link
            href={`/articles/${article.slug}`}
            className={cn(
                "group flex flex-col rounded-lg border border-hairline bg-paper p-5 transition-colors hover:border-accent-edge",
                align === "right" && "sm:items-end sm:text-right",
            )}
        >
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-faint">
                {eyebrow}
            </span>
            <span className="mt-2 text-sm font-bold leading-snug tracking-tight decoration-mark underline-offset-4 group-hover:underline">
                {article.title}
            </span>
            <span className="mt-2 font-mono text-[0.6875rem] text-faint">
                {article.categoryName} · {article.readingMinutes} min
            </span>
        </Link>
    );
}

export function ArticleMetaLine({
    article,
    className,
}: {
    article: ArticleMeta;
    className?: string;
}) {
    return (
        <p
            className={cn(
                "flex flex-wrap items-center gap-x-2 font-mono text-[0.6875rem] text-faint",
                className,
            )}
        >
            <time dateTime={article.isoDate}>{formatDate(article.isoDate)}</time>
            <span aria-hidden="true">·</span>
            <span>{article.readingMinutes} min read</span>
        </p>
    );
}
