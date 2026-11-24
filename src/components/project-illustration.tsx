import type { CSSProperties, JSX } from "react";

import { cn } from "@/lib/utils";

/**
 * Project illustrations — one visual language for the whole collection.
 *
 * Each drawing is authored on its own small grid (`box`, e.g. 180×160): objects
 * on the upper row, a module at the bottom, joined by dashed connectors. It is
 * scaled to fit and centred inside a square 200×200 frame with a rounded wash
 * behind it. Where shapes overlap, `pa-solid` gives the front one an opaque
 * paper fill so it hides what's behind in both themes.
 *
 * Everything strokes in `currentColor`, so the drawings follow the theme.
 *
 * Motion is quiet and slow, and all of it lives in globals.css (`.pa-*`):
 *   pa-flow      dashes march along a connector, in the direction it is drawn
 *   pa-pingpong  dashes march one way, then back — a two-way relationship
 *   pa-draw      a stroke draws itself in (needs pathLength="1")
 *   pa-wave      a bar breathes vertically about its centre
 *   pa-grow      a bar rises from its baseline
 *   pa-blink     an indicator fades down and back
 *   pa-typing    a dot lifts, like a typing indicator
 *   pa-float     a shape drifts gently up and down
 *   pa-file      a document dips into its folder and back
 * Connectors are split so every one is drawn *towards* the bottom module —
 * the marching dashes then show the data flowing into it.
 *
 * Every element's resting (un-animated) state is the finished drawing, so
 * under `prefers-reduced-motion` the animations are switched off and nothing
 * is left half-drawn.
 *
 * Adding a project: add its drawing here, register it in `illustrations`, and
 * name it in the project's `illustration` frontmatter (defaults to the slug).
 */

const delay = (seconds: number): CSSProperties => ({ animationDelay: `${seconds}s` });

function AudioLessonStudio() {
    const bars: [number, number, number][] = [
        [74, 132, 142],
        [82, 126, 148],
        [90, 121.5, 152.5],
        [98, 129, 145],
        [106, 123.5, 150.5],
        [114, 131, 143],
        [122, 125.5, 148.5],
    ];
    return (
        <>
            {/* laptop */}
            <rect x="17" y="15" width="64" height="43" rx="3" />
            <path d="M17 63 H81 L90 71 H8 Z" />

            {/* server stack, with activity lights */}
            <rect x="127" y="14" width="43" height="20" rx="3" />
            <rect x="127" y="38" width="43" height="20" rx="3" />
            <rect x="127" y="62" width="43" height="20" rx="3" />
            {[24, 48, 72].map((y, i) => (
                <path key={y} d={`M135 ${y} h13`} className="pa-blink" style={delay(i * 0.5)} />
            ))}

            {/* laptop ⇄ server: workload coordination */}
            <path d="M83 42 H125" className="pa-dash pa-pingpong" />
            <path d="M90 37 l-6 5 6 5 M118 37 l6 5 -6 5" />

            {/* both workers → audio */}
            <path d="M49 75 V102 H98" className="pa-dash pa-flow" />
            <path d="M149 86 V102 H98" className="pa-dash pa-flow" />
            <path d="M98 102 V116" className="pa-dash pa-flow" />

            {/* waveform module */}
            <rect x="65" y="118" width="66" height="39" rx="5" />
            {bars.map(([x, y1, y2], i) => (
                <line
                    key={x}
                    x1={x}
                    x2={x}
                    y1={y1}
                    y2={y2}
                    className="pa-wave"
                    style={delay(i * 0.14)}
                />
            ))}
        </>
    );
}

function FixtureFlow() {
    return (
        <>
            {/* pitch */}
            <rect x="9" y="15" width="79" height="57" rx="3" />
            <path d="M48.5 15 V72" />
            <circle cx="48.5" cy="43.5" r="10" />
            <path d="M9 28 H23 V59 H9 M88 28 H74 V59 H88 M9 36 H16 V51 H9 M88 36 H81 V51 H88" />

            {/* standings table */}
            <rect x="119" y="15" width="51" height="57" rx="3" />
            <path d="M119 28 H170 M119 42 H170 M119 56 H170 M137 28 V72 M153 28 V72 M126 22 H147" />

            {/* pitch → table, then both → bracket */}
            <path d="M91 43 H116" className="pa-dash pa-flow" />
            <path d="M49 77 V89 H96" className="pa-dash pa-flow" />
            <path d="M144 77 V89 H96" className="pa-dash pa-flow" />
            <path d="M96 89 V99" className="pa-dash pa-flow" />

            {/* bracket: entries, then each round's progression drawn in order */}
            <rect x="55" y="103" width="25" height="11" rx="2" />
            <rect x="55" y="122" width="25" height="11" rx="2" />
            <rect x="55" y="141" width="25" height="11" rx="2" />
            <path d="M80 108 H91 V127 H80" pathLength={1} className="pa-draw" style={delay(0)} />
            <path d="M91 118 H104" pathLength={1} className="pa-draw" style={delay(0.5)} />
            <path d="M80 146 H97 V137 H104" pathLength={1} className="pa-draw" style={delay(0.5)} />
            <rect x="104" y="112" width="25" height="12" rx="2" />
            <rect x="104" y="131" width="25" height="12" rx="2" />
            <path d="M129 118 H140 V137 H129" pathLength={1} className="pa-draw" style={delay(1)} />
            <path d="M140 127 H148" pathLength={1} className="pa-draw" style={delay(1.5)} />
            <rect x="148" y="121" width="22" height="12" rx="2" />
            <rect x="148" y="121" width="22" height="12" rx="2" className="pa-winner" stroke="none" />
        </>
    );
}

function Revyze() {
    const ticks = [22, 34, 46, 58];
    return (
        <>
            {/* a stack of past papers — the solid fill hides the sheets behind */}
            <rect x="14" y="20" width="43" height="59" rx="2" />
            <rect x="9" y="15" width="43" height="59" rx="2" className="pa-solid" />
            <rect x="4" y="10" width="43" height="59" rx="2" className="pa-solid" />
            <path d="M12 19 H38 M12 26 H38 M12 33 H30 M12 59 H38" />
            <circle cx="24" cy="46" r="7" />
            <path d="M24 39 V53 M17 46 H31" />

            {/* papers → structured question bank, categorised item by item */}
            <path d="M59 42 H76" className="pa-dash pa-flow" />
            <path d="M69 38 L74 42 L69 46" />
            <rect x="79" y="12" width="43" height="59" rx="3" />
            {ticks.map((y, i) => (
                <g key={y}>
                    <rect x="86" y={y - 3} width="6" height="6" rx="1" />
                    <path d={`M98 ${y} H114`} />
                    <path
                        d={`M87.2 ${y} l1.6 1.6 l2.4 -3`}
                        pathLength={1}
                        className="pa-draw"
                        style={delay(i * 0.45)}
                    />
                </g>
            ))}

            {/* question bank → pattern analysis */}
            <path d="M125 42 H146" className="pa-dash pa-flow" />
            <path d="M139 38 L144 42 L139 46" />
            <rect x="149" y="12" width="45" height="59" rx="3" />
            <path d="M156 20 V61 H187" />
            <rect x="160" y="47" width="5" height="14" className="pa-grow" style={delay(0)} />
            <rect x="167" y="33" width="5" height="28" className="pa-grow" style={delay(0.2)} />
            <rect x="174" y="39" width="5" height="22" className="pa-grow" style={delay(0.4)} />
            <rect x="181" y="25" width="5" height="36" className="pa-grow" style={delay(0.6)} />

            {/* both → focused revision */}
            <path d="M100 74 V95" className="pa-dash pa-flow" />
            <path d="M171 74 V95 H100" className="pa-dash pa-flow" />
            <path d="M100 95 V110" className="pa-dash pa-flow" />

            {/* open book */}
            <path d="M100 120 Q78 107 51 115 V160 Q78 153 100 166 Q122 153 149 160 V115 Q122 107 100 120 Z M100 120 V166" />
            <path d="M60 126 Q77 122 91 131 M60 137 Q77 133 91 142 M60 148 Q77 144 91 153" />
            <path d="M109 131 Q124 122 140 126 M109 142 Q124 133 140 137 M109 153 Q124 144 140 148" />
        </>
    );
}

function Lishwise() {
    return (
        <>
            {/* phone running the Telegram conversation */}
            <rect x="13" y="9" width="40" height="66" rx="5" />
            <path d="M26 15 H40 M28 68 H38" />
            <g className="pa-float">
                <path d="M21 28 L46 22 L39 49 L31 40 L24 45 L27 36 Z M27 36 L46 22" />
            </g>

            {/* phone → model: intent interpretation */}
            <path d="M56 43 H73" className="pa-dash pa-flow" />
            <path d="M64 39 L69 43 L64 47" />

            {/* the model, emitting structured instructions */}
            <rect x="77" y="20" width="49" height="45" rx="5" />
            <rect x="88" y="30" width="27" height="25" rx="3" />
            <path d="M95 15 V20 M108 15 V20 M95 65 V70 M108 65 V70 M72 34 H77 M72 48 H77 M126 34 H131 M126 48 H131" />
            <path d="M96 38 L92 43 L96 48 M107 38 L111 43 L107 48" />
            <path d="M104 36 L99 50" className="pa-blink" />

            {/* model → authoritative records */}
            <path d="M132 43 H140" className="pa-dash pa-flow" />
            <path d="M135 39 L140 43 L135 47" />
            <ellipse cx="166" cy="23" rx="23" ry="9" />
            <path d="M143 23 V59 C143 71 189 71 189 59 V23 M143 35 C143 47 189 47 189 35 M143 47 C143 59 189 59 189 47" />

            {/* model → receipts and summaries */}
            <path d="M101 72 V94" className="pa-dash pa-flow" />
            <path d="M101 94 H47 V110" className="pa-dash pa-flow" />
            <path d="M101 94 H155 V110" className="pa-dash pa-flow" />

            {/* receipt filed into its folder: back, receipt, then the solid front */}
            <path d="M17 117 H40 L47 124 H78 V161 H17 Z" />
            <g className="pa-file">
                <rect x="34" y="108" width="27" height="40" rx="2" className="pa-solid" />
                <path d="M40 117 H55 M40 124 H55 M40 131 H51 M40 138 H55" />
            </g>
            <path d="M17 133 H78 V161 H17 Z" className="pa-solid" />

            {/* financial summary */}
            <rect x="120" y="112" width="69" height="49" rx="4" />
            <path d="M130 122 V151 H180" />
            <rect x="137" y="138" width="8" height="13" className="pa-grow" style={delay(0)} />
            <rect x="151" y="130" width="8" height="21" className="pa-grow" style={delay(0.25)} />
            <rect x="165" y="123" width="8" height="28" className="pa-grow" style={delay(0.5)} />
        </>
    );
}

const illustrations = {
    "audio-lesson-studio": {
        Drawing: AudioLessonStudio,
        box: [180, 160],
        description:
            "A laptop and a three-unit server stack exchanging work over a two-way dashed link, both feeding an audio waveform module below.",
    },
    fixtureflow: {
        Drawing: FixtureFlow,
        box: [180, 160],
        description:
            "A football pitch connected to a standings table, both feeding a knockout bracket below whose rounds progress to a final.",
    },
    revyze: {
        Drawing: Revyze,
        box: [200, 180],
        description:
            "A stack of past examination papers feeding a checklist of categorised questions, which feeds a bar chart of patterns; both lead down to an open book.",
    },
    lishwise: {
        Drawing: Lishwise,
        box: [200, 180],
        description:
            "A phone with a paper plane feeding an AI processor, which writes to a database and branches down to a folder of receipts and a bar chart summary.",
    },
} satisfies Record<string, { Drawing: () => JSX.Element; box: [number, number]; description: string }>;

export type IllustrationSlug = keyof typeof illustrations;

export function isIllustrationSlug(slug: string): slug is IllustrationSlug {
    return Object.hasOwn(illustrations, slug);
}

/**
 * Decorative by default: on a card the project name is right beside it, so
 * announcing the drawing too is noise. Pass `decorative={false}` where the
 * drawing stands on its own.
 *
 * `compact` thickens the stroke for small renders (the homepage cards), so the
 * line reads at roughly the same weight as it does at full size.
 */
export function ProjectIllustration({
    name,
    decorative = true,
    compact = false,
    className,
}: {
    name: IllustrationSlug;
    decorative?: boolean;
    compact?: boolean;
    className?: string;
}) {
    const { Drawing, description, box } = illustrations[name];
    // Fit the drawing's own grid into a 180-unit square, centred in the frame.
    const scale = 180 / Math.max(...box);
    const dx = (200 - box[0] * scale) / 2;
    const dy = (200 - box[1] * scale) / 2;

    return (
        <svg
            viewBox="0 0 200 200"
            className={cn(
                "project-art block aspect-square text-foreground",
                compact && "project-art--compact",
                className,
            )}
            {...(decorative
                ? { "aria-hidden": true, focusable: false }
                : { role: "img", "aria-label": description })}
        >
            {/* Opaque base: --accent-wash is translucent in dark mode, and the
                page header has the letter-glitch backdrop behind it. */}
            <rect x="0.5" y="0.5" width="199" height="199" rx="14" className="fill-paper" />
            <rect
                x="0.5"
                y="0.5"
                width="199"
                height="199"
                rx="14"
                className="fill-accent-wash stroke-hairline"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
            />
            <g
                transform={`translate(${dx} ${dy}) scale(${scale})`}
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="project-art__lines"
            >
                <Drawing />
            </g>
        </svg>
    );
}
