import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "../components/Icons";
import { MarkdownContent } from "../components/MarkdownContent";
import { Page } from "../components/Page";
import { Chip, Tile, parseTechstack } from "../components/Tile";
import { findProject, getMediaUrl, projects } from "../lib/content";
import { ProjectLinks } from "../components/ProjectLinks";

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
  const others = projects.filter((entry) => entry.slug !== project.slug).slice(0, 2);

  return (
    <Page>
      <Link to="/projects" className="group mb-4 inline-flex items-center gap-1.5 px-1 text-sm text-muted no-underline hover:text-fg">
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" /> All projects
      </Link>
      <div className="bento">
        <Tile as="header" className="flex flex-col justify-between gap-6 p-6 sm:p-8 md:col-span-2 lg:col-span-4">
          <div>
            <p className="eyebrow">Project</p>
            <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
              {project.data.title}
            </h1>
          </div>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex flex-wrap gap-1.5">
              {parseTechstack(project.data.techstack).map((item) => (
                <Chip key={item}>{item}</Chip>
              ))}
            </div>
            <ProjectLinks site={project.data.site} repos={[project.data.githublink1, project.data.githublink2]} />
          </div>
        </Tile>

        <Tile index={1} className="p-2 md:col-span-2 lg:col-span-3">
          <img
            src={getMediaUrl(project.data.preview)}
            alt={`${project.data.title} preview`}
            className="w-full rounded-[1.1rem] border border-line bg-tile-2"
          />
        </Tile>

        <Tile as="section" index={2} className="flex flex-col gap-6 p-6 md:col-span-2 lg:col-span-1">
          <div>
            <h2 className="eyebrow mb-3">Summary</h2>
            <MarkdownContent body={project.body} className="prose-sm" />
          </div>
          <div className="border-t border-line pt-5">
            <h2 className="eyebrow mb-3">Built with</h2>
            <ul className="space-y-2 text-sm">
              {parseTechstack(project.data.techstack).map((item) => (
                <li key={item} className="flex items-center gap-2 text-fg-2">
                  <span className="size-1.5 rounded-full bg-accent" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-line pt-5">
            <h2 className="eyebrow mb-3">Links</h2>
            <ul className="space-y-2 text-sm">
              {[project.data.site, project.data.githublink1, project.data.githublink2]
                .filter((link): link is string => Boolean(link))
                .map((link) => (
                  <li key={link}>
                    <a
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex max-w-full items-center gap-1 break-all text-fg-2 no-underline hover:text-accent"
                    >
                      {link.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                      <ArrowUpRight className="nudge size-3.5 shrink-0" />
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        </Tile>

        {others.map((other, index) => (
          <Tile key={other.slug} index={3 + index} interactive className="flex items-center gap-4 p-2 pr-5 lg:col-span-2">
            <Link to="/projects/$slug" params={{ slug: other.slug }} className="stretched" aria-label={other.data.title} />
            <img
              src={getMediaUrl(other.data.preview)}
              alt=""
              loading="lazy"
              className="aspect-square w-20 shrink-0 rounded-[1.1rem] border border-line object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="eyebrow">Next project</p>
              <p className="mt-1 truncate font-semibold tracking-tight">{other.data.title}</p>
            </div>
            <ArrowUpRight className="nudge size-4 shrink-0 text-muted" />
          </Tile>
        ))}
      </div>
    </Page>
  );
}
