import { cn } from "@/lib/utils";

/**
 * The comment gutter — the publication's signature device.
 *
 * A hairline rule down the left of a block, with a mono label hanging in it.
 * It reads as an editor's gutter, and the label is set as a code comment,
 * because this whole publication is about the part of a file that isn't syntax.
 */
export function GutterSection({
    label,
    children,
    className,
    contentClassName,
}: {
    label?: string;
    children: React.ReactNode;
    className?: string;
    contentClassName?: string;
}) {
    return (
        <section className={cn("relative", className)}>
            <div className="grid grid-cols-1 gap-y-5 md:grid-cols-[9.5rem_minmax(0,1fr)] md:gap-y-0">
                <div className="md:sticky md:top-24 md:self-start md:pt-1">
                    {label ? <GutterLabel>{label}</GutterLabel> : null}
                </div>
                <div
                    className={cn(
                        "border-hairline md:border-l md:pl-8 lg:pl-10",
                        contentClassName,
                    )}
                >
                    {children}
                </div>
            </div>
        </section>
    );
}

/** `// label` — mono, uppercase, the `//` in accent. */
export function GutterLabel({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <p
            className={cn(
                "font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground",
                className,
            )}
        >
            <span aria-hidden="true" className="text-mark">
                {"// "}
            </span>
            {children}
        </p>
    );
}

/** A hairline rule with a mono label sitting on it. */
export function RuledHeading({
    label,
    action,
    className,
}: {
    label: string;
    action?: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                "flex items-baseline justify-between gap-4 border-b border-hairline pb-3",
                className,
            )}
        >
            <GutterLabel>{label}</GutterLabel>
            {action}
        </div>
    );
}
