import { ImageResponse } from "next/og";

import { site } from "@/lib/site";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard, ogFonts } from "@/lib/og";

export const alt = `${site.name} — ${site.tagline}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
    return new ImageResponse(
        <OgCard
            eyebrow="A publication by Ali Lishan"
            title={site.tagline}
            description={site.description}
        />,
        { ...size, fonts: ogFonts() },
    );
}
