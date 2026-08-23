import Link from "next/link";

import { Button } from "@/components/ui/button";
import { GutterLabel } from "@/components/gutter";

export default function NotFound() {
    return (
        <div className="mx-auto flex min-h-[60vh] max-w-6xl flex-col justify-center px-5 py-24 sm:px-8">
            <GutterLabel>404</GutterLabel>
            <h1 className="mt-5 max-w-[18ch] text-[clamp(1.7rem,4.6vw,2.5rem)] font-bold leading-[1.12] tracking-[-0.035em] text-ink">
                That page isn&apos;t here.
            </h1>
            <p className="mt-5 max-w-[52ch] font-reading text-lg leading-relaxed text-muted-foreground">
                The link may be out of date, or the article may have been renamed. The
                archive is the reliable route in.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="default" size="lg">
                    <Link href="/articles">Browse articles</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                    <Link href="/">Home</Link>
                </Button>
            </div>
        </div>
    );
}
