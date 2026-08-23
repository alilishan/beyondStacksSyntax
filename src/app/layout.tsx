import type { Metadata } from "next";
import { JetBrains_Mono, IBM_Plex_Sans } from "next/font/google";

import "./globals.css";
import { site } from "@/lib/site";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteBackdrop } from "@/components/site-backdrop";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

/**
 * The brand face, inherited from resume.alilishan.com — syntax.
 *
 * `adjustFontFallback` is off deliberately. Left on, next/font injects a
 * metric-matched *proportional* fallback ahead of the real monospace ones, and
 * every glyph the webfont subset lacks — the whole box-drawing block used by
 * ASCII architecture diagrams — gets drawn by an Arial derivative at the wrong
 * advance width, so the diagrams don't line up. The explicit fallbacks below
 * are all monospace, so anything outside the subset still lands on a fixed grid.
 */
const mono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-jetbrains-mono",
    display: "swap",
    adjustFontFallback: false,
    fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
});

/** The reading face. Built for technical prose, and clearly distinct in
 *  texture from JetBrains Mono so the two never blur together. */
const reading = IBM_Plex_Sans({
    subsets: ["latin"],
    variable: "--font-plex-sans",
    display: "swap",
    weight: ["400", "500", "600"],
    style: ["normal", "italic"],
});

export const metadata: Metadata = {
    metadataBase: new URL(site.url),
    title: {
        default: `${site.name} — ${site.tagline}`,
        template: `%s · ${site.name}`,
    },
    description: site.seoDescription,
    authors: [{ name: site.author.name, url: site.author.resume }],
    creator: site.author.name,
    keywords: [
        "software engineering",
        "software architecture",
        "system design",
        "infrastructure",
        "DevOps",
        "AI",
        "engineering leadership",
    ],
    openGraph: {
        type: "website",
        siteName: site.name,
        title: `${site.name} — ${site.tagline}`,
        description: site.description,
        url: site.url,
        locale: site.locale,
    },
    twitter: {
        card: "summary_large_image",
        title: `${site.name} — ${site.tagline}`,
        description: site.description,
    },
    alternates: {
        canonical: "/",
        types: { "application/rss+xml": `${site.url}/feed.xml` },
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        // The font variables go on <html>, not <body>. Tokens in globals.css
        // (--font-reading, --font-mono) are declared on :root and reference
        // these; a custom property that references an undefined variable
        // resolves to invalid where it is declared, so putting them on <body>
        // silently kills every `font-family: var(--font-reading)` rule.
        <html
            lang="en"
            className={`${mono.variable} ${reading.variable}`}
            suppressHydrationWarning
        >
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <a
                        href="#main"
                        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:border focus:border-hairline focus:bg-paper focus:px-4 focus:py-2 focus:font-mono focus:text-xs"
                    >
                        Skip to content
                    </a>
                    <SiteBackdrop />
                    <SiteHeader />
                    <main id="main" className="relative z-10">
                        {children}
                    </main>
                    <SiteFooter />
                </ThemeProvider>
            </body>
        </html>
    );
}
