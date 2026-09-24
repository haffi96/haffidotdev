import { achievements } from "../../lib/profile";
import { Counter } from "../motion/Counter";
import { Reveal } from "../motion/Reveal";
import { SectionHeading } from "../SectionHeading";

export function Achievements() {
  return (
    <section className="shell py-20 sm:py-28">
      <SectionHeading
        index="02"
        eyebrow="Impact"
        title={
          <>
            Numbers I've been <span className="font-display font-normal text-accent italic">accountable</span> for.
          </>
        }
      />
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {achievements.map((item, index) => (
          <Reveal as="li" key={item.label} delay={index * 0.08}>
            <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-card p-6 transition-[transform,border-color] duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-1 hover:border-accent/40 sm:p-7">
              <span
                aria-hidden="true"
                className="absolute -top-16 -right-16 size-40 rounded-full bg-accent/10 blur-2xl transition-transform duration-700 group-hover:scale-150"
              />
              <Counter
                value={item.value}
                className="relative text-[2.75rem] leading-none font-semibold tracking-[-0.05em] text-fg sm:text-5xl"
              />
              <p className="relative mt-6 text-sm font-semibold tracking-tight text-accent-ink">{item.label}</p>
              <p className="relative mt-2 text-sm leading-relaxed text-muted">{item.detail}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
