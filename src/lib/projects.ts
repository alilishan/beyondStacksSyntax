import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

import { isIllustrationSlug, type IllustrationSlug } from "@/components/project-illustration";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");
const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

/**
 * Like the article taxonomy, these are closed sets. A typo in a project's
 * frontmatter should fail the build, not render a status nobody defined.
 */
export const projectTypes = ["Personal Project", "Independent Product", "Experiment"] as const;
export type ProjectType = (typeof projectTypes)[number];

export const projectStatuses = [
    "Operational",
    "Operational — Private Deployment",
    "Publicly Available",
    "Early Access",
    "In Development",
    "Archived",
] as const;
export type ProjectStatus = (typeof projectStatuses)[number];

/** Link kinds, in display order. The label is fixed so every project reads the same. */
export const projectLinkKinds = {
    website: "Visit website",
    showcase: "Engineering showcase",
    demo: "Live demo",
    repository: "Source code",
} as const;
export type ProjectLinkKind = keyof typeof projectLinkKinds;

export type ProjectLink = { kind: ProjectLinkKind; label: string; href: string };
export type ProjectHighlight = { value: string; label: string };

export type Project = {
    slug: string;
    title: string;
    description: string;
    /** A free label ("AI & Infrastructure"). Projects have no category pages. */
    category: string;
    type: ProjectType;
    status: ProjectStatus;
    tags: string[];
    technologies: string[];
    illustration: IllustrationSlug;
    featured: boolean;
    published: boolean;
    sortOrder: number;
    date?: string;
    updated?: string;
    links: ProjectLink[];
    relatedArticles: string[];
    highlights: ProjectHighlight[];
    /** Label for the link to the overview page. Defaults to "Overview". */
    overviewLabel: string;
    /** A project gets an overview page only when it has a body to put on it. */
    hasPage: boolean;
    body: string;
};

export type ProjectMeta = Omit<Project, "body">;

function fail(file: string, message: string): never {
    throw new Error(`content/projects/${file}: ${message}`);
}

function requireString(value: unknown, field: string, file: string): string {
    if (typeof value !== "string" || value.trim() === "") {
        fail(file, `frontmatter field "${field}" is required and must be a non-empty string.`);
    }
    return value.trim();
}

function stringList(value: unknown, field: string, file: string): string[] {
    if (value == null) return [];
    if (!Array.isArray(value)) fail(file, `frontmatter field "${field}" must be a list.`);
    return value.map(String);
}

function optionalDate(value: unknown, field: string, file: string): string | undefined {
    if (value == null) return undefined;
    const parsed = value instanceof Date ? value : new Date(String(value));
    if (Number.isNaN(parsed.getTime())) {
        fail(file, `frontmatter field "${field}" must be a valid date (YYYY-MM-DD).`);
    }
    return parsed.toISOString();
}

function oneOf<T extends readonly string[]>(
    value: unknown,
    allowed: T,
    field: string,
    file: string,
): T[number] {
    const text = requireString(value, field, file);
    if (!allowed.includes(text)) {
        fail(file, `unknown ${field} "${text}". Expected one of: ${allowed.join(", ")}.`);
    }
    return text as T[number];
}

function parseProject(file: string): Project {
    const raw = fs.readFileSync(path.join(PROJECTS_DIR, file), "utf8");
    const { data, content } = matter(raw);
    const slug = file.replace(/\.mdx?$/, "");

    const illustration = requireString(data.illustration ?? slug, "illustration", file);
    if (!isIllustrationSlug(illustration)) {
        fail(
            file,
            `no illustration "${illustration}". Add a drawing to src/components/project-illustration.tsx.`,
        );
    }

    const links: ProjectLink[] = [];
    for (const kind of Object.keys(projectLinkKinds) as ProjectLinkKind[]) {
        const href = data[kind];
        if (href == null || href === "") continue;
        if (typeof href !== "string" || !/^https:\/\/[^\s]+$/.test(href)) {
            fail(file, `frontmatter field "${kind}" must be an https:// URL.`);
        }
        links.push({ kind, label: projectLinkKinds[kind], href });
    }

    const relatedArticles = stringList(data.relatedArticles, "relatedArticles", file);
    for (const articleSlug of relatedArticles) {
        // Checked against the files rather than the published list, so linking
        // a draft article isn't a build error — it's just not shown until it ships.
        const exists = ["mdx", "md"].some((ext) =>
            fs.existsSync(path.join(ARTICLES_DIR, `${articleSlug}.${ext}`)),
        );
        if (!exists) fail(file, `relatedArticles: no article "${articleSlug}" in content/articles.`);
    }

    const highlights: ProjectHighlight[] = [];
    if (data.highlights != null) {
        if (!Array.isArray(data.highlights)) fail(file, `frontmatter field "highlights" must be a list.`);
        for (const entry of data.highlights) {
            if (
                typeof entry !== "object" ||
                entry === null ||
                typeof entry.value !== "string" ||
                typeof entry.label !== "string"
            ) {
                fail(file, `each highlight needs a string "value" and "label".`);
            }
            highlights.push({ value: entry.value, label: entry.label });
        }
    }

    if (data.sortOrder != null && typeof data.sortOrder !== "number") {
        fail(file, `frontmatter field "sortOrder" must be a number.`);
    }

    return {
        slug,
        title: requireString(data.title, "title", file),
        description: requireString(data.description, "description", file),
        category: requireString(data.category, "category", file),
        type: oneOf(data.type, projectTypes, "type", file),
        status: oneOf(data.status, projectStatuses, "status", file),
        tags: stringList(data.tags, "tags", file),
        technologies: stringList(data.technologies, "technologies", file),
        illustration,
        featured: data.featured === true,
        // Published unless it says otherwise, mirroring `draft` on articles.
        published: data.published !== false,
        sortOrder: typeof data.sortOrder === "number" ? data.sortOrder : Number.MAX_SAFE_INTEGER,
        date: optionalDate(data.date, "date", file),
        updated: optionalDate(data.updatedAt ?? data.updated, "updatedAt", file),
        links,
        relatedArticles,
        highlights,
        overviewLabel:
            data.overviewLabel == null
                ? "Overview"
                : requireString(data.overviewLabel, "overviewLabel", file),
        hasPage: content.trim().length > 0,
        body: content,
    };
}

function readAll(): Project[] {
    if (!fs.existsSync(PROJECTS_DIR)) return [];

    return fs
        .readdirSync(PROJECTS_DIR)
        .filter((file) => /\.mdx?$/.test(file))
        .map(parseProject)
        // Unpublished projects render in `next dev` for review and are absent
        // from production builds entirely — no route, no listing, no sitemap.
        .filter((project) => project.published || process.env.NODE_ENV === "development")
        .sort((a, b) => a.sortOrder - b.sortOrder || a.slug.localeCompare(b.slug));
}

let cache: Project[] | null = null;

function all(): Project[] {
    if (cache === null || process.env.NODE_ENV === "development") {
        cache = readAll();
    }
    return cache;
}

const stripBody = ({ body: _body, ...meta }: Project): ProjectMeta => meta;

export function getAllProjects(): ProjectMeta[] {
    return all().map(stripBody);
}

export function getProject(slug: string): Project | undefined {
    return all().find((project) => project.slug === slug && project.hasPage);
}

export function getProjectPages(): ProjectMeta[] {
    return all()
        .filter((project) => project.hasPage)
        .map(stripBody);
}

export function getFeaturedProjects(limit = 3): ProjectMeta[] {
    return all()
        .filter((project) => project.featured && project.published)
        .slice(0, limit)
        .map(stripBody);
}

/** 1-based position in the published order, for the "01" index in the gutter. */
export function projectIndex(slug: string): string {
    const index = all().findIndex((project) => project.slug === slug);
    return String(index + 1).padStart(2, "0");
}
