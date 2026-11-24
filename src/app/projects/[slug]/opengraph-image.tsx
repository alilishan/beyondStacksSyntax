import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";

import { getProject, getProjectPages } from "@/lib/projects";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard, ogFonts } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
    return getProjectPages().map((project) => ({ slug: project.slug }));
}

export default async function Image({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const project = getProject(slug);
    if (!project) notFound();

    return new ImageResponse(
        (
            <OgCard
                eyebrow={`Projects · ${project.category}`}
                title={project.title}
                description={project.description}
                meta={project.status}
            />
        ),
        { ...size, fonts: ogFonts() },
    );
}
