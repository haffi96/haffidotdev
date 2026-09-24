import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, GitHubIcon } from "../components/Icons";
import { ProjectLinks } from "../components/ProjectLinks";
import { Page } from "../components/Page";
import { PageHeader } from "../components/PageHeader";
import { Chip, Tile, parseTechstack } from "../components/Tile";
import { getMediaUrl, projects } from "../lib/content";

export const Route = createFileRoute("/projects/")({
  head: () => ({ meta: [{ title: "Projects · Haffi Mazhar" }] }),
  component: ProjectsPage
});

function ProjectsPage() {
  return (
    <Page>
      <div className="bento">
        <PageHeader
          eyebrow={`Projects · ${projects.length}`}
          title="Things I've built on the side"
          aside={
            <a className="btn btn-ghost shrink-0 self-start md:self-auto" href="https://github.com/haffi96" target="_blank" rel="noreferrer">
              <GitHubIcon className="size-4" /> More on GitHub
            </a>
          }
        >
          Weekend experiments and SaaS ideas, from AI print-on-demand to a game written in Pygame.
        </PageHeader>

        {projects.map((project, index) => (
          <Tile
            key={project.slug}
            as="article"
            index={index + 1}
            interactive
            className={`flex flex-col p-2 ${index === 0 ? "md:col-span-2 lg:col-span-4 lg:flex-row" : "lg:col-span-2"}`}
          >
            <Link to="/projects/$slug" params={{ slug: project.slug }} className="stretched" aria-label={project.data.title} />
            <div
              className={`aspect-[16/10] shrink-0 overflow-hidden rounded-[1.1rem] border border-line bg-tile-2 ${index === 0 ? "lg:w-3/5" : ""}`}
            >
              <img
                src={getMediaUrl(project.data.preview)}
                alt=""
                loading={index < 2 ? "eager" : "lazy"}
                decoding="async"
                className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between gap-5 p-4 sm:p-5">
              <div>
                {index === 0 ? <p className="eyebrow mb-3 text-accent!">Featured</p> : null}
                <div className="flex items-start justify-between gap-4">
                  <h2 className={`font-semibold tracking-tight ${index === 0 ? "text-xl sm:text-2xl" : "text-lg"}`}>
                    {project.data.title}
                  </h2>
                  <ArrowUpRight className="nudge mt-1.5 size-4 shrink-0 text-muted" />
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {parseTechstack(project.data.techstack).map((item) => (
                    <Chip key={item}>{item}</Chip>
                  ))}
                </div>
              </div>
              <ProjectLinks site={project.data.site} repos={[project.data.githublink1, project.data.githublink2]} />
            </div>
          </Tile>
        ))}
      </div>
    </Page>
  );
}
