import { Link, createFileRoute } from "@tanstack/react-router";
import { PostRow, ProjectCard } from "../components/Cards";
import { ChillServerDoodle, LatencyDoodle } from "../components/Doodles";
import { ArrowIcon, CheckIcon, FileIcon, GitHubIcon, LinkedInIcon, MailIcon } from "../components/Icons";
import { Page } from "../components/Page";
import { SectionHeading } from "../components/SectionHeading";
import { Window } from "../components/Window";
import { projects, visibleBlogs } from "../lib/content";
import { achievements, education, experience, profile, skills } from "../lib/profile";
import avatarUrl from "../media/avatar.png?url";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Haffi Mazhar | Senior Software Engineer" },
      { name: "description", content: profile.summary }
    ]
  }),
  component: Home
});

const statColors = ["border-t-ph-red", "border-t-ph-yellow", "border-t-ph-blue", "border-t-ph-purple"];
const statText = ["text-ph-red", "text-ph-orange", "text-ph-blue", "text-ph-purple"];
const dotColors = ["bg-ph-red", "bg-ph-yellow", "bg-ph-blue", "bg-ph-green"];
const skillAccents = ["bg-ph-blue", "bg-ph-red", "bg-ph-yellow", "bg-ph-purple"];

function Home() {
  const featured = projects.slice(0, 3);
  const recentPosts = visibleBlogs.slice(0, 5);

  return (
    <Page className="space-y-5 sm:space-y-7">
      <Hero />
      <Achievements />

      <div className="grid gap-5 sm:gap-7 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        <Experience />
        <div className="flex min-w-0 flex-col gap-5 sm:gap-7">
          <Skills />
          <Education />
          <Window title="latency.sketch" draggable accent="blue" bodyClassName="p-4 text-ink" className="hidden sm:block">
            <LatencyDoodle className="w-full" />
            <p className="mt-2 text-center font-mono text-xs text-muted">Not to scale. Emotionally accurate.</p>
          </Window>
        </div>
      </div>

      <Window title="~/projects --featured" accent="yellow" labelledBy="projects-heading">
        <SectionHeading
          id="projects-heading"
          kicker="Side quests"
          title="Things I built after hours"
          blurb="Apps I built for fun, for friends, and to try out tech that I couldn't justify at work."
          action={
            <Link to="/projects" className="btn-3d btn-plain">
              All projects <ArrowIcon className="size-4" />
            </Link>
          }
        />
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, index) => (
            <ProjectCard key={project.slug} project={project} priority={index === 0} />
          ))}
        </div>
      </Window>

      <div className="grid gap-5 sm:gap-7 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        <Window title="~/learning-logs" accent="purple" bodyClassName="p-0" labelledBy="posts-heading">
          <div className="p-5 pb-3 sm:p-7 sm:pb-4">
            <SectionHeading
              id="posts-heading"
              kicker="Learning logs"
              title="Notes I wrote so future me stops googling"
              action={
                <Link to="/blogs" className="btn-3d btn-plain">
                  All posts <ArrowIcon className="size-4" />
                </Link>
              }
            />
          </div>
          <ul className="divide-y-[1.5px] divide-dashed divide-line border-t-[1.5px] border-edge">
            {recentPosts.map((post) => (
              <PostRow key={post.slug} post={post} />
            ))}
          </ul>
        </Window>
        <Contact />
      </div>
    </Page>
  );
}

function Hero() {
  return (
    <Window title="~/haffi/README.md" accent="red" className="animate-window-pop" bodyClassName="p-5 sm:p-8 lg:p-10" labelledBy="hero-heading">
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-10">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-edge bg-desk-2 px-3 py-1 font-mono text-xs font-medium text-ink">
            <span aria-hidden="true" className="relative flex size-2">
              <span className="absolute inline-flex size-full rounded-full bg-ph-green opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex size-2 rounded-full bg-ph-green" />
            </span>
            {profile.title} · {profile.location}
          </p>
          <h1 id="hero-heading" className="mt-5 text-[2.35rem] leading-[1.05] font-bold tracking-tight text-ink sm:text-5xl lg:text-[3.6rem]">
            Hi, I'm {profile.name.split(" ")[0]}. I make <span className="hl hl-blue">real-time</span> systems feel{" "}
            <span className="hl hl-yellow">instant</span>
            <span aria-hidden="true" className="animate-blink ml-1 inline-block h-[0.8em] w-[0.12em] translate-y-[0.08em] bg-ph-red" />
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-body">{profile.summary}</p>
          <p className="mt-4 max-w-2xl text-sm text-muted">
            Previously: kept Sky's identity platform upright for 15M concurrent users and zero panic. Currently: making cars feel close
            when they're a long way off.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={`mailto:${profile.email}`} className="btn-3d btn-orange px-5 py-2.5">
              <MailIcon /> Email me
            </a>
            <a href={profile.links.resume} className="btn-3d btn-plain px-5 py-2.5">
              <FileIcon /> Resume (PDF)
            </a>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
            <li>
              <a className="inline-flex items-center gap-1.5 text-ink hover:text-ph-red" href={profile.links.linkedin}>
                <LinkedInIcon /> LinkedIn
              </a>
            </li>
            <li>
              <a className="inline-flex items-center gap-1.5 text-ink hover:text-ph-red" href={profile.links.github}>
                <GitHubIcon /> GitHub
              </a>
            </li>
            <li>
              <a className="inline-flex items-center gap-1.5 break-all text-ink hover:text-ph-red" href={`mailto:${profile.email}`}>
                <MailIcon /> {profile.email}
              </a>
            </li>
          </ul>
        </div>

        <Window title="whoami.exe" draggable accent="yellow" className="lg:rotate-[1.2deg]" bodyClassName="p-5">
          <div className="flex items-center gap-4">
            <img
              src={avatarUrl}
              alt={`Portrait of ${profile.name}`}
              width={96}
              height={90}
              className="size-20 shrink-0 rounded-lg border-[1.5px] border-edge bg-desk-2 object-cover sm:size-24"
            />
            <div className="min-w-0">
              <p className="text-xl font-bold text-ink">{profile.name}</p>
              <p className="text-sm text-muted">{profile.title}</p>
              <p className="mt-1 font-mono text-xs text-muted">{experience[0]?.company} · {profile.location}</p>
            </div>
          </div>
          <ul className="mt-5 space-y-2.5 text-[0.95rem]">
            {[
              "7+ years of backend and real-time systems",
              "Latency measured in milliseconds, not excuses",
              "Load-tested at 15M concurrent users (nobody panicked)",
              "Python by day, Go / C++ / TypeScript when needed"
            ].map((line) => (
              <li key={line} className="flex gap-2.5">
                <CheckIcon className="mt-1 size-4 shrink-0 text-ph-green" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-end justify-between gap-3 border-t-[1.5px] border-dashed border-line pt-4">
            <p className="font-mono text-xs text-muted">
              uptime: 7+ yrs
              <br />
              p99 reply time: &lt; 48h
            </p>
            <ChillServerDoodle className="-mb-1 h-16 w-16 shrink-0" />
          </div>
        </Window>
      </div>
    </Window>
  );
}

function Achievements() {
  return (
    <Window title="metrics.dashboard" accent="green" labelledBy="stats-heading">
      <SectionHeading id="stats-heading" kicker="Benchmarks" title="Numbers I'm allowed to brag about" />
      <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {achievements.map((stat, index) => (
          <li
            key={stat.label}
            className={`rounded-lg border-[1.5px] border-t-[5px] border-edge bg-desk p-3 sm:p-4 ${statColors[index % statColors.length]}`}
          >
            <p className={`text-[1.7rem] font-bold tracking-tight sm:text-4xl ${statText[index % statText.length]}`}>{stat.value}</p>
            <p className="mt-1 font-bold text-ink">{stat.label}</p>
            <p className="mt-1.5 text-sm leading-snug text-muted">{stat.detail}</p>
          </li>
        ))}
      </ul>
    </Window>
  );
}

function Experience() {
  return (
    <Window title="git log --career" accent="red" labelledBy="experience-heading">
      <SectionHeading id="experience-heading" kicker="Changelog" title="Where I've shipped things" />
      <ol className="relative mt-7 space-y-8 border-l-[2px] border-dashed border-line pl-6 sm:pl-8">
        {experience.map((role, index) => (
          <li key={role.company} className="relative">
            <span
              aria-hidden="true"
              className={`absolute top-1.5 -left-[33px] size-4 rounded-full border-[2px] border-edge sm:-left-[41px] ${dotColors[index % dotColors.length]}`}
            />
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-xl font-bold text-ink">
                {role.company}
                {role.end === "Present" ? (
                  <span className="ml-2 inline-block -translate-y-0.5 rounded bg-ph-green px-1.5 py-0.5 align-middle font-mono text-[0.65rem] font-semibold tracking-wide text-white uppercase">
                    Now
                  </span>
                ) : null}
              </h3>
              <p className="font-mono text-xs text-muted">
                {role.start} – {role.end}
              </p>
            </div>
            <p className="mt-0.5 font-semibold text-body">{role.role}</p>
            <p className="font-mono text-xs text-muted">{role.location}</p>
            <ul className="mt-3 space-y-2 text-[0.95rem] leading-relaxed">
              {role.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 rotate-45 bg-ph-red" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
            <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={`${role.company} stack`}>
              {role.stack.map((item) => (
                <li key={item} className="chip">
                  {item}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Window>
  );
}

function Skills() {
  return (
    <Window title="stack.json" accent="blue" labelledBy="skills-heading">
      <SectionHeading id="skills-heading" kicker="Toolbox" title="Things I reach for before coffee" />
      <div className="mt-5 space-y-5">
        {skills.map((group, index) => (
          <div key={group.group}>
            <h3 className="flex items-center gap-2 text-sm font-bold text-ink">
              <span aria-hidden="true" className={`size-2.5 rounded-sm border border-edge ${skillAccents[index % skillAccents.length]}`} />
              {group.group}
            </h3>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <li key={item} className="chip bg-desk">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Window>
  );
}

function Education() {
  return (
    <Window title="education.txt" accent="purple" labelledBy="education-heading">
      <SectionHeading id="education-heading" kicker="Education" title="Engineer, originally the mechanical kind" />
      <ul className="mt-5 space-y-4">
        {education.map((item) => (
          <li key={item.school} className="rounded-md border-[1.5px] border-line bg-desk p-3">
            <p className="font-bold text-ink">{item.school}</p>
            <p className="text-sm text-body">{item.degree}</p>
            <p className="mt-1 font-mono text-xs text-muted">{item.years}</p>
          </li>
        ))}
      </ul>
    </Window>
  );
}

function Contact() {
  return (
    <Window title="say-hello.exe" accent="yellow" labelledBy="contact-heading" className="self-start">
      <SectionHeading id="contact-heading" kicker="Contact" title="My inbox has great uptime" />
      <p className="mt-3 text-body">
        Want to talk WebRTC, shaving milliseconds off a pipeline, or why your p99 is lying to you? Send a message. Replies are
        eventually consistent, but they do arrive.
      </p>
      <div className="mt-5 flex flex-col gap-3">
        <a href={`mailto:${profile.email}`} className="btn-3d btn-orange w-full justify-start">
          <MailIcon /> <span className="truncate">{profile.email}</span>
        </a>
        <a href={profile.links.linkedin} className="btn-3d btn-plain w-full justify-start">
          <LinkedInIcon /> LinkedIn
        </a>
        <a href={profile.links.github} className="btn-3d btn-plain w-full justify-start">
          <GitHubIcon /> GitHub
        </a>
      </div>
    </Window>
  );
}
