import type { ReactNode } from "react";
import { SplitText } from "./motion/SplitText";

type PageHeaderProps = Readonly<{
  eyebrow: string;
  title: string;
  emphasis?: string[];
  children?: ReactNode;
}>;

export function PageHeader({ eyebrow, title, emphasis, children }: PageHeaderProps) {
  return (
    <header className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="grain absolute inset-0 -z-10 opacity-60" />
      <div className="shell pt-16 pb-12 sm:pt-24 sm:pb-16">
        <p className="eyebrow fade-up">{eyebrow}</p>
        <h1 className="mt-5 max-w-4xl text-[clamp(2.8rem,9vw,6.5rem)] leading-[0.92] font-semibold tracking-[-0.05em]">
          <SplitText text={title} emphasis={emphasis} stagger={0.07} />
        </h1>
        {children ? <div className="fade-up mt-7 max-w-xl text-lg leading-relaxed text-muted [animation-delay:0.35s]">{children}</div> : null}
      </div>
    </header>
  );
}
