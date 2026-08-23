import type { Metadata } from "next";
import Link from "next/link";

import { site } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { GutterLabel } from "@/components/gutter";

export const metadata: Metadata = {
    title: "About",
    description:
        "Ali Lishan is a software architect and engineer. Beyond Stacks & Syntax is where he shares lessons, ideas and perspectives from designing and building real-world software systems.",
    alternates: { canonical: "/about" },
};

const questions = [
    "How should a system be structured?",
    "Where should responsibilities sit?",
    "How much complexity is justified?",
    "What happens when something fails?",
    "How will today's decision affect the system two years from now?",
];

export default function AboutPage() {
    return (
        <>
            <PageHeader
                label="About"
                title="Beyond the code"
                lede="Software engineering is about more than writing code. Languages, frameworks, infrastructure and development tools are important, but they're only parts of a much larger system."
            />

            <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
                <div className="grid gap-x-12 gap-y-12 lg:grid-cols-[minmax(0,1fr)_16rem]">
                    <div className="min-w-0">
                        <div className="prose-bss">
                            <p>The interesting problems often live between them.</p>

                            <p>
                                And sometimes the most important question is simply:{" "}
                                <strong>do we actually need this at all?</strong>
                            </p>

                            <p>
                                Beyond Stacks &amp; Syntax is where I explore those questions.
                            </p>

                            <p>
                                I&apos;m <strong>Ali Lishan</strong>, a software architect and
                                engineer. I&apos;ve spent much of my career designing, building,
                                operating, troubleshooting and evolving software systems.
                            </p>

                            <p>
                                Along the way, I&apos;ve learned that some of the most useful
                                engineering lessons don&apos;t come from documentation or
                                tutorials. They come from systems that didn&apos;t scale the way
                                you expected. Deployments that went wrong. Architectures that
                                became too complicated. Simple solutions that worked surprisingly
                                well. Technical decisions that looked good initially but became
                                expensive later.
                            </p>

                            <p>
                                And occasionally, systems that worked exactly as intended.
                            </p>

                            <h2>What you&apos;ll find here</h2>

                            <p>
                                Some posts explore architecture or system design in depth. Others
                                focus on development practices, infrastructure, databases, APIs,
                                security, AI, engineering teams, or simply an interesting problem
                                I ran into while building something.
                            </p>

                            <p>
                                The purpose isn&apos;t to present one way of doing things as the
                                only answer. It&apos;s to share what I&apos;ve learned, explore
                                ideas, discuss trade-offs, document mistakes and discoveries, and
                                hopefully help others think differently about the software they
                                build.
                            </p>

                            <p>
                                This publication is where I share those lessons. Not as rules. Not
                                as universal answers. But as perspectives that might help someone
                                else make a better engineering decision.
                            </p>

                            <p>
                                I&apos;m still learning too. And that&apos;s part of the point.
                            </p>
                        </div>

                        <div className="mt-12 flex flex-wrap gap-3">
                            <Button asChild variant="default" size="lg">
                                <Link href="/articles">Read the articles</Link>
                            </Button>
                            <Button asChild variant="outline" size="lg">
                                <a href={site.author.resume}>Résumé ↗</a>
                            </Button>
                            <Button asChild variant="ghost" size="lg">
                                <a href={`mailto:${site.author.email}`}>Email me</a>
                            </Button>
                        </div>
                    </div>

                    <aside className="lg:sticky lg:top-24 lg:self-start">
                        <div className="rounded-lg border border-hairline bg-paper p-6">
                            <GutterLabel>The questions</GutterLabel>
                            <ul className="mt-5 space-y-4">
                                {questions.map((question) => (
                                    <li
                                        key={question}
                                        className="border-l border-accent-edge pl-4 font-reading text-[0.9375rem] leading-relaxed text-muted-foreground"
                                    >
                                        {question}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-5 rounded-lg border border-hairline p-6 hatch">
                            <GutterLabel>Editorial north star</GutterLabel>
                            <p className="mt-4 font-reading text-[0.9375rem] leading-relaxed text-foreground">
                                Does this help someone understand software engineering beyond
                                simply knowing how to write the code?
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
}
