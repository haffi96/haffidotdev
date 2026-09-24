import { Link, createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { BlogRow, ProjectCard } from "../components/Cards";
import { ContactLinks } from "../components/Footer";
import { ArrowIcon, DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon } from "../components/Icons";
import { Page } from "../components/Page";
import { projects, visibleBlogs } from "../lib/content";
import { achievements, education, experience, profile, skills } from "../lib/profile";
import avatarUrl from "../media/avatar.png?url";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Haffi Mazhar | Senior Software Engineer" }] }),
  component: Home
});

function Home() {
  return (
    <Page backdrop="hero">
      <Hero />
      <div className="relative">
        <About />
        <Achievements />
        <Experience />
        <Skills />
        <FeaturedProjects />
        <RecentWriting />
        <Contact />
      </div>
    </Page>
  );
}

function Hero() {
  return (
    <section className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pt-28 pb-14 sm:px-8 md:justify-center md:pb-24">
      <div className="max-w-2xl">
        <p className="eyebrow flex items-center gap-3 motion-safe:animate-rise">
          <span className="h-px w-8 bg-neon/70" />
          {profile.title} · {profile.location}
        </p>
        <h1 className="mt-5 font-display text-5xl leading-[0.95] font-semibold tracking-tight text-white motion-safe:animate-rise sm:text-7xl lg:text-8xl">
          Haffi
          <br />
          <span className="bg-linear-to-r from-neon via-white to-flare bg-clip-text text-transparent">Mazhar</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-haze motion-safe:animate-rise sm:text-xl [animation-delay:120ms]">
          I build low-latency, real-time systems. Right now that means{" "}
          <span className="text-white">teleoperation for autonomous vehicles</span> at Oxa, streaming live video and control
          across fibre, 4G and Starlink.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3 motion-safe:animate-rise [animation-delay:200ms]">
          <a
            href="#experience"
            className="inline-flex items-center gap-2 rounded-full bg-neon px-5 py-2.5 text-sm font-semibold text-void no-underline shadow-[0_0_30px_-6px_rgb(60_240_255/0.7)] transition hover:bg-white"
          >
            View experience
          </a>
          <a
            href={profile.links.resume}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-void/50 px-5 py-2.5 text-sm text-white no-underline backdrop-blur transition hover:border-neon/60"
          >
            <DownloadIcon /> Resume
          </a>
          <div className="flex items-center gap-1 pl-1">
            <IconLink href={`mailto:${profile.email}`} label="Email">
              <MailIcon className="size-[1.1rem]" />
            </IconLink>
            <IconLink href={profile.links.linkedin} label="LinkedIn">
              <LinkedInIcon className="size-[1.1rem]" />
            </IconLink>
            <IconLink href={profile.links.github} label="GitHub">
              <GitHubIcon className="size-[1.1rem]" />
            </IconLink>
          </div>
        </div>
      </div>
      <div className="mt-14 hidden items-center gap-3 font-mono text-[0.7rem] tracking-[0.2em] text-mist uppercase md:flex">
        <span className="relative flex h-8 w-5 justify-center rounded-full border border-line">
          <span className="mt-1.5 h-1.5 w-0.5 rounded-full bg-neon motion-safe:animate-bounce" />
        </span>
        Scroll to explore
      </div>
    </section>
  );
}

function IconLink({ href, label, children }: Readonly<{ href: string; label: string; children: ReactNode }>) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="grid size-10 place-items-center rounded-full text-mist transition-colors hover:bg-white/5 hover:text-neon"
    >
      {children}
    </a>
  );
}

function Section({
  id,
  eyebrow,
  title,
  aside,
  children
}: Readonly<{ id: string; eyebrow: string; title: string; aside?: ReactNode; children: ReactNode }>) {
  return (
    <section id={id} className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16 sm:px-8 md:py-24">
      <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">{title}</h2>
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}

function About() {
  return (
    <Section id="about" eyebrow="01 / Summary" title="Engineering for the last few milliseconds">
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] md:gap-8">
        <div className="panel flex items-center gap-5 p-6">
          <div className="relative shrink-0">
            <div className="absolute -inset-1 rounded-full bg-linear-to-br from-neon to-flare opacity-70 blur-sm" />
            <img src={avatarUrl} alt={profile.name} className="relative size-20 rounded-full border-2 border-void object-cover sm:size-24" />
          </div>
          <div className="min-w-0">
            <p className="font-display text-xl font-semibold text-white">{profile.name}</p>
            <p className="mt-1 text-sm text-mist">{profile.title}</p>
            <p className="mt-2 font-mono text-[0.7rem] tracking-wide text-neon uppercase">{profile.location}</p>
          </div>
        </div>
        <div className="panel p-6 sm:p-8">
          <p className="text-lg leading-relaxed text-haze">{profile.summary}</p>
          <ul className="mt-6 grid gap-3 border-t border-line/70 pt-6 sm:grid-cols-2">
            {education.map((entry) => (
              <li key={entry.school}>
                <p className="text-sm font-medium text-white">{entry.degree}</p>
                <p className="mt-0.5 font-mono text-xs text-mist">
                  {entry.school} · {entry.years}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

function Achievements() {
  return (
    <Section id="impact" eyebrow="02 / Impact" title="Key numbers">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {achievements.map((item, index) => (
          <li key={item.label} className="panel relative overflow-hidden p-6">
            <div
              className={`absolute -top-10 -right-10 size-32 rounded-full blur-2xl ${index % 2 === 0 ? "bg-neon/15" : "bg-flare/15"}`}
            />
            <p className={`relative font-display text-4xl font-semibold tracking-tight md:text-5xl ${index % 2 === 0 ? "text-neon" : "text-flare"}`}>
              {item.value}
            </p>
            <p className="relative mt-3 font-medium text-white">{item.label}</p>
            <p className="relative mt-1.5 text-sm leading-relaxed text-mist">{item.detail}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Experience() {
  return (
    <Section id="experience" eyebrow="03 / Experience" title="Where I've shipped">
      <ol className="relative space-y-6 border-l border-line pl-6 sm:space-y-8 sm:pl-10 md:ml-4">
        {experience.map((role, index) => (
          <li key={role.company} className="relative">
            <span
              className={`absolute top-7 -left-[calc(1.5rem+5px)] size-2.5 rounded-full sm:-left-[calc(2.5rem+5px)] ${
                index === 0 ? "bg-flare shadow-[0_0_14px_2px_rgb(255_79_216/0.7)]" : "bg-neon shadow-[0_0_10px_1px_rgb(60_240_255/0.6)]"
              }`}
            />
            <article className="panel p-5 sm:p-7">
              <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between md:gap-6">
                <div className="min-w-0">
                  <h3 className="font-display text-2xl font-semibold text-white">{role.company}</h3>
                  <p className="mt-1 text-haze">{role.role}</p>
                </div>
                <p className="shrink-0 font-mono text-xs tracking-wide text-mist uppercase">
                  <span className={index === 0 ? "text-flare" : "text-neon"}>
                    {role.start} – {role.end}
                  </span>
                  <span className="mx-2 text-line">/</span>
                  {role.location}
                </p>
              </div>
              <ul className="mt-5 space-y-2.5">
                {role.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-3 text-[0.95rem] leading-relaxed text-haze">
                    <span className="mt-2.5 h-px w-3 shrink-0 bg-neon/60" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
              <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Stack">
                {role.stack.map((item) => (
                  <li key={item} className="chip">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ol>
    </Section>
  );
}

function Skills() {
  return (
    <Section id="skills" eyebrow="04 / Toolkit" title="Skills">
      <div className="grid gap-4 md:grid-cols-2">
        {skills.map((group) => (
          <div key={group.group} className="panel p-6">
            <h3 className="font-mono text-xs tracking-[0.18em] text-neon uppercase">{group.group}</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li key={item} className="rounded-lg border border-line bg-ink/80 px-3 py-1.5 text-sm text-white">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

function SeeAll({ to, label }: Readonly<{ to: "/projects" | "/blogs"; label: string }>) {
  return (
    <Link to={to} className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.16em] text-mist uppercase no-underline hover:text-neon">
      {label} <ArrowIcon className="size-3.5" />
    </Link>
  );
}

function FeaturedProjects() {
  return (
    <Section id="projects" eyebrow="05 / Side projects" title="Things I've built" aside={<SeeAll to="/projects" label="All projects" />}>
      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.slice(0, 3).map((project, index) => (
          <li key={project.slug}>
            <ProjectCard project={project} index={index} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

function RecentWriting() {
  return (
    <Section id="writing" eyebrow="06 / Learning logs" title="Recent writing" aside={<SeeAll to="/blogs" label="All posts" />}>
      <ol className="panel px-4 py-2 sm:px-6">
        {visibleBlogs.slice(0, 4).map((blog, index) => (
          <BlogRow key={blog.slug} blog={blog} index={index} />
        ))}
      </ol>
    </Section>
  );
}

function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl scroll-mt-24 px-5 pt-8 pb-24 sm:px-8">
      <div className="panel relative overflow-hidden px-6 py-12 sm:px-12 sm:py-16">
        <div className="absolute -top-24 -right-24 size-72 rounded-full bg-flare/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 size-72 rounded-full bg-neon/15 blur-3xl" />
        <p className="eyebrow relative">07 / Contact</p>
        <h2 className="relative mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl">
          Open a connection.
        </h2>
        <p className="relative mt-4 max-w-xl text-haze">
          Real-time systems, reliability at scale, or just a good networking rabbit hole: my inbox is open.
        </p>
        <ContactLinks className="relative mt-8" />
      </div>
    </section>
  );
}
