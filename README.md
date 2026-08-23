# Beyond Stacks & Syntax

> The thinking behind better software.

A personal software engineering publication by Ali Lishan. Next.js 16 (App Router), Tailwind v4, shadcn/ui conventions, MDX content, deployed on Vercel at **alilishan.com**.

The résumé site lives separately at **resume.alilishan.com** and the two cross-link.

---

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npm run lint
```

Node 20.9+ required.

---

## Writing an article

Create a file in `content/articles/`. The filename is the URL slug, so
`why-i-dont-start-with-microservices.mdx` becomes
`/articles/why-i-dont-start-with-microservices`.

```mdx
---
title: "Why I Don't Start With Microservices"
description: "One sentence that makes someone want to read it."
category: architecture
date: 2026-09-01
series: keep-it-simple      # optional
featured: true              # optional — promotes to the homepage grid
draft: false                # optional — hides from production
updated: 2026-10-14         # optional — shows an "Updated" stamp
tags:                       # optional
  - microservices
  - boundaries
---

Your first paragraph. Use `##` for sections — they become the reading gutter
on the right of the article.
```

`title`, `description`, `category` and `date` are required. Everything else is optional.

**Reading time is calculated from the body** — don't set it by hand.

### Categories and series

Both are validated against `src/lib/taxonomy.ts` at build time. A typo fails the build rather than silently creating an orphan page.

| Category slug    | Name                |
| ---------------- | ------------------- |
| `engineering`    | Engineering         |
| `architecture`   | Architecture        |
| `infrastructure` | Infrastructure      |
| `ai`             | AI                  |
| `thinking`       | Engineering Thinking|
| `teams`          | Teams               |

| Series slug              | Name                              |
| ------------------------ | --------------------------------- |
| `architecture-decisions` | Architecture Decisions            |
| `from-production`        | From Production                   |
| `from-the-archive`       | From the Archive                  |
| `changed-my-mind`        | Things I've Changed My Mind About |
| `keep-it-simple`         | Keep It Simple                    |
| `under-the-hood`         | Under the Hood                    |
| `engineering-notes`      | Engineering Notes                 |

To add a new one, add it to `src/lib/taxonomy.ts` — the topic page, footer link, sitemap entry and filter chip all follow automatically.

### Components available in MDX

`<Note title="…">`, `<Pull>`, `<Tradeoffs>` / `<Side label="…">`, and `<Figure src alt caption>`, plus standard markdown, GFM tables, and fenced code blocks with `title=`, `showLineNumbers` and `{3-5}` line highlighting.

`content/articles/_component-reference.mdx` demonstrates all of them. It's marked `draft: true`, so it renders at `/articles/_component-reference` in `npm run dev` and is excluded from production, the sitemap and the feed. Delete it when it stops being useful.

### Images

Put files in `public/` and reference them from the root: `![Alt text](/images/thing.png)`. They render through `next/image`.

---

## Design system

The visual language is inherited from the résumé site and extended for long-form reading.

- **JetBrains Mono** — wordmark, nav, headings, metadata, code.
- **IBM Plex Sans** — article prose at 17px over a 68-character measure.
- **Monochrome palette** — no hue accent. `--mark` is the résumé's `#9CA0A8` link grey and is decoration only; `--accent-ink` is near-ink and carries anything interactive or active. Emphasis comes from lightness, not colour.
- **The letter-glitch backdrop** — carried over from the résumé, fixed to the top of the viewport and fading into the page. It pauses when scrolled past, when the tab is hidden, and under `prefers-reduced-motion`.
- **The comment gutter** — the signature device. A hairline rule carrying `//` marks and metadata. On article pages it doubles as the reading-progress rule and names the section you're in.
- The diagonal hatch (`.hatch`) and hairline borders carry over from the résumé.

All tokens are in `src/app/globals.css`, defined for light and dark. Prose styling lives under `.prose-bss`.

Code blocks are dark in both themes by design, so Shiki uses a single dark theme and needs no theme-swapping CSS.

---

## Structure

```
content/articles/*.mdx        the articles
src/lib/articles.ts           gray-matter parsing, sorting, filtering, related posts
src/lib/taxonomy.ts           categories and series — the closed set
src/lib/headings.ts           h2/h3 extraction for the reading gutter
src/lib/og.tsx                shared social-card layout
src/components/site-backdrop.tsx  the letter-glitch canvas
src/lib/site.ts               site name, tagline, author, URLs
src/components/               header, footer, cards, gutter, MDX components
src/app/                      routes
```

Routes: `/`, `/articles`, `/articles/[slug]`, `/topics`, `/topics/[category]`, `/series/[series]`, `/about`, `/feed.xml`, `/sitemap.xml`, `/robots.txt`, plus generated `opengraph-image` for the site and every article.

Everything is statically generated at build time.

---

## Deploying

Push to a Git repo, import it in Vercel, and accept the detected Next.js defaults — no `vercel.json` needed. Then point `alilishan.com` at the project in **Settings → Domains**.

No environment variables are required. If you add analytics later, `NEXT_PUBLIC_*` vars are the place for it.

`site.url` in `src/lib/site.ts` drives canonical URLs, the sitemap, the feed and OG image URLs — it must match the production domain.
