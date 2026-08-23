import { site } from "@/lib/site";
import { getAllArticles } from "@/lib/articles";

function escapeXml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

export const dynamic = "force-static";

export function GET() {
    const articles = getAllArticles();
    const updated = articles[0]?.isoDate ?? new Date().toISOString();

    const items = articles
        .map(
            (article) => `        <item>
            <title>${escapeXml(article.title)}</title>
            <link>${site.url}/articles/${article.slug}</link>
            <guid isPermaLink="true">${site.url}/articles/${article.slug}</guid>
            <description>${escapeXml(article.description)}</description>
            <category>${escapeXml(article.categoryName)}</category>
            <pubDate>${new Date(article.isoDate).toUTCString()}</pubDate>
            <dc:creator>${escapeXml(site.author.name)}</dc:creator>
        </item>`,
        )
        .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
    <channel>
        <title>${escapeXml(site.name)}</title>
        <link>${site.url}</link>
        <description>${escapeXml(site.seoDescription)}</description>
        <language>en-gb</language>
        <lastBuildDate>${new Date(updated).toUTCString()}</lastBuildDate>
        <atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml" />
${items}
    </channel>
</rss>
`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
        },
    });
}
