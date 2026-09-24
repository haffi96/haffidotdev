import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { Chip, parseTechstack } from "../components/Hud";
import { MarkdownContent } from "../components/MarkdownContent";
import { Page } from "../components/Page";
import { findProject, getMediaUrl, projects } from "../lib/content";

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const project = findProject(params.slug);
    if (!project) {
      throw notFound();
    }
    return project;
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.data.title ?? "Project"} · Haffi Mazhar` }] }),
  component: ProjectPage
});

function ProjectPage() {
  const project = Route.useLoaderData();
  const index = projects.findIndex((entry) => entry.slug === project.slug);
  const previous = index > 0 ? projects[index - 1] : undefined;
  const next = index < projects.length - 1 ? projects[index + 1] : undefined;
  const camId = `CAM ${String(index + 1).padStart(2, "0")}`;
  const tags = parseTechstack(project.data.techstack);

  const links = [
    project.data.site ? { href: project.data.site, label: "Live site" } : null,
    { href: project.data.githublink1, label: project.data.githublink2 ? "Repo · app" : "Repository" },
    project.data.githublink2 ? { href: project.data.githublink2, label: "Repo · api" } : null
  ].filter((link): link is { href: string; label: string } => link !== null);

  return (
    <Page className="pt-8 sm:pt-12">
      <nav aria-label="Breadcrumb" className="font-mono text-[11px] tracking-wider text-zinc-500 uppercase">
        <Link to="/projects" className="no-underline hover:text-phos">
          Projects
        </Link>{" "}
        <span className="text-zinc-700">/</span> <span className="text-zinc-400">{camId}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-10">
        <div className="corners min-w-0 border border-line">
          <div className="flex items-center justify-between border-b border-line px-3 py-2 sm:px-4">
            <span className="hud-label text-zinc-400">{camId} · preview</span>
            <span className="hud-label flex items-center gap-1.5 text-alert">
              <span className="size-1.5 rounded-full bg-alert" /> Rec
            </span>
          </div>
          <div className="relative bg-ink-900">
            <img src={getMediaUrl(project.data.preview)} alt={`${project.data.title} preview`} className="block w-full" />
            <div aria-hidden="true" className="scanlines pointer-events-none absolute inset-0 opacity-40" />
          </div>
        </div>

        <div className="min-w-0">
          <p className="hud-label text-phos-500">Feed metadata</p>
          <h1 className="mt-2 text-3xl leading-tight font-semibold tracking-tight text-zinc-50 sm:text-4xl">{project.data.title}</h1>

          <dl className="mt-6 space-y-4 border-t border-line pt-5">
            <div>
              <dt className="hud-label">Stack</dt>
              <dd className="mt-2 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <Chip key={tag}>{tag}</Chip>
                ))}
              </dd>
            </div>
            <div>
              <dt className="hud-label">Endpoints</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="border border-line-strong bg-ink-900 px-3 py-2 font-mono text-xs text-zinc-200 no-underline transition-colors hover:border-phos/60 hover:text-phos"
                  >
                    {link.label} ↗
                  </a>
                ))}
              </dd>
            </div>
          </dl>

          <div className="mt-8 border-t border-line pt-5">
            <p className="hud-label">Notes</p>
            <div className="mt-2">
              <MarkdownContent body={project.body} />
            </div>
          </div>
        </div>
      </div>

      <nav aria-label="More projects" className="mt-16 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
        {previous ? (
          <Link
            to="/projects/$slug"
            params={{ slug: previous.slug }}
            className="corners border border-line p-4 no-underline transition-colors hover:border-line-strong"
          >
            <span className="hud-label">← Previous feed</span>
            <span className="mt-1 block font-medium text-zinc-100">{previous.data.title}</span>
          </Link>
        ) : (
          <span className="hidden sm:block" />
        )}
        {next ? (
          <Link
            to="/projects/$slug"
            params={{ slug: next.slug }}
            className="corners border border-line p-4 text-right no-underline transition-colors hover:border-line-strong"
          >
            <span className="hud-label">Next feed →</span>
            <span className="mt-1 block font-medium text-zinc-100">{next.data.title}</span>
          </Link>
        ) : null}
      </nav>
    </Page>
  );
}
