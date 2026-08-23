import Link from "next/link";
import Image from "next/image";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";

import { cn } from "@/lib/utils";

const prettyCodeOptions: PrettyCodeOptions = {
    // The code surface is dark in both site themes — it's the machine's voice
    // against the paper — so a single dark Shiki theme is correct. It also emits
    // real `color` values rather than the light/dark CSS variable pair, which
    // means the tokens need no theme-swapping CSS to stay legible.
    theme: "github-dark-default",
    keepBackground: false,
    defaultLang: "text",
};

/** A callout for the asides these articles keep wanting to make. */
function Note({
    title,
    children,
}: {
    title?: string;
    children: React.ReactNode;
}) {
    return (
        <aside className="my-8 rounded-lg border border-accent-edge bg-accent-wash/50 p-5">
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink">
                {title ?? "Note"}
            </p>
            <div className="mt-2 font-reading text-[0.9375rem] leading-relaxed text-foreground [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
                {children}
            </div>
        </aside>
    );
}

/**
 * A pull quote — the sentence the article is really about.
 *
 * This must not be a <p>. Written across several lines in MDX, the children
 * arrive already wrapped in their own <p>, and a nested <p> is invalid HTML —
 * the browser silently reparents it, the server and client trees stop matching,
 * and React throws away the whole hydrated tree. The `//` mark is applied in
 * CSS (.pull-quote) so it works whether or not the children got wrapped.
 */
function Pull({ children }: { children: React.ReactNode }) {
    return (
        <aside className="pull-quote my-10 border-y border-hairline py-6 font-mono text-[1.0625rem] font-bold leading-snug tracking-tight text-ink">
            {children}
        </aside>
    );
}

/** Trade-off table: the publication argues in trade-offs, so it gets a component. */
function Tradeoffs({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="my-8 grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-2">
            {children}
        </div>
    );
}

function Side({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-paper p-5">
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
                {label}
            </p>
            <div className="mt-2 font-reading text-[0.9375rem] leading-relaxed text-foreground [&_li]:my-1 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
                {children}
            </div>
        </div>
    );
}

/** An image with a caption — for diagrams, screenshots and archive material. */
function Figure({
    src,
    alt,
    caption,
    width = 1600,
    height = 900,
}: {
    src: string;
    alt: string;
    caption?: string;
    width?: number;
    height?: number;
}) {
    return (
        <figure className="my-9">
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className="h-auto w-full rounded-lg border border-hairline bg-paper"
            />
            {caption ? (
                <figcaption className="mt-3 border-l border-hairline pl-3 font-mono text-[0.6875rem] leading-relaxed text-faint">
                    {caption}
                </figcaption>
            ) : null}
        </figure>
    );
}

const components = {
    a: ({ href = "", ...props }: React.ComponentProps<"a">) => {
        const isInternal = href.startsWith("/") || href.startsWith("#");
        if (isInternal) {
            return <Link href={href} {...props} />;
        }
        return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />;
    },
    img: ({ src, alt, ...props }: React.ComponentProps<"img">) => (
        <Image
            src={typeof src === "string" ? src : ""}
            alt={alt ?? ""}
            width={1400}
            height={800}
            className="h-auto w-full rounded-lg border border-hairline"
            {...(props as Record<string, unknown>)}
        />
    ),
    Note,
    Pull,
    Tradeoffs,
    Side,
    Figure,
};

export async function MDXBody({
    source,
    className,
}: {
    source: string;
    className?: string;
}) {
    const { content } = await compileMDX({
        source,
        components,
        options: {
            // Content is authored in-repo by the site owner, so MDX expressions
            // and components are trusted here.
            blockJS: false,
            blockDangerousJS: false,
            mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                    rehypeSlug,
                    [rehypePrettyCode, prettyCodeOptions],
                    [
                        rehypeAutolinkHeadings,
                        {
                            behavior: "wrap",
                            properties: {
                                className: ["heading-anchor"],
                            },
                        },
                    ],
                ],
            },
        },
    });

    return <div className={cn("prose-bss", className)}>{content}</div>;
}
