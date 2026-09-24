import { m, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { skills } from "../../lib/profile";
import { Reveal } from "../motion/Reveal";
import { SectionHeading } from "../SectionHeading";

export function Skills() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const forward = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const backward = useTransform(scrollYProgress, [0, 1], ["-30%", "0%"]);
  const all = skills.flatMap((group) => group.items);
  const half = Math.ceil(all.length / 2);

  return (
    <section className="py-20 sm:py-28">
      <div className="shell">
        <SectionHeading
          index="04"
          eyebrow="Toolbox"
          title={
            <>
              What I reach for <span className="font-display font-normal text-accent italic">every</span> day.
            </>
          }
        />
      </div>

      <div ref={ref} aria-hidden="true" className="relative mb-14 overflow-hidden py-2 select-none sm:mb-20">
        <MarqueeRow items={all.slice(0, half)} x={forward} />
        <MarqueeRow items={all.slice(half)} x={backward} outlined />
      </div>

      <div className="shell grid gap-3 sm:grid-cols-2">
        {skills.map((group, index) => (
          <Reveal key={group.group} delay={index * 0.06}>
            <div className="h-full rounded-3xl border border-line bg-card p-6 sm:p-7">
              <p className="flex items-center justify-between font-semibold tracking-tight">
                {group.group}
                <span className="font-mono text-xs font-normal text-muted">{String(group.items.length).padStart(2, "0")}</span>
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-line bg-bg px-3 py-1.5 text-sm text-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:text-fg"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function MarqueeRow({ items, x, outlined = false }: Readonly<{ items: string[]; x: ReturnType<typeof useTransform<number, string>>; outlined?: boolean }>) {
  const repeated = [...items, ...items, ...items];
  return (
    <m.div style={{ x }} className="flex w-max gap-8 py-1 whitespace-nowrap sm:gap-12">
      {repeated.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className={`flex items-center gap-8 text-[2.75rem] leading-tight font-semibold tracking-[-0.04em] sm:gap-12 sm:text-7xl ${
            outlined ? "text-transparent [-webkit-text-stroke:1px_var(--muted)]" : "text-fg"
          }`}
        >
          {item}
          <span className="size-2.5 rounded-full bg-accent sm:size-3.5" />
        </span>
      ))}
    </m.div>
  );
}
