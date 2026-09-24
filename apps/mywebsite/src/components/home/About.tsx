import { m, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { education, profile } from "../../lib/profile";
import { Reveal } from "../motion/Reveal";
import { useBelowFold } from "../motion/useBelowFold";

export function About() {
  const ref = useRef<HTMLParagraphElement>(null);
  const armed = useBelowFold(ref);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = profile.summary.split(" ");

  return (
    <section className="shell grid gap-12 py-20 sm:py-28 lg:grid-cols-12 lg:gap-8">
      <Reveal className="lg:col-span-3">
        <p className="eyebrow flex items-center gap-3">
          <span className="text-accent">01</span>
          <span className="h-px w-8 bg-line" aria-hidden="true" />
          About
        </p>
      </Reveal>
      <div className="lg:col-span-9">
        <p ref={ref} className="text-[1.6rem] leading-[1.3] font-medium tracking-[-0.02em] text-fg sm:text-[2.35rem]">
          {armed
            ? words.map((word, index) => (
                <Word key={`${word}-${index}`} progress={scrollYProgress} range={[index / words.length, (index + 1) / words.length]}>
                  {word}
                </Word>
              ))
            : profile.summary}
        </p>
        <Reveal delay={0.1} className="mt-12 grid gap-4 sm:grid-cols-2">
          {education.map((item) => (
            <div key={item.school} className="rounded-2xl border border-line bg-card/60 p-5">
              <p className="font-mono text-xs text-muted">{item.years}</p>
              <p className="mt-2 font-semibold tracking-tight">{item.school}</p>
              <p className="mt-1 text-sm text-muted">{item.degree}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function Word({ children, progress, range }: Readonly<{ children: string; progress: MotionValue<number>; range: [number, number] }>) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <>
      <m.span style={{ opacity }}>{children}</m.span>{" "}
    </>
  );
}
