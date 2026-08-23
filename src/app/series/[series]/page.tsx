import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { series as allSeries, getSeries } from "@/lib/taxonomy";
import { getArticlesBySeries } from "@/lib/articles";
import { ArticleRow } from "@/components/article-card";
import { PageHeader } from "@/components/page-header";

export function generateStaticParams() {
    return allSeries.map((entry) => ({ series: entry.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ series: string }>;
}): Promise<Metadata> {
    const { series } = await params;
    const meta = getSeries(series);

    if (!meta) return { title: "Series not found" };

    return {
        title: meta.name,
        description: meta.blurb,
        alternates: { canonical: `/series/${meta.slug}` },
    };
}

export default async function SeriesPage({
    params,
}: {
    params: Promise<{ series: string }>;
}) {
    const { series } = await params;
    const meta = getSeries(series);

    if (!meta) notFound();

    // Series read in publication order — the argument builds forwards.
    const articles = getArticlesBySeries(meta.slug);

    return (
        <>
            <PageHeader label="Series" title={meta.name} lede={meta.blurb} />

            <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
                {articles.length > 0 ? (
                    <div className="border-t border-hairline">
                        {articles.map((article) => (
                            <ArticleRow key={article.slug} article={article} />
                        ))}
                    </div>
                ) : (
                    <p className="max-w-[52ch] font-reading text-base leading-relaxed text-muted-foreground">
                        This series hasn&apos;t started yet.
                    </p>
                )}
            </div>
        </>
    );
}
