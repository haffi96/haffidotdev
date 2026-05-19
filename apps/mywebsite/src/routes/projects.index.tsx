import { createFileRoute } from "@tanstack/react-router";
import { Page } from "../components/Page";
import { getMediaUrl, projects } from "../lib/content";

export const Route = createFileRoute("/projects/")({
  head: () => ({ meta: [{ title: "My Projects" }] }),
  component: ProjectsPage
});

function ProjectsPage() {
  return (
    <Page>
      <div className="flex flex-col space-y-10 pt-10 text-center">
        <h2>Projects</h2>
        {projects.map((project) => (
          <div className="px-5" key={project.slug}>
            <article className="inline-block rounded-3xl border border-zinc-400 p-3">
              <div className="flex flex-col">
                <p className="font-bold">{project.data.title}</p>
                {project.data.site ? <a className="underline" href={project.data.site}>Demo site</a> : null}
                <div className="p-3">
                  <span>{project.data.techstack}</span>
                  <a className="pl-2 underline" href={project.data.githublink1}>Repo</a>
                </div>
                <a href={`/projects/${project.slug}`}>
                  <img className="rounded-3xl" src={getMediaUrl(project.data.preview)} alt="project preview" />
                </a>
              </div>
            </article>
          </div>
        ))}
      </div>
    </Page>
  );
}
