import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon, PinIcon } from "../components/Icons";
import { Page } from "../components/Page";
import { Chip, Tile, parseTechstack } from "../components/Tile";
import { CopyButton, LocalTime } from "../components/Widgets";
import { getMediaUrl, projects, visibleBlogs } from "../lib/content";
import { categoryLabel } from "../lib/writing";
import { achievements, education, experience, profile, skills } from "../lib/profile";
import avatarUrl from "../media/avatar.png?url";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${profile.name} · ${profile.title}` },
      { name: "description", content: profile.summary }
    ]
  }),
  component: Home
});

const current = experience[0]!;
const featuredProjects = projects.slice(0, 4);
const latestPosts = visibleBlogs.slice(0, 5);

function Home() {
  let i = 0;
  const next = () => i++;

  return (
    <Page>
      <h1 className="sr-only">
        {profile.name}, {profile.title}
      </h1>
      <div className="bento">
        {/* Intro */}
        <Tile as="header" index={next()} className="flex flex-col justify-between gap-8 p-6 sm:p-8 md:col-span-2 lg:row-span-2">
          <div className="flex items-center gap-4">
            <img
              src={avatarUrl}
              alt={`Portrait of ${profile.name}`}
              width={72}
              height={72}
              className="size-16 rounded-2xl object-cover ring-1 ring-line sm:size-[72px]"
            />
            <div className="min-w-0">
              <p className="text-xl font-semibold tracking-tight sm:text-2xl">{profile.name}</p>
              <p className="text-sm text-muted">{profile.title}</p>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted">
                <PinIcon className="size-3.5" />
                {profile.location}
              </p>
            </div>
          </div>
          <div>
            <p className="text-2xl leading-tight font-semibold tracking-tight text-balance sm:text-[2rem]">
              I build <span className="gradient-text">real-time systems</span> that stay fast under pressure.
            </p>
            <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-fg-2">{profile.summary}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a className="btn btn-primary" href={`mailto:${profile.email}`}>
              <MailIcon className="size-4" /> Get in touch
            </a>
            <Link className="btn btn-ghost" to="/projects">
              View projects
            </Link>
          </div>
        </Tile>

        {/* Currently */}
        <Tile index={next()} className="flex flex-col justify-between gap-6 p-6 md:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full rounded-full bg-accent opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              Currently
            </span>
            <span className="eyebrow">{current.start} – now</span>
          </div>
          <div>
            <p className="text-xl font-semibold tracking-tight sm:text-2xl">
              {current.company} <span className="text-muted">·</span> AV teleoperation
            </p>
            <p className="mt-2 text-sm leading-relaxed text-fg-2">
              Building fleet-wide remote assist for autonomous vehicles: multi-client WebRTC video, remote control and
              real-time services across fibre, 4G and Starlink.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {current.stack.map((item) => (
              <Chip key={item}>{item}</Chip>
            ))}
          </div>
        </Tile>

        {/* Stats */}
        {achievements.map((stat) => (
          <Tile key={stat.value} index={next()} className="flex min-h-40 flex-col justify-between gap-4 p-6">
            <p className="eyebrow">{stat.label}</p>
            <div>
              <p className="text-4xl font-semibold tracking-tighter tabular-nums sm:text-5xl">
                <span className="gradient-text">{stat.value}</span>
              </p>
              <p className="mt-2 text-[13px] leading-snug text-muted">{stat.detail}</p>
            </div>
          </Tile>
        ))}

        {/* Local time */}
        <Tile
          index={next()}
          className="flex min-h-40 flex-col justify-between gap-4 bg-[radial-gradient(var(--line-strong)_1px,transparent_1px)] bg-size-[14px_14px] p-6"
        >
          <p className="eyebrow flex items-center gap-1.5">
            <PinIcon className="size-3.5" /> Oxford, UK
          </p>
          <LocalTime />
        </Tile>

        {/* Resume */}
        <Tile index={next()} interactive className="flex min-h-40 flex-col justify-between gap-4 bg-fg! p-6 text-bg">
          <a href={profile.links.resume} target="_blank" rel="noreferrer" className="stretched" aria-label="Open resume (PDF)" />
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase opacity-60">Resume</p>
            <DownloadIcon className="nudge size-5" />
          </div>
          <div>
            <p className="text-2xl font-semibold tracking-tight">Download CV</p>
            <p className="mt-1 text-sm opacity-60">Experience, skills &amp; education · PDF</p>
          </div>
        </Tile>

        {/* Experience */}
        <Tile as="section" index={next()} className="p-6 sm:p-7 md:col-span-2 lg:row-span-2">
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="eyebrow">Experience</h2>
            <span className="text-xs text-muted">7+ years</span>
          </div>
          <ol className="relative space-y-5 border-l border-line pl-5">
            {experience.map((role, index) => (
              <li key={role.company} className="relative">
                <span
                  className={`absolute top-1.5 -left-[25px] size-2.5 rounded-full ring-4 ring-tile ${index === 0 ? "bg-accent" : "bg-line-strong"}`}
                />
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <p className="font-semibold tracking-tight">{role.company}</p>
                  <p className="font-mono text-xs text-muted">
                    {role.start.split(" ")[1]} – {role.end === "Present" ? "now" : role.end.split(" ")[1]}
                  </p>
                </div>
                <p className="text-sm text-fg-2">{role.role}</p>
                <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-muted">{role.highlights[0]}</p>
              </li>
            ))}
          </ol>
          <div className="mt-6 border-t border-line pt-4">
            {education.map((item) => (
              <p key={item.school} className="flex flex-wrap justify-between gap-x-3 text-[13px] text-muted">
                <span>
                  <span className="text-fg-2">{item.school}</span> · {item.degree.split(" ")[0]}
                </span>
                <span className="font-mono text-xs">{item.years}</span>
              </p>
            ))}
          </div>
        </Tile>

        {/* Skills */}
        <Tile as="section" index={next()} className="p-6 sm:p-7 md:col-span-2">
          <h2 className="eyebrow mb-5">Toolbox</h2>
          <div className="space-y-4">
            {skills.map((group) => (
              <div key={group.group}>
                <p className="mb-2 text-sm font-medium">{group.group}</p>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <Chip key={item}>{item}</Chip>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Tile>

        {/* Socials */}
        <SocialTile
          index={next()}
          href={profile.links.linkedin}
          label="LinkedIn"
          handle="in/haffimazhar"
          icon={<LinkedInIcon className="size-6" />}
        />
        <SocialTile
          index={next()}
          href={profile.links.github}
          label="GitHub"
          handle="@haffi96"
          icon={<GitHubIcon className="size-6" />}
        />

        {/* Projects */}
        <div className="mt-6 flex items-end justify-between gap-4 px-1 md:col-span-2 lg:col-span-4">
          <h2 className="text-2xl font-semibold tracking-tight">Side projects</h2>
          <Link to="/projects" className="group inline-flex items-center gap-1 text-sm text-muted no-underline hover:text-fg">
            All projects <ArrowUpRight className="nudge size-4" />
          </Link>
        </div>
        {featuredProjects.map((project) => (
          <Tile key={project.slug} as="article" index={next()} interactive className="flex flex-col p-2 lg:col-span-2">
            <Link to="/projects/$slug" params={{ slug: project.slug }} className="stretched" aria-label={project.data.title} />
            <div className="aspect-[16/10] overflow-hidden rounded-[1.1rem] border border-line bg-tile-2">
              <img
                src={getMediaUrl(project.data.preview)}
                alt=""
                loading="lazy"
                decoding="async"
                className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <div className="flex items-start justify-between gap-4 p-4">
              <div className="min-w-0">
                <h3 className="font-semibold tracking-tight">{project.data.title}</h3>
                <p className="mt-1 truncate text-sm text-muted">{parseTechstack(project.data.techstack).join(" · ")}</p>
              </div>
              <ArrowUpRight className="nudge mt-1 size-4 shrink-0 text-muted" />
            </div>
          </Tile>
        ))}

        {/* Writing */}
        <Tile as="section" index={next()} className="p-6 sm:p-7 md:col-span-2 lg:row-span-2">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="eyebrow">Latest writing</h2>
            <Link to="/blogs" className="group inline-flex items-center gap-1 text-sm text-muted no-underline hover:text-fg">
              All posts <ArrowUpRight className="nudge size-3.5" />
            </Link>
          </div>
          <ul className="divide-y divide-line">
            {latestPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  to="/blogs/$slug"
                  params={{ slug: post.slug }}
                  className="group -mx-2 flex items-center justify-between gap-4 rounded-xl px-2 py-3.5 no-underline transition-colors hover:bg-tile-2"
                >
                  <span className="min-w-0">
                    <span className="block font-medium tracking-tight">{post.data.title}</span>
                    <span className="mt-0.5 block text-xs text-muted">{categoryLabel(post.data.category)}</span>
                  </span>
                  <ArrowUpRight className="nudge size-4 shrink-0 text-muted group-hover:text-accent" />
                </Link>
              </li>
            ))}
          </ul>
        </Tile>

        {/* Email */}
        <Tile index={next()} className="flex flex-col justify-between gap-6 p-6 sm:p-7 md:col-span-2">
          <div className="flex items-center justify-between">
            <p className="eyebrow">Say hello</p>
            <MailIcon className="size-5 text-muted" />
          </div>
          <div>
            <p className="text-2xl font-semibold tracking-tight sm:text-3xl">Let's build something fast.</p>
            <p className="mt-2 font-mono text-sm break-all text-fg-2">{profile.email}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a className="btn btn-primary" href={`mailto:${profile.email}`}>
              Send an email
            </a>
            <CopyButton value={profile.email} label="Copy address" />
          </div>
        </Tile>

        {/* Stack focus */}
        <Tile index={next()} className="flex min-h-40 flex-col justify-between gap-4 p-6">
          <p className="eyebrow">Focus</p>
          <p className="text-lg leading-snug font-semibold tracking-tight">
            Python, FastAPI &amp; WebRTC on <span className="text-accent">GCP</span> and <span className="text-accent">AWS</span>.
          </p>
        </Tile>
        <Tile index={next()} interactive className="flex min-h-40 flex-col justify-between gap-4 p-6">
          <Link to="/blogs" className="stretched" aria-label="Read the blog" />
          <div className="flex items-center justify-between">
            <p className="eyebrow">Notes</p>
            <ArrowUpRight className="nudge size-4 text-muted" />
          </div>
          <p>
            <span className="text-4xl font-semibold tracking-tighter">{visibleBlogs.length}</span>
            <span className="ml-2 text-sm text-muted">posts on networking, databases &amp; systems</span>
          </p>
        </Tile>
      </div>
    </Page>
  );
}

function SocialTile({
  index,
  href,
  label,
  handle,
  icon
}: Readonly<{ index: number; href: string; label: string; handle: string; icon: React.ReactNode }>) {
  return (
    <Tile index={index} interactive className="flex min-h-36 flex-col justify-between gap-4 p-6">
      <a href={href} target="_blank" rel="noreferrer" className="stretched" aria-label={`${label} (${handle})`} />
      <div className="flex items-start justify-between text-fg">
        {icon}
        <ArrowUpRight className="nudge size-4 text-muted" />
      </div>
      <div>
        <p className="font-semibold tracking-tight">{label}</p>
        <p className="text-sm text-muted">{handle}</p>
      </div>
    </Tile>
  );
}
