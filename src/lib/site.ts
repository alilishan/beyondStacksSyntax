export const site = {
    name: "Beyond Stacks & Syntax",
    shortName: "BS&S",
    tagline: "The thinking behind better software.",
    description:
        "Practical perspectives on software engineering, architecture, systems, and the thinking behind better software.",
    seoDescription:
        "Beyond Stacks & Syntax explores software engineering, architecture, system design, infrastructure, AI, and practical lessons from building real-world software systems.",
    url: "https://alilishan.com",
    author: {
        name: "Ali Lishan",
        role: "Software Architect & Engineer",
        email: "alilishan@gmail.com",
        resume: "https://resume.alilishan.com",
        shortBio:
            "I'm Ali Lishan, a software architect and engineer who enjoys building systems and understanding why they work — and sometimes why they don't.",
        homeBio:
            "I'm Ali Lishan, a software architect and engineer who enjoys understanding how software systems work — and why sometimes they don't. Beyond Stacks & Syntax is where I share ideas, lessons, mistakes, and perspectives from designing and building real-world software.",
    },
    locale: "en_GB",
} as const;

export const nav = [
    { href: "/articles", label: "Articles" },
    { href: "/projects", label: "Projects" },
    { href: "/topics", label: "Topics" },
    { href: "/about", label: "About" },
] as const;
