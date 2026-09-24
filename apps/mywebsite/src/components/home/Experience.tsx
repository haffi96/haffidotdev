import { m, useInView, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { experience, type Role } from "../../lib/profile";
import { Reveal } from "../motion/Reveal";
import { spring } from "../motion/MotionProvider";
import { SectionHeading } from "../SectionHeading";

export function Experience() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  return (
    <section className="shell py-20 sm:py-28">
      <SectionHeading
        index="03"
        eyebrow="Experience"
        title={
          <>
            Seven years of systems that <span className="font-display font-normal text-accent italic">can't</span> be slow.
          </>
        }
      />
      <ol ref={ref} className="relative">
        <span aria-hidden="true" className="absolute top-2 bottom-2 left-[5px] w-px bg-line md:left-[calc(11rem+5px)]" />
        <m.span
          aria-hidden="true"
          style={{ scaleY }}
          className="absolute top-2 bottom-2 left-[5px] w-px origin-top bg-accent md:left-[calc(11rem+5px)]"
        />
        {experience.map((role) => (
          <TimelineItem key={role.company} role={role} />
        ))}
      </ol>
    </section>
  );
}

function TimelineItem({ role }: Readonly<{ role: Role }>) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -35% 0px" });

  return (
    <li ref={ref} className="relative grid gap-3 pb-14 pl-9 last:pb-0 md:grid-cols-[11rem_1fr] md:gap-0 md:pl-0">
      <m.span
        aria-hidden="true"
        className="absolute top-1.5 left-0 size-[11px] rounded-full border-2 border-accent bg-bg md:left-[11rem]"
        animate={{ scale: inView ? 1.25 : 1, backgroundColor: inView ? "var(--accent)" : "var(--bg)" }}
        transition={spring}
      />
      <div className="font-mono text-xs leading-6 text-muted md:pr-8">
        <p className="text-fg">
          {role.start} — {role.end}
        </p>
        <p>{role.location}</p>
      </div>
      <Reveal className="md:pl-12">
        <h3 className="text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">{role.company}</h3>
        <p className="mt-1 text-[0.95rem] font-medium text-accent-ink">{role.role}</p>
        <ul className="mt-5 space-y-2.5">
          {role.highlights.map((highlight) => (
            <li key={highlight} className="relative pl-5 text-[0.95rem] leading-relaxed text-soft">
              <span aria-hidden="true" className="absolute top-[0.7em] left-0 h-px w-2.5 bg-muted" />
              {highlight}
            </li>
          ))}
        </ul>
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {role.stack.map((tech) => (
            <li key={tech} className="chip">
              {tech}
            </li>
          ))}
        </ul>
      </Reveal>
    </li>
  );
}
