import Link from "next/link";

import { cn } from "@/lib/utils";
import { projectIndex, type ProjectMeta } from "@/lib/projects";
import { ProjectIllustration } from "@/components/project-illustration";
import {
    ProjectLinks,
    ProjectStatus,
    ProjectTags,
    UnpublishedBadge,
} from "@/components/project-parts";

/**
 * The project's eyebrow: category, then type. Set like the article meta line.
 */
function Eyebrow({ project }: { project: ProjectMeta }) {
    return (
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-faint">
            <span className="text-muted-foreground">{project.category}</span>
            <span aria-hidden="true">·</span>
            <span>{project.type}</span>
        </p>
    );
}

function Title({
    project,
    as: Tag,
    className,
}: {
    project: ProjectMeta;
    as: "h2" | "h3";
    className?: string;
}) {
    return (
        <Tag
            className={cn(
                "font-bold tracking-tight text-ink decoration-mark underline-offset-4",
                project.hasPage && "group-hover:underline",
                className,
            )}
        >
            {project.hasPage ? (
                // The whole row is the hit area; the external links sit above
                // this overlay (z-10) so they stay independently clickable.
                <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0">
                    {project.title}
                </Link>
            ) : (
                project.title
            )}
        </Tag>
    );
}

/**
 * Index row for /projects. Mirrors ArticleRow: the index number hangs in the
 * gutter, the copy reads left, and the drawing sits right on desktop.
 * Projects are separated by hairlines, not boxed.
 */
export function ProjectCard({ project }: { project: ProjectMeta }) {
    return (
        <article className="group relative grid grid-cols-1 gap-x-8 gap-y-5 border-b border-hairline py-10 sm:grid-cols-[5.5rem_minmax(0,1fr)] md:grid-cols-[5.5rem_minmax(0,1fr)_10rem] lg:grid-cols-[5.5rem_minmax(0,1fr)_11rem]">
            <p
                aria-hidden="true"
                className="hidden font-mono text-[0.6875rem] tabular-nums tracking-[0.12em] text-faint sm:block sm:pt-1"
            >
                {projectIndex(project.slug)}
            </p>

            <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                    <Eyebrow project={project} />
                    {!project.published ? <UnpublishedBadge /> : null}
                </div>

                <Title project={project} as="h2" className="mt-3 text-xl leading-snug" />

                <p className="mt-3 max-w-[62ch] font-reading text-[0.9375rem] leading-relaxed text-muted-foreground">
                    {project.description}
                </p>

                <ProjectTags tags={project.tags} className="mt-5" />

                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-hairline pt-4">
                    <ProjectStatus status={project.status} />
                    <ProjectLinks links={project.links} />
                    {project.hasPage ? (
                        <span
                            aria-hidden="true"
                            className="font-mono text-[0.6875rem] text-muted-foreground transition-colors group-hover:text-accent-ink"
                        >
                            {project.overviewLabel} →
                        </span>
                    ) : null}
                </div>
            </div>

            <div className="order-first w-28 sm:col-start-2 md:order-none md:col-start-auto md:w-full">
                <ProjectIllustration name={project.illustration} className="w-full" />
            </div>
        </article>
    );
}

/** Homepage version: same parts, reduced, in a three-up grid. */
export function ProjectCardCompact({ project }: { project: ProjectMeta }) {
    return (
        <article className="group relative flex h-full flex-col rounded-lg border border-hairline bg-paper p-5 transition-colors hover:border-accent-edge">
            <div className="flex items-start justify-between gap-4">
                <ProjectIllustration name={project.illustration} compact className="w-20" />
                <ProjectStatus status={project.status} className="mt-1" />
            </div>

            <div className="mt-5">
                <Eyebrow project={project} />
            </div>
            <Title project={project} as="h3" className="mt-2 text-base leading-snug" />
            <p className="mt-2 font-reading text-sm leading-relaxed text-muted-foreground">
                {project.description}
            </p>
        </article>
    );
}
