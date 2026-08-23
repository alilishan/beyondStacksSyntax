import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { categories, getCategory } from "@/lib/taxonomy";
import { getArticlesByCategory } from "@/lib/articles";
import { ArticleRow } from "@/components/article-card";
import { PageHeader } from "@/components/page-header";

export function generateStaticParams() {
    return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ category: string }>;
}): Promise<Metadata> {
    const { category } = await params;
    const meta = getCategory(category);

    if (!meta) return { title: "Topic not found" };

    return {
        title: meta.name,
        description: meta.blurb,
        alternates: { canonical: `/topics/${meta.slug}` },
    };
}

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ category: string }>;
}) {
    const { category } = await params;
    const meta = getCategory(category);

    if (!meta) notFound();

    const articles = getArticlesByCategory(meta.slug);

    return (
        <>
            <PageHeader label="Topic" title={meta.name} lede={meta.blurb} />

            <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
                {articles.length > 0 ? (
                    <div className="border-t border-hairline">
                        {articles.map((article) => (
                            <ArticleRow key={article.slug} article={article} />
                        ))}
                    </div>
                ) : (
                    <p className="max-w-[52ch] font-reading text-base leading-relaxed text-muted-foreground">
                        Nothing filed under {meta.name} yet. It&apos;s on the list.
                    </p>
                )}
            </div>
        </>
    );
}
