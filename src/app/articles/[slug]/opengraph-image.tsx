import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";

import { formatDate, getAllArticles, getArticle } from "@/lib/articles";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard, ogFonts } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
    return getAllArticles().map((article) => ({ slug: article.slug }));
}

export default async function Image({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const article = getArticle(slug);

    if (!article) notFound();

    return new ImageResponse(
        (
            <OgCard
                eyebrow={article.seriesName ?? article.categoryName}
                title={article.title}
                description={article.description}
                meta={`${formatDate(article.isoDate)} · ${article.readingMinutes} min`}
            />
        ),
        { ...size, fonts: ogFonts() },
    );
}
