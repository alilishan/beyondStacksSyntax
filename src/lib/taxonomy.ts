/**
 * Categories and series are a closed set, defined here rather than derived from
 * whatever strings happen to appear in frontmatter. A typo in a post should be a
 * build error, not a new category page with one article on it.
 */

export type CategorySlug =
    | "engineering"
    | "architecture"
    | "infrastructure"
    | "ai"
    | "thinking"
    | "teams";

export type Category = {
    slug: CategorySlug;
    name: string;
    /** Shown on topic tiles and category pages. */
    blurb: string;
};

export const categories: Category[] = [
    {
        slug: "engineering",
        name: "Engineering",
        blurb: "Code, APIs, databases, development practices and software design.",
    },
    {
        slug: "architecture",
        name: "Architecture",
        blurb: "System design, patterns, boundaries, scalability and architectural decisions.",
    },
    {
        slug: "infrastructure",
        name: "Infrastructure",
        blurb: "Containers, cloud, deployment, CI/CD, reliability and operations.",
    },
    {
        slug: "ai",
        name: "AI",
        blurb: "AI-assisted engineering, LLM integration and the changing software landscape.",
    },
    {
        slug: "thinking",
        name: "Engineering Thinking",
        blurb: "Trade-offs, lessons, opinions, failures and engineering judgement.",
    },
    {
        slug: "teams",
        name: "Teams",
        blurb: "Leadership, collaboration, ownership and building effective engineering teams.",
    },
];

export type SeriesSlug =
    | "architecture-decisions"
    | "from-production"
    | "from-the-archive"
    | "changed-my-mind"
    | "keep-it-simple"
    | "under-the-hood"
    | "engineering-notes";

export type Series = {
    slug: SeriesSlug;
    name: string;
    blurb: string;
};

export const series: Series[] = [
    {
        slug: "architecture-decisions",
        name: "Architecture Decisions",
        blurb: "Architectural choices and the consequences that followed them.",
    },
    {
        slug: "from-production",
        name: "From Production",
        blurb: "Lessons that only turned up once real users were involved.",
    },
    {
        slug: "from-the-archive",
        name: "From the Archive",
        blurb: "Revisiting older work, and seeing what has and hasn't aged well.",
    },
    {
        slug: "changed-my-mind",
        name: "Things I've Changed My Mind About",
        blurb: "Engineering opinions that experience eventually rewrote.",
    },
    {
        slug: "keep-it-simple",
        name: "Keep It Simple",
        blurb: "Times the simpler architecture turned out to be the better decision.",
    },
    {
        slug: "under-the-hood",
        name: "Under the Hood",
        blurb: "Technical deep dives into how systems actually work.",
    },
    {
        slug: "engineering-notes",
        name: "Engineering Notes",
        blurb: "Shorter observations that don't need a full long-form article.",
    },
];

const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));
const seriesBySlug = new Map(series.map((s) => [s.slug, s]));

export function getCategory(slug: string): Category | undefined {
    return categoryBySlug.get(slug as CategorySlug);
}

export function getSeries(slug: string): Series | undefined {
    return seriesBySlug.get(slug as SeriesSlug);
}

export function isCategorySlug(slug: string): slug is CategorySlug {
    return categoryBySlug.has(slug as CategorySlug);
}

export function isSeriesSlug(slug: string): slug is SeriesSlug {
    return seriesBySlug.has(slug as SeriesSlug);
}
