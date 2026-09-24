import type { ReactNode } from "react";
import { Reveal } from "./motion/Reveal";

type SectionHeadingProps = Readonly<{
  index: string;
  eyebrow: string;
  title: ReactNode;
  aside?: ReactNode;
}>;

export function SectionHeading({ index, eyebrow, title, aside }: SectionHeadingProps) {
  return (
    <Reveal className="mb-10 flex flex-col gap-4 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="eyebrow flex items-center gap-3">
          <span className="text-accent">{index}</span>
          <span className="h-px w-8 bg-line" aria-hidden="true" />
          {eyebrow}
        </p>
        <h2 className="mt-4 max-w-2xl text-[2rem] leading-[1.05] font-semibold tracking-[-0.03em] text-balance sm:text-5xl">{title}</h2>
      </div>
      {aside ? <div className="shrink-0">{aside}</div> : null}
    </Reveal>
  );
}
