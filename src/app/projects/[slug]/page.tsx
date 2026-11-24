import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { site } from "@/lib/site";
import { getArticle } from "@/lib/articles";
import { getProject, getProjectPages } from "@/lib/projects";
import { MDXBody } from "@/components/mdx";
import { GutterLabel } from "@/components/gutter";
import { ArticleLinkCard } from "@/components/article-card";
import { ProjectIllustration } from "@/components/project-illustration";
import {
    ProjectHighlights,
    ProjectLinks,
    ProjectStatus,
    ProjectTags,
    UnpublishedBadge,
} from "@/components/project-parts";

/**
 * Only the slugs generated at build time exist. An unpublished project is
 * filtered out before generateStaticParams sees it, and this makes any other
 * slug a 404 rather than an on-demand render.
 */
export const dynamicParams = false;

export function generateStaticParams() {
    return getProjectPages().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const project = getProject(slug);
    if (!project) return { title: "Project not found" };

    return {
        title: project.title,
        description: project.description,
        alternates: { canonical: `/projects/${project.slug}` },
        // Belt and braces: unpublished projects only render under `next dev`.
        robots: project.published ? undefined : { index: false, follow: false },
        openGraph: {
            type: "website",
            title: project.title,
            description: project.description,
            url: `${site.url}/projects/${project.slug}`,
        },
        twitter: {
            card: "summary_large_image",
            title: project.title,
            description: project.description,
        },
    };
}

export default async function ProjectPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const project = getProject(slug);
    if (!project) notFound();

    const related = project.relatedArticles
        .map((articleSlug) => getArticle(articleSlug))
        .filter((article) => article !== undefined);

    return (
        <>
            <header className="border-b border-hairline">
                <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-accent-ink"
                    >
                        <ArrowLeft aria-hidden="true" className="size-3" />
                        Projects
                    </Link>

                    <div className="mt-8 grid gap-10 md:grid-cols-[minmax(0,1fr)_11rem] md:items-start lg:grid-cols-[minmax(0,1fr)_13rem]">
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-3">
                                <p className="flex flex-wrap items-center gap-x-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-faint">
                                    <span className="text-muted-foreground">{project.category}</span>
                                    <span aria-hidden="true">·</span>
                                    <span>{project.type}</span>
                                </p>
                                {!project.published ? <UnpublishedBadge /> : null}
                            </div>

                            <h1 className="mt-5 max-w-[22ch] text-[clamp(1.7rem,4.6vw,2.6rem)] font-bold leading-[1.12] tracking-[-0.035em] text-ink">
                                {project.title}
                            </h1>

                            <p className="mt-6 max-w-[58ch] font-reading text-lg leading-relaxed text-muted-foreground">
                                {project.description}
                            </p>

                            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                                <ProjectStatus status={project.status} />
                                <ProjectLinks links={project.links} />
                            </div>
                        </div>

                        <ProjectIllustration
                            name={project.illustration}
                            decorative={false}
                            className="w-36 md:w-full"
                        />
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-6xl px-5 sm:px-8">
                <div className="grid gap-x-12 gap-y-12 pt-14 lg:grid-cols-[minmax(0,1fr)_16rem]">
                    <article className="min-w-0">
                        <MDXBody source={project.body} />

                        {project.highlights.length > 0 ? (
                            <section className="mt-14" aria-labelledby="highlights-heading">
                                <GutterLabel className="mb-5">
                                    <span id="highlights-heading">Highlights</span>
                                </GutterLabel>
                                <ProjectHighlights highlights={project.highlights} />
                            </section>
                        ) : null}
                    </article>

                    <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Project details">
                        <dl className="space-y-6 rounded-lg border border-hairline bg-paper p-6">
                            <Fact label="Status">
                                <ProjectStatus status={project.status} />
                            </Fact>
                            <Fact label="Type">
                                <span className="font-reading text-[0.9375rem] text-foreground">
                                    {project.type}
                                </span>
                            </Fact>
                            {project.technologies.length > 0 ? (
                                <Fact label="Built with">
                                    <ul className="space-y-1.5">
                                        {project.technologies.map((tech) => (
                                            <li
                                                key={tech}
                                                className="border-l border-accent-edge pl-3 font-mono text-[0.75rem] text-foreground"
                                            >
                                                {tech}
                                            </li>
                                        ))}
                                    </ul>
                                </Fact>
                            ) : null}
                            {project.tags.length > 0 ? (
                                <Fact label="Tags">
                                    <ProjectTags tags={project.tags} />
                                </Fact>
                            ) : null}
                            {project.links.length > 0 ? (
                                <Fact label="Links">
                                    <ProjectLinks
                                        links={project.links}
                                        className="flex-col items-start gap-y-2"
                                    />
                                </Fact>
                            ) : null}
                        </dl>
                    </aside>
                </div>

                {related.length > 0 ? (
                    <section className="mt-16 border-t border-hairline pt-10" aria-labelledby="related-heading">
                        <GutterLabel className="mb-5">
                            <span id="related-heading">Related articles</span>
                        </GutterLabel>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {related.map((article) => (
                                <ArticleLinkCard
                                    key={article.slug}
                                    article={article}
                                    eyebrow={article.categoryName}
                                />
                            ))}
                        </div>
                    </section>
                ) : null}
            </div>
        </>
    );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <dt>
                <GutterLabel>{label}</GutterLabel>
            </dt>
            <dd className="mt-2.5">{children}</dd>
        </div>
    );
}
