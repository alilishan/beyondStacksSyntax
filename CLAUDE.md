# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

Keep the `@AGENTS.md` line above. `next dev` regenerates `AGENTS.md` on every run and, because `AGENTS.md` already hosts its marker block, it skips `CLAUDE.md` entirely — so this file is safe to edit (see `node_modules/next/dist/server/lib/generate-agent-files.js`).

## What this is

**Beyond Stacks & Syntax** — Ali Lishan's software engineering publication. Next.js 16 App Router, Tailwind v4, MDX content, fully static, deployed on Vercel at **alilishan.com**. The separate résumé site lives at `resume.alilishan.com` (repo `alilishan-www-n15`); the two cross-link but share no code.

## Commands

```bash
npm run dev      # next dev --turbopack
npm run build    # next build — the real gate; run before pushing
npm start        # serve the production build
npm run lint     # eslint (flat config)
npx tsc --noEmit # typecheck
```

There is no test suite. `npm run build` is the check that matters: content errors are thrown at build time, not runtime.

Pushing to `main` auto-deploys to production via the GitHub integration — there is no manual deploy step.

## Architecture

### Content is the database

Articles are `.mdx` files in `content/articles/`. `src/lib/articles.ts` is the only reader: it parses frontmatter with gray-matter, derives reading time from the body, sorts, and exposes every query the pages use (featured, latest, by category, by series, neighbours, related). Pages never touch the filesystem directly.

Two consequences worth knowing:

- **Frontmatter is validated and throws.** Missing `title`/`description`/`category`/`date`, or a `category`/`series` not in `src/lib/taxonomy.ts`, fails the build with a message naming the file. This is deliberate — the alternative is a silent orphan page.
- **`taxonomy.ts` is a closed set.** Adding a category or series there automatically produces its topic/series page, footer link, sitemap entry and filter chip. Don't invent taxonomy values in frontmatter.

`draft: true` articles render in `next dev` and are excluded from production builds, the sitemap and the feed. `content/articles/_component-reference.mdx` is a permanent draft documenting every MDX component.

### MDX rendering

`src/components/mdx.tsx` owns the whole pipeline — `compileMDX` plus remark-gfm, rehype-slug, rehype-pretty-code and rehype-autolink-headings, and the custom components: `Note`, `Pull`, `Tradeoffs`/`Side`, `Figure`.

**Custom MDX components must not render a `<p>` as their root.** Written across multiple lines, MDX wraps children in their own `<p>`; a nested `<p>` is invalid HTML, so the browser reparents it, the server and client trees diverge, and React discards the entire hydrated tree — silently breaking every client component on the page. `Pull` is an `<aside>` for exactly this reason, with its `//` mark applied via CSS (`.pull-quote`) so it works whether or not MDX wrapped the children.

`src/lib/headings.ts` extracts h2/h3 for the reading gutter using github-slugger, so its ids match what rehype-slug puts on the rendered headings. It strips fenced code first — otherwise a `## comment` inside a snippet becomes a phantom section.

Code blocks use a single dark Shiki theme in both site themes. That's intentional: a single theme emits real `color` values rather than the light/dark CSS variable pair, so no theme-swapping CSS is needed.

### Design system

All tokens live in `src/app/globals.css`, defined for light and dark. The palette is **monochrome by design** — there is no hue accent. Two roles carry emphasis:

- `--mark` — the résumé's `#9CA0A8` link grey. **Decoration only** (the `//` marks, list dashes, hover underlines). At ~2.5:1 against paper it is unreadable as text, so links must never use it.
- `--accent-ink` — near-ink. Anything interactive or active: prose links, current section, reading progress.

Emphasis comes from lightness, not colour. When adding UI, reuse these tokens and the `GutterLabel` / `RuledHeading` / `GutterSection` components rather than inventing new visual patterns.

Three non-obvious constraints:

1. **Font variables go on `<html>`, not `<body>`.** Tokens like `--font-reading` are declared on `:root` and reference the `next/font` variables. A custom property referencing an undefined variable resolves to invalid *where it is declared*, so putting the font classes on `<body>` silently kills every `font-family: var(--font-reading)` rule while Tailwind's `font-*` utilities keep working (`@theme inline` inlines the raw `var()`).
2. **`adjustFontFallback: false` on JetBrains Mono is load-bearing.** Left on, `next/font` injects a metric-matched *proportional* fallback ahead of the monospace ones; since the webfont subset lacks box-drawing glyphs (U+2500–U+257F), ASCII architecture diagrams get drawn by an Arial derivative at the wrong advance width and fall apart. Measured error was 59% before, 0.35% after.
3. **`.prose-bss` rules are unlayered, so they beat Tailwind utilities** on direct children. `max-w-none` on a child of `.prose-bss` is inert — set widths in `globals.css`, not with a class.

`src/components/site-backdrop.tsx` is the letter-glitch canvas carried over from the résumé. It is `position: fixed`, so it never leaves the viewport — an IntersectionObserver on it reports "visible" forever. It fades on scroll position instead, and stops drawing once faded, when the tab is hidden, and under `prefers-reduced-motion`.

### Cover images

Sources are PNG masters in `content/images/`; the site serves WebP built from them in `public/images/covers/`. Filenames carry an **8-character SHA-256 hash of the source** (`slug.a1b2c3d4.webp`).

The hash is not cosmetic. `next/image` keys its optimised output on the request URL and serves it with long-lived immutable cache headers, so replacing an image in place leaves returning visitors on the old render indefinitely — and a hard reload won't fix it. Changing the image must change the URL.

When replacing a cover: trim to the content bounding box, add even padding, encode with `cwebp -q 92` (diagram labels go mushy lower), write `cover`/`coverAlt` frontmatter, and delete the previous WebP so no orphan remains.

The specifics, so every cover matches:

- **Hash the untouched source PNG** (`shasum -a 256 <png> | cut -c1-8`), not the padded intermediate. The source filename doesn't enter the hash, so renaming a source is free; name new ones after the article slug (older sources predate that convention).
- **Trim and pad with Pillow** — ImageMagick isn't installed; `cwebp`/`dwebp` and Python Pillow are. Treat pixels with luminance < 235 as content, crop to their bounding box, and paste onto pure white with **44px** on every side (the existing covers measure 42–44px). Do intermediates in the scratchpad, not the repo.
- **Covers share one visual language**: monochrome line-art diagrams on white — thin outline icons, letter-spaced uppercase headings with grey subtitles, dashed connectors, scattered `+`/square marks — usually three panels over a numbered flow, roughly 1.7:1. When proposing a cover for a new article, write the brief in that style.
- **`coverAlt` is written from the finished image**, not the brief: a full description of every panel and label, because the diagrams carry real content.

## Content conventions

Derived from `README.md` and the publication's editorial brief:

- The `h1` comes from frontmatter — never use `#` in an article body. `##`/`###` become the reading gutter.
- Don't put `---` between sections; every `h2` already draws its own top rule.
- Reading time is calculated. Never set it by hand.
- Em dashes are spaced (`word — word`), in bodies and frontmatter alike.
- Link between articles with root-relative paths: `[Title](/articles/<slug>)`.
- The home page shows three featured articles (`getFeaturedArticles(3)`, newest first). Setting `featured: true` on a fourth pushes the oldest featured one off.
- Custom components (`Pull`, `Note`, `Tradeoffs`) are seasoning — a few pull quotes on the article's thesis lines, not one per section.

When the author supplies a finished draft (often pasted as plain Markdown), change only what the site requires and keep their wording: drop the `#` title (→ `title`), turn the italic standfirst into `description`, remove `---` dividers and any sign-off about the publication itself (the site says that already). Propose anything beyond that — pull quotes, cross-links, title changes — before making it. Don't commit or push until asked: a push to `main` is a production publish.
- Prefer trade-offs to absolutes, experience to authority. The house style argues "this worked under these constraints, and here's why" rather than declaring a correct answer.

## Other agent configs

OpenAI Codex (`~/.codex/config.toml`) and Gemini CLI (`~/.gemini/settings.json`) configs exist on this machine. If you want their MCP servers, slash commands, subagents or skills available here, reply `/import` to see what's importable, then `/import --yes=<digest>` to apply it. (If `/import` isn't available on this surface, run `claude import` from a terminal.)
