import type { Metadata } from "next";
import Link from "next/link";

import { categories, series } from "@/lib/taxonomy";
import { getCategoryCounts, getSeriesCounts } from "@/lib/articles";
import { PageHeader } from "@/components/page-header";
import { RuledHeading } from "@/components/gutter";

export const metadata: Metadata = {
    title: "Topics",
    description:
        "Browse Beyond Stacks & Syntax by topic — engineering, architecture, infrastructure, AI, engineering thinking and teams — or follow a series.",
    alternates: { canonical: "/topics" },
};

export default function TopicsPage() {
    const categoryCounts = getCategoryCounts();
    const seriesCounts = getSeriesCounts();

    return (
        <>
            <PageHeader
                label="Index"
                title="Topics"
                lede="Six areas and six running series. The categories describe what an article is about; the series describe how it argues."
            />

            <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
                <section aria-labelledby="categories-heading">
                    <RuledHeading label="Categories" />
                    <h2 id="categories-heading" className="sr-only">
                        Categories
                    </h2>
                    <ul className="mt-8 grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
                        {categories.map((category) => (
                            <li key={category.slug} className="bg-paper">
                                <Link
                                    href={`/topics/${category.slug}`}
                                    className="group flex h-full flex-col p-6 transition-colors hover:bg-accent-wash/50"
                                >
                                    <div className="flex items-baseline justify-between gap-3">
                                        <span className="font-mono text-sm font-bold tracking-tight text-ink decoration-mark underline-offset-4 group-hover:underline">
                                            {category.name}
                                        </span>
                                        <span className="font-mono text-[0.6875rem] tabular-nums text-faint">
                                            {(categoryCounts[category.slug] ?? 0)
                                                .toString()
                                                .padStart(2, "0")}
                                        </span>
                                    </div>
                                    <p className="mt-2 font-reading text-sm leading-relaxed text-muted-foreground">
                                        {category.blurb}
                                    </p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="pt-16" aria-labelledby="series-heading">
                    <RuledHeading label="Series" />
                    <h2 id="series-heading" className="sr-only">
                        Series
                    </h2>
                    <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {series.map((entry) => (
                            <li key={entry.slug}>
                                <Link
                                    href={`/series/${entry.slug}`}
                                    className="group flex h-full flex-col rounded-lg border border-hairline bg-paper p-5 transition-colors hover:border-accent-edge"
                                >
                                    <span className="font-mono text-[0.8125rem] font-bold tracking-tight text-ink decoration-mark underline-offset-4 group-hover:underline">
                                        {entry.name}
                                    </span>
                                    <span className="mt-2 font-reading text-sm leading-relaxed text-muted-foreground">
                                        {entry.blurb}
                                    </span>
                                    <span className="mt-4 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-faint">
                                        {seriesCounts[entry.slug] ?? 0}{" "}
                                        {(seriesCounts[entry.slug] ?? 0) === 1
                                            ? "article"
                                            : "articles"}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </>
    );
}
