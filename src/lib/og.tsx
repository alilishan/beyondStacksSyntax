import fs from "node:fs";
import path from "node:path";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const FONT_DIR = path.join(
    process.cwd(),
    "node_modules",
    "@fontsource",
    "jetbrains-mono",
    "files",
);

/**
 * Read the brand face from node_modules rather than fetching it.
 *
 * Satori handles ttf/otf/woff but not woff2, and a build that reaches the
 * network to render a social card is a build that can fail for reasons that
 * have nothing to do with the code.
 */
function loadFont(weight: 400 | 700): Buffer {
    return fs.readFileSync(
        path.join(FONT_DIR, `jetbrains-mono-latin-${weight}-normal.woff`),
    );
}

export function ogFonts() {
    return [
        { name: "JetBrains Mono", data: loadFont(400), weight: 400 as const, style: "normal" as const },
        { name: "JetBrains Mono", data: loadFont(700), weight: 700 as const, style: "normal" as const },
    ];
}

const INK = "#14181c";
const PAPER = "#ffffff";
const MUTED = "#6b7480";
const FAINT = "#9aa3ad";
const MARK = "#9ca0a8";
const RULE = "#e3e7eb";

/**
 * The share card is the site's hero, reduced: the hatch strip, the gutter rule,
 * the `//` mark, and the title. Nothing else.
 */
export function OgCard({
    eyebrow,
    title,
    description,
    meta,
}: {
    eyebrow: string;
    title: string;
    description?: string;
    meta?: string;
}) {
    // Satori has no line-clamp, so the deck is trimmed on a word boundary.
    const deck =
        description && description.length > 150
            ? `${description.slice(0, 150).replace(/\s+\S*$/, "")}…`
            : description;

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: PAPER,
                fontFamily: "JetBrains Mono",
                position: "relative",
            }}
        >
            {/* the diagonal hatch, as a strip along the top */}
            <div
                style={{
                    display: "flex",
                    height: 14,
                    width: "100%",
                    backgroundImage: `repeating-linear-gradient(315deg, ${MARK} 0, ${MARK} 1px, ${PAPER} 0, ${PAPER} 50%)`,
                    backgroundSize: "10px 10px",
                }}
            />

            <div
                style={{
                    display: "flex",
                    flex: 1,
                    padding: "62px 72px 56px 72px",
                }}
            >
                {/* the gutter */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: 58,
                        color: MARK,
                        fontSize: 20,
                        lineHeight: 1.6,
                    }}
                >
                    <div style={{ display: "flex" }}>{"//"}</div>
                    <div style={{ display: "flex" }}>{"//"}</div>
                    <div style={{ display: "flex" }}>{"//"}</div>
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                        borderLeft: `1px solid ${RULE}`,
                        paddingLeft: 44,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            fontSize: 20,
                            letterSpacing: 3,
                            textTransform: "uppercase",
                            color: MUTED,
                        }}
                    >
                        {eyebrow}
                    </div>

                    <div
                        style={{
                            display: "flex",
                            marginTop: 34,
                            fontSize: title.length > 68 ? 52 : 64,
                            fontWeight: 700,
                            lineHeight: 1.14,
                            letterSpacing: -2,
                            color: INK,
                        }}
                    >
                        {title}
                    </div>

                    {deck ? (
                        <div
                            style={{
                                display: "flex",
                                marginTop: 26,
                                fontSize: 24,
                                lineHeight: 1.5,
                                color: MUTED,
                            }}
                        >
                            {deck}
                        </div>
                    ) : null}

                    <div style={{ display: "flex", flex: 1 }} />

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderTop: `1px solid ${RULE}`,
                            paddingTop: 26,
                        }}
                    >
                        <div style={{ display: "flex", fontSize: 22, color: INK }}>
                            <span style={{ color: INK }}>Beyond&nbsp;Stacks</span>
                            <span style={{ color: FAINT }}>&nbsp;&amp;&nbsp;</span>
                            <span style={{ color: INK }}>Syntax</span>
                        </div>
                        {meta ? (
                            <div style={{ display: "flex", fontSize: 20, color: FAINT }}>
                                {meta}
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}
