import type { MetadataRoute } from "next";

import { site } from "@/lib/site";
import { getAllArticles } from "@/lib/articles";
import { categories, series } from "@/lib/taxonomy";

export default function sitemap(): MetadataRoute.Sitemap {
    const articles = getAllArticles();
    const newest = articles[0]?.isoDate ?? new Date().toISOString();

    return [
        { url: site.url, lastModified: newest, changeFrequency: "weekly", priority: 1 },
        {
            url: `${site.url}/articles`,
            lastModified: newest,
            changeFrequency: "weekly",
            priority: 0.9,
        },
        { url: `${site.url}/topics`, changeFrequency: "monthly", priority: 0.6 },
        { url: `${site.url}/about`, changeFrequency: "yearly", priority: 0.5 },
        ...articles.map((article) => ({
            url: `${site.url}/articles/${article.slug}`,
            lastModified: article.updated ?? article.isoDate,
            changeFrequency: "yearly" as const,
            priority: 0.8,
        })),
        ...categories.map((category) => ({
            url: `${site.url}/topics/${category.slug}`,
            changeFrequency: "weekly" as const,
            priority: 0.5,
        })),
        ...series.map((entry) => ({
            url: `${site.url}/series/${entry.slug}`,
            changeFrequency: "weekly" as const,
            priority: 0.5,
        })),
    ];
}
