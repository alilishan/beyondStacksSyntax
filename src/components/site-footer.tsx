import Link from "next/link";

import { site } from "@/lib/site";
import { categories, series } from "@/lib/taxonomy";
import { GutterLabel } from "@/components/gutter";

export function SiteFooter() {
    return (
        <footer className="relative z-10 mt-24 border-t border-hairline bg-background hatch">
            <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="lg:col-span-1">
                        <p className="font-mono text-[0.8125rem] font-bold tracking-tight text-ink">
                            Beyond Stacks &amp; Syntax
                        </p>
                        <p className="mt-2 font-reading text-sm leading-relaxed text-muted-foreground">
                            {site.tagline}
                        </p>
                        <a
                            href="/feed.xml"
                            className="mt-4 inline-block font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-accent-ink"
                        >
                            RSS feed
                        </a>
                    </div>

                    <nav aria-labelledby="footer-topics">
                        <GutterLabel className="mb-4" >
                            <span id="footer-topics">Topics</span>
                        </GutterLabel>
                        <ul className="space-y-2">
                            {categories.map((category) => (
                                <li key={category.slug}>
                                    <Link
                                        href={`/topics/${category.slug}`}
                                        className="font-mono text-xs text-muted-foreground transition-colors hover:text-accent-ink"
                                    >
                                        {category.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <nav aria-labelledby="footer-series">
                        <GutterLabel className="mb-4">
                            <span id="footer-series">Series</span>
                        </GutterLabel>
                        <ul className="space-y-2">
                            {series.map((entry) => (
                                <li key={entry.slug}>
                                    <Link
                                        href={`/series/${entry.slug}`}
                                        className="font-mono text-xs text-muted-foreground transition-colors hover:text-accent-ink"
                                    >
                                        {entry.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <nav aria-labelledby="footer-elsewhere">
                        <GutterLabel className="mb-4">
                            <span id="footer-elsewhere">Elsewhere</span>
                        </GutterLabel>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/about"
                                    className="font-mono text-xs text-muted-foreground transition-colors hover:text-accent-ink"
                                >
                                    About
                                </Link>
                            </li>
                            <li>
                                <a
                                    href={site.author.resume}
                                    className="font-mono text-xs text-muted-foreground transition-colors hover:text-accent-ink"
                                >
                                    Résumé ↗
                                </a>
                            </li>
                            <li>
                                <a
                                    href={`mailto:${site.author.email}`}
                                    className="font-mono text-xs text-muted-foreground transition-colors hover:text-accent-ink"
                                >
                                    Email
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>

                <p className="mt-12 border-t border-hairline pt-6 font-mono text-[0.6875rem] text-faint">
                    Written and built by {site.author.name} · © {new Date().getFullYear()}
                </p>
            </div>
        </footer>
    );
}
