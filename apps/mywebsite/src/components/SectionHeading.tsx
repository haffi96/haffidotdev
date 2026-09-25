import type { ReactNode } from "react";

export function SectionHeading({
  id,
  kicker,
  title,
  blurb,
  action,
  level = 2
}: Readonly<{ id: string; kicker: string; title: string; blurb?: string; action?: ReactNode; level?: 1 | 2 }>) {
  const Heading = level === 1 ? "h1" : "h2";
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <p className="font-mono text-xs font-semibold tracking-wider text-hm-red uppercase">{kicker}</p>
        <Heading id={id} className={`mt-1 leading-tight font-bold tracking-tight text-ink ${level === 1 ? "text-3xl sm:text-[2.6rem]" : "text-2xl sm:text-[1.7rem]"}`}>
          {title}
        </Heading>
        {blurb ? <p className="mt-2 max-w-2xl text-body">{blurb}</p> : null}
      </div>
      {action}
    </div>
  );
}
