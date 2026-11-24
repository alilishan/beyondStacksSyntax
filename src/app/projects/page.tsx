import type { Metadata } from "next";

import { site } from "@/lib/site";
import { getAllProjects } from "@/lib/projects";
import { PageHeader } from "@/components/page-header";
import { ProjectCard } from "@/components/project-card";

const description =
    "Explore personal projects, independent products and engineering experiments across software architecture, artificial intelligence, infrastructure and practical technology solutions.";

export const metadata: Metadata = {
    title: "Projects",
    description,
    alternates: { canonical: "/projects" },
    openGraph: {
        type: "website",
        title: `Projects · ${site.name}`,
        description,
        url: `${site.url}/projects`,
    },
    twitter: {
        card: "summary_large_image",
        title: `Projects · ${site.name}`,
        description,
    },
};

export default function ProjectsPage() {
    const projects = getAllProjects();

    return (
        <>
            <PageHeader
                label="Projects"
                title="Beyond the theory."
                lede="A collection of personal projects, independent products and engineering experiments inspired by real-world challenges, curiosity and continuous learning."
            >
                <p className="mt-4 max-w-[56ch] font-reading text-base leading-relaxed text-muted-foreground">
                    From solving everyday problems to exploring new technologies and architectural
                    approaches, these projects represent an opportunity to put ideas into practice,
                    challenge assumptions and learn through building.
                </p>
            </PageHeader>

            <div className="mx-auto max-w-6xl px-5 pt-4 pb-14 sm:px-8">
                {projects.map((project) => (
                    <ProjectCard key={project.slug} project={project} />
                ))}
            </div>
        </>
    );
}
