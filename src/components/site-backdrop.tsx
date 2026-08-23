"use client";

import * as React from "react";
import { useTheme } from "next-themes";

/**
 * The letter-glitch backdrop, carried over from resume.alilishan.com.
 *
 * Fixed to the top of the viewport and fading into the page background, so it
 * stays put while the page scrolls past it. Differences from the résumé's copy,
 * all of them because this site is for reading rather than scanning:
 *
 *   - the palette follows the theme instead of being hard-coded to white;
 *   - it fades out as you scroll past the header, so it never sits behind
 *     body copy. The résumé doesn't need this because its content rides on an
 *     opaque white card; article text here has no such backing;
 *   - the loop stops once faded, and while the tab is hidden;
 *   - `prefers-reduced-motion` gets a single static frame and no loop.
 *
 * Adapted from reactbits.dev.
 */

const CHARS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$&*()-_+=/[]{};:<>,".split("");

const FONT_SIZE = 16;
const CHAR_WIDTH = 10;
const CHAR_HEIGHT = 20;
const GLITCH_INTERVAL_MS = 50;
const CHURN = 0.05; // share of cells rewritten per tick
const FADE_STEP = 0.05;
/** Scroll distance over which the whole band fades away. */
const FADE_OUT_PX = 420;

/**
 * The résumé's exact greys. They read as intended because the page behind them
 * is white — against a tinted ground these would collapse into the background.
 * The dark values are picked to sit the same distance above the dark surface.
 */
const PALETTES = {
    light: ["#F0F0F0", "#E0E0E0", "#E5E4E2"],
    dark: ["#242A32", "#2A313A", "#20262D"],
} as const;

type Cell = {
    char: string;
    rgb: [number, number, number];
    target: [number, number, number];
    progress: number;
};

function hexToRgb(hex: string): [number, number, number] {
    const value = hex.replace("#", "");
    return [
        parseInt(value.slice(0, 2), 16),
        parseInt(value.slice(2, 4), 16),
        parseInt(value.slice(4, 6), 16),
    ];
}

function randomFrom<T>(list: readonly T[]): T {
    return list[Math.floor(Math.random() * list.length)];
}

export function SiteBackdrop() {
    const { resolvedTheme } = useTheme();
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const wrapperRef = React.useRef<HTMLDivElement>(null);

    // Re-keying on the theme tears down and rebuilds the canvas with the right
    // palette, which is simpler than mutating every cell's colour in place.
    const palette = resolvedTheme === "dark" ? PALETTES.dark : PALETTES.light;

    React.useEffect(() => {
        const canvas = canvasRef.current;
        const wrapper = wrapperRef.current;
        if (!canvas || !wrapper) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rgbPalette = palette.map(hexToRgb);
        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        let cells: Cell[] = [];
        let columns = 0;
        let frame = 0;
        let lastGlitch = 0;
        let visible = true;

        const newCell = (): Cell => {
            const rgb = randomFrom(rgbPalette);
            return { char: randomFrom(CHARS), rgb, target: rgb, progress: 1 };
        };

        const draw = () => {
            const { width, height } = canvas.getBoundingClientRect();
            ctx.clearRect(0, 0, width, height);
            ctx.font = `${FONT_SIZE}px ui-monospace, monospace`;
            ctx.textBaseline = "top";

            for (let i = 0; i < cells.length; i++) {
                const cell = cells[i];
                ctx.fillStyle = `rgb(${cell.rgb[0]},${cell.rgb[1]},${cell.rgb[2]})`;
                ctx.fillText(
                    cell.char,
                    (i % columns) * CHAR_WIDTH,
                    Math.floor(i / columns) * CHAR_HEIGHT,
                );
            }
        };

        const resize = () => {
            const rect = wrapper.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;

            canvas.width = Math.floor(rect.width * dpr);
            canvas.height = Math.floor(rect.height * dpr);
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            columns = Math.max(1, Math.ceil(rect.width / CHAR_WIDTH));
            const rows = Math.max(1, Math.ceil(rect.height / CHAR_HEIGHT));
            cells = Array.from({ length: columns * rows }, newCell);
            draw();
        };

        const churn = () => {
            const count = Math.max(1, Math.floor(cells.length * CHURN));
            for (let i = 0; i < count; i++) {
                const cell = cells[Math.floor(Math.random() * cells.length)];
                if (!cell) continue;
                cell.char = randomFrom(CHARS);
                cell.target = randomFrom(rgbPalette);
                cell.progress = 0;
            }
        };

        const fade = () => {
            let dirty = false;
            for (const cell of cells) {
                if (cell.progress >= 1) continue;
                cell.progress = Math.min(1, cell.progress + FADE_STEP);
                cell.rgb = [
                    Math.round(cell.rgb[0] + (cell.target[0] - cell.rgb[0]) * cell.progress),
                    Math.round(cell.rgb[1] + (cell.target[1] - cell.rgb[1]) * cell.progress),
                    Math.round(cell.rgb[2] + (cell.target[2] - cell.rgb[2]) * cell.progress),
                ];
                dirty = true;
            }
            return dirty;
        };

        const tick = (now: number) => {
            if (now - lastGlitch >= GLITCH_INTERVAL_MS) {
                churn();
                lastGlitch = now;
            }
            if (fade()) draw();
            frame = window.requestAnimationFrame(tick);
        };

        const start = () => {
            if (reduceMotion || frame) return;
            lastGlitch = performance.now();
            frame = window.requestAnimationFrame(tick);
        };

        const stop = () => {
            if (!frame) return;
            window.cancelAnimationFrame(frame);
            frame = 0;
        };

        const sync = () => {
            if (visible && !document.hidden) start();
            else stop();
        };

        // The band is position:fixed, so it never leaves the viewport and an
        // IntersectionObserver on it would report "visible" forever. Opacity
        // has to be driven from scroll position instead.
        let scrollFrame = 0;
        const applyScroll = () => {
            scrollFrame = 0;
            const opacity = Math.max(0, 1 - window.scrollY / FADE_OUT_PX);
            wrapper.style.opacity = String(opacity);
            const nowVisible = opacity > 0.01;
            if (nowVisible !== visible) {
                visible = nowVisible;
                sync();
            }
        };
        const onScroll = () => {
            if (scrollFrame) return;
            scrollFrame = window.requestAnimationFrame(applyScroll);
        };

        resize();
        applyScroll();
        sync();

        let resizeTimer: ReturnType<typeof setTimeout>;
        const onResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                stop();
                resize();
                sync();
            }, 120);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onResize);
        document.addEventListener("visibilitychange", sync);

        return () => {
            stop();
            if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
            clearTimeout(resizeTimer);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
            document.removeEventListener("visibilitychange", sync);
        };
    }, [palette]);

    return (
        <div
            ref={wrapperRef}
            aria-hidden="true"
            className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[60vh] overflow-hidden"
        >
            <canvas ref={canvasRef} className="block h-full w-full" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/60 to-background" />
        </div>
    );
}
