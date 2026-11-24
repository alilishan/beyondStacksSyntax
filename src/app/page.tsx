import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { site } from "@/lib/site";
import { categories, series as allSeries } from "@/lib/taxonomy";
import {
    getCategoryCounts,
    getFeaturedArticles,
    getLatestArticles,
    getSeriesCounts,
} from "@/lib/articles";
import { getFeaturedProjects } from "@/lib/projects";
import { Button } from "@/components/ui/button";
import { GutterLabel, RuledHeading } from "@/components/gutter";
import { ArticleCard, ArticleRow } from "@/components/article-card";
import { ProjectCardCompact } from "@/components/project-card";

export default function HomePage() {
    const featured = getFeaturedArticles(3);
    const latest = getLatestArticles(6);
    const categoryCounts = getCategoryCounts();
    const seriesCounts = getSeriesCounts();
    const hasArticles = latest.length > 0;
    const projects = getFeaturedProjects(3);

    return (
        <>
            <Hero />

            <div className="mx-auto max-w-6xl px-5 sm:px-8">
                {featured.length > 0 ? (
                    <section className="pt-16" aria-labelledby="featured-heading">
                        <RuledHeading
                            label="Featured"
                            action={
                                <Link
                                    href="/articles"
                                    className="font-mono text-[0.6875rem] text-muted-foreground transition-colors hover:text-accent-ink"
                                >
                                    All articles →
                                </Link>
                            }
                        />
                        <h2 id="featured-heading" className="sr-only">
                            Featured articles
                        </h2>
                        <div
                            className={cn(
                                "mt-8 grid gap-5",
                                // One featured article shouldn't sit alone in a
                                // three-column grid with two empty thirds.
                                featured.length >= 3
                                    ? "md:grid-cols-2 lg:grid-cols-3"
                                    : featured.length === 2
                                      ? "md:grid-cols-2"
                                      : "max-w-2xl",
                            )}
                        >
                            {featured.map((article) => (
                                <ArticleCard key={article.slug} article={article} />
                            ))}
                        </div>
                    </section>
                ) : null}

                <section className="pt-20" aria-labelledby="topics-heading">
                    <RuledHeading label="Topics" />
                    <h2 id="topics-heading" className="sr-only">
                        Topics
                    </h2>
                    <ul className="mt-8 grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
                        {categories.map((category) => {
                            const count = categoryCounts[category.slug] ?? 0;
                            return (
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
                                                {count.toString().padStart(2, "0")}
                                            </span>
                                        </div>
                                        <p className="mt-2 font-reading text-sm leading-relaxed text-muted-foreground">
                                            {category.blurb}
                                        </p>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </section>

                <section className="pt-20" aria-labelledby="latest-heading">
                    <RuledHeading
                        label="Latest writing"
                        action={
                            <Link
                                href="/articles"
                                className="font-mono text-[0.6875rem] text-muted-foreground transition-colors hover:text-accent-ink"
                            >
                                Archive →
                            </Link>
                        }
                    />
                    <h2 id="latest-heading" className="sr-only">
                        Latest writing
                    </h2>

                    {hasArticles ? (
                        <div className="mt-4">
                            {latest.map((article) => (
                                <ArticleRow key={article.slug} article={article} />
                            ))}
                        </div>
                    ) : (
                        <p className="mt-8 max-w-[52ch] font-reading text-base leading-relaxed text-muted-foreground">
                            The first article is being written. Add an{" "}
                            <code className="font-mono text-[0.85em] text-accent-ink">.mdx</code>{" "}
                            file to{" "}
                            <code className="font-mono text-[0.85em] text-accent-ink">
                                content/articles
                            </code>{" "}
                            and it will appear here.
                        </p>
                    )}
                </section>

                {projects.length > 0 ? (
                    <section className="pt-20" aria-labelledby="projects-heading">
                        <RuledHeading
                            label="Projects"
                            action={
                                <Link
                                    href="/projects"
                                    className="font-mono text-[0.6875rem] text-muted-foreground transition-colors hover:text-accent-ink"
                                >
                                    View all projects →
                                </Link>
                            }
                        />
                        <div className="mt-8 flex flex-col gap-x-10 gap-y-2 md:flex-row md:items-baseline">
                            <h2
                                id="projects-heading"
                                className="shrink-0 font-mono text-base font-bold tracking-tight text-ink"
                            >
                                Beyond the theory.
                            </h2>
                            <p className="max-w-[60ch] font-reading text-[0.9375rem] leading-relaxed text-muted-foreground">
                                Putting ideas into practice through personal projects, engineering
                                experiments and practical solutions.
                            </p>
                        </div>
                        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {projects.map((project) => (
                                <ProjectCardCompact key={project.slug} project={project} />
                            ))}
                        </div>
                    </section>
                ) : null}

                <section className="pt-20" aria-labelledby="series-heading">
                    <RuledHeading label="Series" />
                    <h2 id="series-heading" className="sr-only">
                        Series
                    </h2>
                    <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {allSeries.map((entry) => (
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

                <section className="pt-20" aria-labelledby="about-heading">
                    <RuledHeading label="About" />
                    <h2 id="about-heading" className="sr-only">
                        About
                    </h2>
                    <div className="mt-8 rounded-lg border border-hairline bg-paper p-8 sm:p-10">
                        <p className="max-w-[62ch] font-reading text-lg leading-relaxed text-foreground">
                            {site.author.homeBio}
                        </p>
                        <div className="mt-7 flex flex-wrap gap-3">
                            <Button asChild variant="outline" size="sm">
                                <Link href="/about">
                                    More about me
                                    <ArrowRight aria-hidden="true" />
                                </Link>
                            </Button>
                            <Button asChild variant="ghost" size="sm">
                                <a href={site.author.resume}>Résumé ↗</a>
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

/**
 * The hero states the thesis: the tagline is set as a code comment, because the
 * publication is about the part of a file that isn't syntax.
 */
function Hero() {
    return (
        <section className="relative overflow-hidden border-b border-hairline">
            <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
                <div className="grid gap-y-8 md:grid-cols-[9.5rem_minmax(0,1fr)] md:gap-y-0">
                    <div aria-hidden="true" className="hidden md:block">
                        <div className="space-y-[1.6rem] pt-3 font-mono text-[0.6875rem] text-mark">
                            <p>{"//"}</p>
                            <p>{"//"}</p>
                            <p>{"//"}</p>
                        </div>
                    </div>

                    <div className="border-hairline md:border-l md:pl-8 lg:pl-10">
                        <GutterLabel className="rise">Beyond Stacks &amp; Syntax</GutterLabel>

                        <h1
                            className="rise mt-6 text-[clamp(1.9rem,6vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.035em] text-ink"
                            style={{ animationDelay: "60ms" }}
                        >
                            The thinking
                            <br />
                            behind{" "}
                            <span className="underline decoration-mark decoration-[3px] underline-offset-[8px]">
                                better software
                            </span>
                            .
                        </h1>

                        <p
                            className="rise mt-7 max-w-[54ch] font-reading text-[1.0625rem] leading-relaxed text-muted-foreground sm:text-lg"
                            style={{ animationDelay: "140ms" }}
                        >
                            Practical perspectives on software engineering, architecture,
                            systems, and the decisions behind what we build.
                        </p>

                        <div
                            className="rise mt-9 flex flex-wrap items-center gap-3"
                            style={{ animationDelay: "220ms" }}
                        >
                            <Button asChild variant="default" size="lg">
                                <Link href="/articles">
                                    Read the latest
                                    <ArrowRight aria-hidden="true" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg">
                                <Link href="/about">About</Link>
                            </Button>
                        </div>

                        <p
                            className="rise mt-10 font-mono text-[0.6875rem] leading-relaxed text-faint"
                            style={{ animationDelay: "300ms" }}
                        >
                            <span aria-hidden="true" className="text-mark">
                                {"// "}
                            </span>
                            Software engineering is about more than the technologies we use
                            and the code we write.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
