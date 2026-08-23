import GithubSlugger from "github-slugger";

export type Heading = {
    id: string;
    text: string;
    level: 2 | 3;
};

/**
 * Pull h2/h3 headings out of raw MDX for the article gutter.
 *
 * Ids are generated with github-slugger so they match what rehype-slug puts on
 * the rendered headings. Fenced and indented code is stripped first, otherwise
 * a comment like `## totals` inside a snippet becomes a phantom section.
 */
export function extractHeadings(source: string): Heading[] {
    const withoutCode = source
        .replace(/^~~~[\s\S]*?^~~~\s*$/gm, "")
        .replace(/^```[\s\S]*?^```\s*$/gm, "");

    const slugger = new GithubSlugger();
    const headings: Heading[] = [];

    for (const line of withoutCode.split("\n")) {
        const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
        if (!match) continue;

        const text = match[2]
            // strip the markdown that shouldn't appear in a nav label
            .replace(/`([^`]+)`/g, "$1")
            .replace(/\*\*([^*]+)\*\*/g, "$1")
            .replace(/\*([^*]+)\*/g, "$1")
            .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
            .trim();

        headings.push({
            id: slugger.slug(text),
            text,
            level: match[1].length === 2 ? 2 : 3,
        });
    }

    return headings;
}
