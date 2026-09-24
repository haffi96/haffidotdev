import { createFileRoute } from "@tanstack/react-router";
import { Page } from "../components/Page";
import {
  ArrowLink,
  BlogRow,
  Chip,
  Container,
  FileIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  ProjectCard,
  SectionHeading
} from "../components/ui";
import { projects, visibleBlogs } from "../lib/content";
import { achievements, education, experience, profile, skills } from "../lib/profile";
import avatarUrl from "../media/avatar.png?url";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Haffi Mazhar - Senior Software Engineer" }] }),
  component: Home
});

function Home() {
  const current = experience[0];

  return (
    <Page>
      <Hero currentCompany={current?.company} />

      <Container className="space-y-20 sm:space-y-28">
        <section aria-label="About">
          <SectionHeading index="01" title="About" />
          <div className="grid gap-10 md:grid-cols-[1fr_16rem]">
            <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
              {profile.summary}
            </p>
            <aside>
              <h3 className="font-mono text-xs text-zinc-500">education</h3>
              <ul className="mt-3 space-y-4">
                {education.map((item) => (
                  <li key={item.school}>
                    <p className="text-sm font-medium">{item.school}</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{item.degree}</p>
                    <p className="mt-0.5 font-mono text-xs text-zinc-500">{item.years}</p>
                  </li>
                ))}
              </ul>
            </aside>
          </div>

          <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {achievements.map((item) => (
              <li
                key={item.label}
                className="rounded-xl border border-zinc-300 bg-white p-4 sm:p-5 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <p className="font-mono text-2xl font-medium tracking-tight sm:text-3xl">{item.value}</p>
                <p className="mt-2 text-sm font-medium">{item.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-600 sm:text-sm dark:text-zinc-400">{item.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-label="Experience">
          <SectionHeading index="02" title="Experience" action={<ArrowLink to={profile.links.resume}>resume.pdf</ArrowLink>} />
          <ol className="relative space-y-12 border-l border-zinc-300 pl-6 sm:pl-8 dark:border-zinc-800">
            {experience.map((role, index) => (
              <li key={role.company} className="relative">
                <span
                  aria-hidden
                  className={`absolute top-1.5 -left-[31px] size-3 rounded-full border-2 sm:-left-[39px] ${
                    index === 0
                      ? "border-amber-500 bg-amber-400 dark:border-amber-400"
                      : "border-zinc-400 bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-950"
                  }`}
                />
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <h3 className="text-lg font-semibold tracking-tight">
                    {role.company}
                    {index === 0 ? (
                      <span className="ml-2 inline-block rounded-full bg-amber-100 px-2 py-0.5 align-middle font-mono text-[10px] font-medium text-amber-800 uppercase dark:bg-amber-400/10 dark:text-amber-300">
                        now
                      </span>
                    ) : null}
                  </h3>
                  <p className="shrink-0 font-mono text-xs text-zinc-500">
                    {role.start} - {role.end}
                  </p>
                </div>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {role.role} · {role.location}
                </p>
                <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {role.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-3">
                      <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-zinc-400 dark:bg-zinc-600" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {role.stack.map((tech) => (
                    <Chip key={tech}>{tech}</Chip>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-label="Skills">
          <SectionHeading index="03" title="Skills" />
          <div className="grid gap-4 sm:grid-cols-2">
            {skills.map((group) => (
              <div key={group.group} className="rounded-xl border border-zinc-300 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="font-mono text-xs text-zinc-500">{group.group.toLowerCase()}</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-md bg-zinc-100 px-2.5 py-1 text-sm text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section aria-label="Featured projects">
          <SectionHeading index="04" title="Side projects" action={<ArrowLink to="/projects">all projects</ArrowLink>} />
          <div className="grid gap-5 md:grid-cols-3">
            {projects.slice(0, 3).map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>

        <section aria-label="Recent writing">
          <SectionHeading index="05" title="Recent writing" action={<ArrowLink to="/blogs">all posts</ArrowLink>} />
          <ul className="divide-y divide-zinc-300 dark:divide-zinc-800">
            {visibleBlogs.slice(0, 4).map((blog) => (
              <BlogRow key={blog.slug} blog={blog} showCategory />
            ))}
          </ul>
        </section>
      </Container>
    </Page>
  );
}

function Hero({ currentCompany }: Readonly<{ currentCompany?: string }>) {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0" />
      <Container className="relative pt-14 pb-20 sm:pt-24 sm:pb-28">
        <div className="animate-rise flex flex-col items-start">
          <div className="flex items-center gap-4">
            <img
              src={avatarUrl}
              alt={profile.name}
              className="size-16 rounded-full object-cover ring-4 ring-white sm:size-20 dark:ring-zinc-900"
            />
            <div className="font-mono text-xs leading-relaxed text-zinc-600 sm:text-sm dark:text-zinc-400">
              <p>
                <span className="text-amber-600 dark:text-amber-400">$</span> whoami
              </p>
              <p>
                {profile.title}
                {currentCompany ? ` @ ${currentCompany}` : ""}
              </p>
              <p>{profile.location}</p>
            </div>
          </div>

          <h1 className="mt-8 text-4xl font-semibold tracking-tight sm:text-6xl">
            Hey, I'm Haffi{" "}
            <span className="font-mono font-medium text-amber-600 dark:text-amber-400">
              :)
              <span aria-hidden className="animate-blink ml-1 inline-block h-[0.8em] w-[0.45em] translate-y-[0.08em] bg-current" />
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600 sm:text-xl dark:text-zinc-400">
            I build real-time systems, backend services and the cloud infrastructure that keeps them fast. Lately that means
            low-latency video and control for autonomous vehicles.
          </p>

          <div className="mt-8 flex w-full flex-wrap items-center gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white no-underline transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <MailIcon className="size-4" />
              <span className="font-mono text-[13px]">{profile.email}</span>
            </a>
            <a
              href={profile.links.resume}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white/60 px-4 py-2.5 text-sm font-medium no-underline transition-colors hover:bg-white dark:border-zinc-700 dark:bg-zinc-900/60 dark:hover:bg-zinc-900"
            >
              <FileIcon className="size-4" />
              Resume
            </a>
            <div className="flex items-center gap-1">
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="inline-flex size-10 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-200 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
              >
                <LinkedInIcon className="size-[18px]" />
              </a>
              <a
                href={profile.links.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="inline-flex size-10 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-200 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
              >
                <GitHubIcon className="size-[18px]" />
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
