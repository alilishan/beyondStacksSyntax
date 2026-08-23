import type { Metadata } from "next";
import Link from "next/link";

import { getAllArticles, getCategoryCounts } from "@/lib/articles";
import { categories } from "@/lib/taxonomy";
import { ArticleRow } from "@/components/article-card";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
    title: "Articles",
    description:
        "Every article on Beyond Stacks & Syntax — software engineering, architecture, infrastructure, AI and engineering thinking.",
    alternates: { canonical: "/articles" },
};

export default function ArticlesPage() {
    const articles = getAllArticles();
    const counts = getCategoryCounts();

    return (
        <>
            <PageHeader
                label="Archive"
                title="Articles"
                lede="Everything published so far, newest first. Some of it is architecture, some of it is production, most of it is trade-offs."
            />

            <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
                <nav aria-label="Filter by topic" className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full border border-accent-edge bg-accent-wash px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-accent-ink">
                        All · {articles.length}
                    </span>
                    {categories.map((category) => (
                        <Link
                            key={category.slug}
                            href={`/topics/${category.slug}`}
                            className="inline-flex items-center rounded-full border border-hairline px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-accent-edge hover:text-accent-ink"
                        >
                            {category.name} · {counts[category.slug] ?? 0}
                        </Link>
                    ))}
                </nav>

                {articles.length > 0 ? (
                    <div className="mt-10 border-t border-hairline">
                        {articles.map((article) => (
                            <ArticleRow key={article.slug} article={article} />
                        ))}
                    </div>
                ) : (
                    <p className="mt-12 max-w-[52ch] font-reading text-base leading-relaxed text-muted-foreground">
                        Nothing published yet. Add an{" "}
                        <code className="font-mono text-[0.85em] text-accent-ink">.mdx</code> file
                        to{" "}
                        <code className="font-mono text-[0.85em] text-accent-ink">
                            content/articles
                        </code>{" "}
                        to get started.
                    </p>
                )}
            </div>
        </>
    );
}
