import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import {
    getCategory,
    getSeries,
    isCategorySlug,
    isSeriesSlug,
    type CategorySlug,
    type SeriesSlug,
} from "@/lib/taxonomy";

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

export type Article = {
    slug: string;
    title: string;
    description: string;
    category: CategorySlug;
    categoryName: string;
    series?: SeriesSlug;
    seriesName?: string;
    date: string;
    /** ISO-8601, for <time> and structured data. */
    isoDate: string;
    updated?: string;
    featured: boolean;
    draft: boolean;
    tags: string[];
    readingMinutes: number;
    /** Raw MDX body with frontmatter stripped. */
    body: string;
};

export type ArticleMeta = Omit<Article, "body">;

function requireString(
    value: unknown,
    field: string,
    file: string,
): string {
    if (typeof value !== "string" || value.trim() === "") {
        throw new Error(
            `content/articles/${file}: frontmatter field "${field}" is required and must be a non-empty string.`,
        );
    }
    return value.trim();
}

function parseArticle(file: string): Article {
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf8");
    const { data, content } = matter(raw);

    const slug = file.replace(/\.mdx?$/, "");
    const title = requireString(data.title, "title", file);
    const description = requireString(data.description, "description", file);
    const categorySlug = requireString(data.category, "category", file);
    const dateValue = data.date;

    if (!isCategorySlug(categorySlug)) {
        throw new Error(
            `content/articles/${file}: unknown category "${categorySlug}". Add it to src/lib/taxonomy.ts or fix the frontmatter.`,
        );
    }

    const date = dateValue instanceof Date ? dateValue : new Date(String(dateValue));
    if (Number.isNaN(date.getTime())) {
        throw new Error(
            `content/articles/${file}: frontmatter field "date" is required and must be a valid date (YYYY-MM-DD).`,
        );
    }

    let seriesSlug: SeriesSlug | undefined;
    if (data.series != null) {
        const value = String(data.series);
        if (!isSeriesSlug(value)) {
            throw new Error(
                `content/articles/${file}: unknown series "${value}". Add it to src/lib/taxonomy.ts or fix the frontmatter.`,
            );
        }
        seriesSlug = value;
    }

    let updated: string | undefined;
    if (data.updated != null) {
        const parsed =
            data.updated instanceof Date ? data.updated : new Date(String(data.updated));
        if (Number.isNaN(parsed.getTime())) {
            throw new Error(
                `content/articles/${file}: frontmatter field "updated" must be a valid date (YYYY-MM-DD).`,
            );
        }
        updated = parsed.toISOString();
    }

    return {
        slug,
        title,
        description,
        category: categorySlug,
        categoryName: getCategory(categorySlug)!.name,
        series: seriesSlug,
        seriesName: seriesSlug ? getSeries(seriesSlug)!.name : undefined,
        date: date.toISOString(),
        isoDate: date.toISOString(),
        updated,
        featured: data.featured === true,
        draft: data.draft === true,
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
        body: content,
    };
}

function readAll(): Article[] {
    if (!fs.existsSync(ARTICLES_DIR)) return [];

    return fs
        .readdirSync(ARTICLES_DIR)
        .filter((file) => /\.mdx?$/.test(file))
        .map(parseArticle)
        .filter((article) => !article.draft || process.env.NODE_ENV === "development")
        .sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Parsed once per process. The content directory is read at build time, so
 * there is nothing to invalidate in production; `next dev` restarts the worker
 * when files under content/ change.
 */
let cache: Article[] | null = null;

function all(): Article[] {
    if (cache === null || process.env.NODE_ENV === "development") {
        cache = readAll();
    }
    return cache;
}

const stripBody = ({ body: _body, ...meta }: Article): ArticleMeta => meta;

export function getAllArticles(): ArticleMeta[] {
    return all().map(stripBody);
}

export function getArticle(slug: string): Article | undefined {
    return all().find((article) => article.slug === slug);
}

export function getFeaturedArticles(limit = 3): ArticleMeta[] {
    const featured = all().filter((a) => a.featured);
    const pool = featured.length > 0 ? featured : all();
    return pool.slice(0, limit).map(stripBody);
}

export function getLatestArticles(limit?: number): ArticleMeta[] {
    const list = all().map(stripBody);
    return limit ? list.slice(0, limit) : list;
}

export function getArticlesByCategory(category: string): ArticleMeta[] {
    return all()
        .filter((a) => a.category === category)
        .map(stripBody);
}

export function getArticlesBySeries(seriesSlug: string): ArticleMeta[] {
    return all()
        .filter((a) => a.series === seriesSlug)
        .map(stripBody)
        .sort((a, b) => a.date.localeCompare(b.date));
}

export function getCategoryCounts(): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const article of all()) {
        counts[article.category] = (counts[article.category] ?? 0) + 1;
    }
    return counts;
}

export function getSeriesCounts(): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const article of all()) {
        if (article.series) {
            counts[article.series] = (counts[article.series] ?? 0) + 1;
        }
    }
    return counts;
}

/** Newer/older neighbours in publication order, for the article footer. */
export function getArticleNeighbours(slug: string): {
    newer?: ArticleMeta;
    older?: ArticleMeta;
} {
    const list = all();
    const index = list.findIndex((a) => a.slug === slug);
    if (index === -1) return {};
    return {
        newer: index > 0 ? stripBody(list[index - 1]) : undefined,
        older: index < list.length - 1 ? stripBody(list[index + 1]) : undefined,
    };
}

/**
 * Related reading: same series first, then same category, newest first.
 */
export function getRelatedArticles(slug: string, limit = 2): ArticleMeta[] {
    const current = getArticle(slug);
    if (!current) return [];

    const scored = all()
        .filter((a) => a.slug !== slug)
        .map((a) => ({
            article: a,
            score:
                (current.series && a.series === current.series ? 2 : 0) +
                (a.category === current.category ? 1 : 0),
        }))
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score || b.article.date.localeCompare(a.article.date));

    return scored.slice(0, limit).map((entry) => stripBody(entry.article));
}

export function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    });
}

export function formatDateShort(iso: string): string {
    return new Date(iso).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        timeZone: "UTC",
    });
}
