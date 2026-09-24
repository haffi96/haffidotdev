import { Link, createFileRoute } from "@tanstack/react-router";
import { ContactLinks } from "../components/Footer";
import { FeedTile } from "../components/FeedTile";
import { SectionHeading } from "../components/Hud";
import { LiveFeed } from "../components/LiveFeed";
import { LogList } from "../components/LogList";
import { Page } from "../components/Page";
import { SessionLog } from "../components/SessionLog";
import { SystemStatus } from "../components/SystemStatus";
import { Telemetry } from "../components/Telemetry";
import { projects, visibleBlogs } from "../lib/content";
import { profile } from "../lib/profile";
import avatarUrl from "../media/avatar.png?url";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: `${profile.name} · ${profile.title}` }] }),
  component: Home
});

function Home() {
  const featured = projects.slice(0, 3);
  const recent = visibleBlogs.slice(0, 4);

  return (
    <Page>
      {/* Hero */}
      <section className="grid items-center gap-10 pt-10 pb-16 sm:pt-14 lg:grid-cols-[1fr_1.12fr] lg:gap-12 lg:pt-20 lg:pb-24">
        <div className="min-w-0">
          <div className="flex items-center gap-4">
            <div className="corners relative shrink-0 border border-line p-1">
              <img src={avatarUrl} alt={profile.name} width={64} height={64} className="size-14 object-cover grayscale-[0.2] sm:size-16" />
            </div>
            <div className="min-w-0">
              <p className="hud-label text-phos-500">Operator · online</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">{profile.name}</h1>
              <p className="font-mono text-xs text-zinc-400">
                <span className="whitespace-nowrap">{profile.title}</span> <span className="text-zinc-600">·</span>{" "}
                <span className="whitespace-nowrap">{profile.location}</span>
              </p>
            </div>
          </div>

          <p className="mt-8 text-[2rem] leading-[1.08] font-semibold tracking-tight text-balance text-zinc-50 sm:text-5xl lg:text-[3.4rem]">
            Live video and control for autonomous vehicles, in{" "}
            <span className="font-mono font-medium text-phos">&lt;200ms</span>.
          </p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">{profile.summary}</p>

          <ContactLinks className="mt-8" />
        </div>

        <LiveFeed />
      </section>

      {/* Summary strip */}
      <section aria-label="Summary" className="grid grid-cols-2 border-y border-line font-mono sm:grid-cols-4">
        {[
          ["7+ yrs", "Backend & real-time"],
          ["WebRTC", "H.264 / VP9 over UDP"],
          ["3 links", "Fibre · 4G · Starlink"],
          ["GCP · AWS", "Terraform-managed"]
        ].map(([value, label], index) => (
          <div
            key={value}
            className={`px-3 py-5 sm:px-5 ${index % 2 === 1 ? "border-l border-line" : ""} ${index >= 2 ? "border-t border-line sm:border-t-0" : ""} ${index === 2 ? "sm:border-l" : ""}`}
          >
            <p className="text-lg text-zinc-100 sm:text-xl">{value}</p>
            <p className="mt-1 text-[11px] tracking-wider text-zinc-500 uppercase">{label}</p>
          </div>
        ))}
      </section>

      <section className="pt-20 sm:pt-24">
        <SectionHeading index="01" kicker="Telemetry" title="Key achievements" />
        <Telemetry />
      </section>

      <section className="pt-20 sm:pt-24">
        <SectionHeading
          index="02"
          kicker="Session log"
          title="Experience"
          action={
            <a href={profile.links.resume} className="font-mono text-xs tracking-wider text-phos uppercase no-underline hover:text-phos-200">
              Full resume (PDF) →
            </a>
          }
        />
        <SessionLog />
      </section>

      <section className="pt-20 sm:pt-24">
        <SectionHeading index="03" kicker="System status" title="Skills" />
        <SystemStatus />
      </section>

      <section className="pt-20 sm:pt-24">
        <SectionHeading
          index="04"
          kicker="Camera feeds"
          title="Featured projects"
          action={
            <Link to="/projects" className="font-mono text-xs tracking-wider text-phos uppercase no-underline hover:text-phos-200">
              All feeds →
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, index) => (
            <FeedTile key={project.slug} project={project} index={index} />
          ))}
        </div>
      </section>

      <section className="pt-20 sm:pt-24">
        <SectionHeading
          index="05"
          kicker="Logs"
          title="Recent writing"
          action={
            <Link to="/blogs" className="font-mono text-xs tracking-wider text-phos uppercase no-underline hover:text-phos-200">
              All logs →
            </Link>
          }
        />
        <LogList entries={recent} />
      </section>
    </Page>
  );
}
