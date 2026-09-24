import { m, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import avatarUrl from "../../media/avatar.png?url";
import { experience, profile } from "../../lib/profile";
import { DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon } from "../Icons";
import { Magnetic } from "../motion/Magnetic";
import { SplitText } from "../motion/SplitText";

const ringText = `${profile.title} · ${profile.location} · `;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const blobY = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0.25]);
  const current = experience[0];

  return (
    <section ref={ref} className="relative isolate overflow-hidden pb-20 sm:pb-28">
      <div aria-hidden="true" className="grain absolute inset-0 -z-10 opacity-70" />
      <m.div
        aria-hidden="true"
        style={{ y: blobY }}
        className="absolute -top-40 right-[-30%] -z-10 size-[34rem] rounded-full bg-accent/25 blur-[110px] sm:right-[-8%] dark:bg-accent/15"
      />

      <div className="shell grid gap-12 pt-14 sm:pt-24 lg:grid-cols-12 lg:gap-8 lg:pt-28">
        <m.div style={{ y: textY, opacity: fade }} className="lg:col-span-8">
          <img
            src={avatarUrl}
            alt={profile.name}
            width={72}
            height={72}
            className="fade-up mb-8 size-[4.5rem] rounded-2xl object-cover shadow-lg ring-4 ring-card lg:hidden"
          />
          <p className="fade-up inline-flex items-center gap-2.5 rounded-full border border-line bg-card/70 py-1.5 pr-3.5 pl-2.5 text-xs font-medium text-soft backdrop-blur-sm sm:text-[0.8rem]">
            <span className="pulse-dot size-2 rounded-full bg-accent" aria-hidden="true" />
            {profile.title}
            {current ? <span className="text-muted">@ {current.company}</span> : null}
          </p>

          <h1 className="mt-7 text-[clamp(3.6rem,13vw,9.25rem)] leading-[0.86] font-semibold tracking-[-0.055em]">
            <SplitText text={profile.name} delay={0.1} stagger={0.09} />
          </h1>

          <p className="mt-7 max-w-2xl text-[1.65rem] leading-[1.12] font-medium tracking-[-0.025em] text-soft sm:text-4xl">
            <SplitText text="I build real-time systems that stay fast at scale." delay={0.35} stagger={0.035} emphasis={["fast"]} />
          </p>

          <p className="fade-up mt-7 max-w-xl text-base leading-relaxed text-muted [animation-delay:0.75s] sm:text-lg">
            Backend and real-time engineer with 7+ years across WebRTC, FastAPI and cloud infrastructure. Right now I'm
            building low-latency teleoperation for autonomous vehicles.
          </p>

          <div className="fade-up mt-9 flex flex-wrap items-center gap-3 [animation-delay:0.9s]">
            <Magnetic strength={0.2}>
              <a
                href={`mailto:${profile.email}`}
                className="group inline-flex items-center gap-2.5 rounded-full bg-fg px-5 py-3 text-sm font-medium text-bg no-underline shadow-[0_10px_30px_-10px_rgb(0_0_0/0.4)] transition-transform active:scale-[0.97]"
              >
                <MailIcon className="size-4 transition-transform duration-500 group-hover:-rotate-12" />
                Email me
              </a>
            </Magnetic>
            <Magnetic strength={0.2}>
              <a
                href={profile.links.resume}
                className="group inline-flex items-center gap-2.5 rounded-full border border-line bg-card px-5 py-3 text-sm font-medium text-fg no-underline transition-colors hover:border-accent/60"
              >
                <DownloadIcon className="size-4 transition-transform duration-500 group-hover:translate-y-0.5" />
                Resume
              </a>
            </Magnetic>
            <div className="flex gap-2">
              <a
                href={profile.links.linkedin}
                aria-label="LinkedIn"
                className="grid size-11 place-items-center rounded-full border border-line bg-card text-soft transition-colors hover:border-accent/60 hover:text-accent"
              >
                <LinkedInIcon />
              </a>
              <a
                href={profile.links.github}
                aria-label="GitHub"
                className="grid size-11 place-items-center rounded-full border border-line bg-card text-soft transition-colors hover:border-accent/60 hover:text-accent"
              >
                <GitHubIcon />
              </a>
            </div>
          </div>
        </m.div>

        <m.div style={{ y: portraitY }} className="relative hidden items-start justify-end lg:col-span-4 lg:flex">
          <div className="fade-up relative mt-6 [animation-delay:0.3s]">
            <div className="relative size-72 rotate-[4deg] overflow-hidden rounded-[2.25rem] border border-line bg-card p-2 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.5)] transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] hover:rotate-0 xl:size-80">
              <img src={avatarUrl} alt={profile.name} width={320} height={320} className="size-full rounded-[1.8rem] object-cover" />
            </div>
            <svg
              viewBox="0 0 200 200"
              aria-hidden="true"
              className="spin-slow absolute -bottom-12 -left-12 size-36 rounded-full bg-bg/80 p-1 text-fg backdrop-blur-md"
            >
              <defs>
                <path id="ring" d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0" />
              </defs>
              <text className="fill-current font-mono text-[15.5px] tracking-[0.22em] uppercase">
                <textPath href="#ring">{ringText}</textPath>
              </text>
              <circle cx="100" cy="100" r="9" className="fill-accent" />
            </svg>
          </div>
        </m.div>
      </div>
    </section>
  );
}
