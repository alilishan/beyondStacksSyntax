import { GutterLabel } from "@/components/gutter";

export function PageHeader({
    label,
    title,
    lede,
    children,
}: {
    label: string;
    title: string;
    lede?: string;
    children?: React.ReactNode;
}) {
    return (
        <header className="border-b border-hairline">
            <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
                <div className="grid gap-y-6 md:grid-cols-[9.5rem_minmax(0,1fr)] md:gap-y-0">
                    <div className="md:pt-2">
                        <GutterLabel>{label}</GutterLabel>
                    </div>
                    <div className="border-hairline md:border-l md:pl-8 lg:pl-10">
                        <h1 className="text-[clamp(1.7rem,4.6vw,2.5rem)] font-bold leading-[1.12] tracking-[-0.035em] text-ink">
                            {title}
                        </h1>
                        {lede ? (
                            <p className="mt-5 max-w-[56ch] font-reading text-lg leading-relaxed text-muted-foreground">
                                {lede}
                            </p>
                        ) : null}
                        {children}
                    </div>
                </div>
            </div>
        </header>
    );
}
