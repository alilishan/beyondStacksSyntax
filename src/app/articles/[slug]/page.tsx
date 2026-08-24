import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { site } from "@/lib/site";
import {
    formatDate,
    getAllArticles,
    getArticle,
    getArticleNeighbours,
    getRelatedArticles,
} from "@/lib/articles";
import { extractHeadings } from "@/lib/headings";
import { CategoryChip, SeriesTag } from "@/components/category-chip";
import { MDXBody } from "@/components/mdx";
import { ArticleGutter, ReadingProgressBar } from "@/components/article-gutter";
import { ArticleLinkCard } from "@/components/article-card";
import { GutterLabel } from "@/components/gutter";

const ARTICLE_BODY_ID = "article-body";

export function generateStaticParams() {
    return getAllArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const article = getArticle(slug);

    if (!article) {
        return { title: "Article not found" };
    }

    const url = `${site.url}/articles/${article.slug}`;

    return {
        title: article.title,
        description: article.description,
        alternates: { canonical: `/articles/${article.slug}` },
        openGraph: {
            type: "article",
            title: article.title,
            description: article.description,
            url,
            publishedTime: article.isoDate,
            modifiedTime: article.updated ?? article.isoDate,
            authors: [site.author.name],
            section: article.categoryName,
            tags: article.tags,
        },
        twitter: {
            card: "summary_large_image",
            title: article.title,
            description: article.description,
        },
    };
}

export default async function ArticlePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const article = getArticle(slug);

    if (!article) notFound();

    const headings = extractHeadings(article.body);
    const { newer, older } = getArticleNeighbours(article.slug);
    const related = getRelatedArticles(article.slug, 2);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: article.title,
        description: article.description,
        datePublished: article.isoDate,
        dateModified: article.updated ?? article.isoDate,
        author: {
            "@type": "Person",
            name: site.author.name,
            url: site.author.resume,
        },
        publisher: { "@type": "Organization", name: site.name },
        mainEntityOfPage: `${site.url}/articles/${article.slug}`,
        articleSection: article.categoryName,
        keywords: article.tags.join(", "),
    };

    return (
        <>
            {/* Rendered into <head> so React doesn't warn about a script inside
                the component tree. Crawlers read it from the server HTML. */}
            <script
                type="application/ld+json"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <ReadingProgressBar targetId={ARTICLE_BODY_ID} />

            <header className="border-b border-hairline">
                <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
                    <Link
                        href="/articles"
                        className="inline-flex items-center gap-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-accent-ink"
                    >
                        <ArrowLeft aria-hidden="true" className="size-3" />
                        Articles
                    </Link>

                    <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
                        <CategoryChip category={article.category} />
                        {article.series && article.seriesName ? (
                            <SeriesTag name={article.seriesName} slug={article.series} />
                        ) : null}
                    </div>

                    <h1 className="mt-5 max-w-[22ch] text-[clamp(1.7rem,4.6vw,2.6rem)] font-bold leading-[1.12] tracking-[-0.035em] text-ink">
                        {article.title}
                    </h1>

                    <p className="mt-6 max-w-[58ch] font-reading text-lg leading-relaxed text-muted-foreground">
                        {article.description}
                    </p>

                    <p className="mt-8 flex flex-wrap items-center gap-x-2 font-mono text-[0.6875rem] text-faint">
                        <span className="text-muted-foreground">{site.author.name}</span>
                        <span aria-hidden="true">·</span>
                        <time dateTime={article.isoDate}>{formatDate(article.isoDate)}</time>
                        <span aria-hidden="true">·</span>
                        <span>{article.readingMinutes} min read</span>
                        {article.updated ? (
                            <>
                                <span aria-hidden="true">·</span>
                                <span>Updated {formatDate(article.updated)}</span>
                            </>
                        ) : null}
                    </p>
                </div>
            </header>

            <div className="mx-auto max-w-6xl px-5 sm:px-8">
                {article.cover ? (
                    <figure className="mt-10 overflow-hidden rounded-lg border border-hairline bg-paper">
                        <Image
                            src={article.cover}
                            alt={article.coverAlt ?? ""}
                            width={1600}
                            height={666}
                            priority
                            className="h-auto w-full"
                        />
                    </figure>
                ) : null}

                <div className="grid gap-x-12 pt-14 lg:grid-cols-[minmax(0,1fr)_13rem]">
                    <article id={ARTICLE_BODY_ID} className="min-w-0 lg:order-1">
                        <MDXBody source={article.body} />

                        {article.tags.length > 0 ? (
                            <div className="mt-14 flex flex-wrap items-center gap-2 border-t border-hairline pt-6">
                                <GutterLabel className="mr-2">Tags</GutterLabel>
                                {article.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-full border border-hairline px-2.5 py-0.5 font-mono text-[0.625rem] text-muted-foreground"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        ) : null}
                    </article>

                    <div className="lg:order-2">
                        <ArticleGutter headings={headings} targetId={ARTICLE_BODY_ID} />
                    </div>
                </div>

                <section className="mt-16 border-t border-hairline pt-10" aria-label="About the author">
                    <div className="flex flex-col gap-4 rounded-lg border border-hairline bg-paper p-7 sm:flex-row sm:items-start sm:gap-7">
                        <div className="min-w-0">
                            <GutterLabel>Written by</GutterLabel>
                            <p className="mt-3 font-mono text-sm font-bold tracking-tight text-ink">
                                {site.author.name}
                            </p>
                            <p className="mt-2 max-w-[58ch] font-reading text-[0.9375rem] leading-relaxed text-muted-foreground">
                                {site.author.shortBio}
                            </p>
                            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                                <Link
                                    href="/about"
                                    className="font-mono text-[0.6875rem] text-ink underline decoration-mark underline-offset-4 transition-colors hover:decoration-current"
                                >
                                    More about me →
                                </Link>
                                <a
                                    href={site.author.resume}
                                    className="font-mono text-[0.6875rem] text-muted-foreground transition-colors hover:text-accent-ink"
                                >
                                    Résumé ↗
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {related.length > 0 ? (
                    <section className="mt-14" aria-labelledby="related-heading">
                        <GutterLabel className="mb-5">
                            <span id="related-heading">Related reading</span>
                        </GutterLabel>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {related.map((entry) => (
                                <ArticleLinkCard
                                    key={entry.slug}
                                    article={entry}
                                    eyebrow={entry.categoryName}
                                />
                            ))}
                        </div>
                    </section>
                ) : null}

                {newer || older ? (
                    <nav
                        aria-label="More articles"
                        className="mt-14 grid gap-4 border-t border-hairline pt-10 sm:grid-cols-2"
                    >
                        {older ? (
                            <ArticleLinkCard article={older} eyebrow="← Older" />
                        ) : (
                            <div className="hidden sm:block" />
                        )}
                        {newer ? (
                            <ArticleLinkCard article={newer} eyebrow="Newer →" align="right" />
                        ) : null}
                    </nav>
                ) : null}
            </div>
        </>
    );
}
