/**
 * Architecture diagrams for project pages, used from MDX as
 * `<Diagram name="lishwise-architecture" caption="…" />`.
 *
 * Inline SVG rather than images, so they follow the theme (`currentColor`)
 * and set their labels in the site's reading face. The `project-art` class
 * opts the moving parts into the shared motion styles in globals.css, and
 * with them the reduced-motion switch-off.
 */

const box = {
    fill: "none",
    stroke: "currentColor",
    strokeOpacity: 0.65,
} as const;

function Node({
    x,
    y,
    title,
    subtitle,
}: {
    x: number;
    y: number;
    title: string;
    subtitle: string;
}) {
    const cx = x + 75;
    return (
        <g>
            <rect x={x} y={y} width="150" height="46" rx="6" {...box} />
            <text x={cx} y={y + 18} fontSize="11" fontWeight="600" textAnchor="middle" fill="currentColor">
                {title}
            </text>
            <text x={cx} y={y + 33} fontSize="9" textAnchor="middle" fill="currentColor" opacity="0.65">
                {subtitle}
            </text>
        </g>
    );
}

function LishwiseArchitecture() {
    return (
        <svg
            viewBox="0 0 340 390"
            role="img"
            aria-labelledby="lishwise-arch-title"
            className="project-art mx-auto block w-full max-w-[26rem] text-ink"
            style={{ fontFamily: "var(--font-reading)" }}
        >
            <title id="lishwise-arch-title">
                Lishwise architecture: a Telegram message passes to OpenAI for intent
                interpretation, becomes validated structured instructions, and is executed by
                an application layer of deterministic business rules, which writes to the
                financial database and to Dropbox receipt storage, and sends a formatted
                response back to Telegram.
            </title>

            <Node x={95} y={8} title="Telegram" subtitle="Natural language interface" />
            <Node x={95} y={85} title="OpenAI" subtitle="Intent interpretation" />
            <Node x={95} y={162} title="Structured instructions" subtitle="Validated operations" />
            <Node x={95} y={239} title="Application layer" subtitle="Deterministic business rules" />
            <Node x={5} y={332} title="Financial database" subtitle="Authoritative records" />
            <Node x={185} y={332} title="Dropbox" subtitle="Receipt storage" />

            <g stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M170 54 V81 M165 76 L170 81 L175 76" />
                <path d="M170 131 V158 M165 153 L170 158 L175 153" />
                <path d="M170 208 V235 M165 230 L170 235 L175 230" />
                <path d="M170 285 V307 H80 V328 M170 307 H260 V328 M75 323 L80 328 L85 323 M255 323 L260 328 L265 323" />

                {/* the reply travels back up to the conversation */}
                <g opacity="0.55">
                    <path d="M95 262 H20 V31 H91" strokeDasharray="4 4" className="pa-flow" />
                    <path d="M86 26 L91 31 L86 36" />
                </g>
            </g>

            <text
                x="12"
                y="151"
                fontSize="9"
                textAnchor="middle"
                fill="currentColor"
                opacity="0.7"
                transform="rotate(-90 12 151)"
            >
                Formatted response
            </text>
        </svg>
    );
}

export const diagrams = {
    "lishwise-architecture": LishwiseArchitecture,
} as const;

export type DiagramName = keyof typeof diagrams;
