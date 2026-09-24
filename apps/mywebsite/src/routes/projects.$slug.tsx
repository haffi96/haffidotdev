import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowIcon, GitHubIcon } from "../components/Icons";
import { MarkdownContent } from "../components/MarkdownContent";
import { Page } from "../components/Page";
import { Window } from "../components/Window";
import { findProject, getMediaUrl } from "../lib/content";
import { parseTechstack } from "../lib/format";

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const project = findProject(params.slug);
    if (!project) {
      throw notFound();
    }
    return project;
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.data.title ?? "Project"} | Haffi Mazhar` }] }),
  component: ProjectPage
});

function ProjectPage() {
  const project = Route.useLoaderData();
  const preview = getMediaUrl(project.data.preview);
  const stack = parseTechstack(project.data.techstack);
  const repos = [project.data.githublink1, project.data.githublink2].filter((link): link is string => Boolean(link));

  return (
    <Page>
      <nav aria-label="Breadcrumb" className="mb-4 font-mono text-sm">
        <Link to="/projects" className="inline-flex items-center gap-1.5 font-semibold text-muted no-underline hover:text-ink">
          <ArrowIcon className="size-4 rotate-180" /> projects
        </Link>
        <span className="text-muted"> / {project.slug}</span>
      </nav>

      <Window title={`${project.slug}.mdx`} accent="yellow" className="animate-window-pop" bodyClassName="p-0" as="article" labelledBy="project-title">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <div className="flex flex-col gap-5 p-5 sm:p-8">
            <p className="font-mono text-xs font-semibold tracking-wider text-ph-red uppercase">Project</p>
            <h1 id="project-title" className="-mt-3 text-3xl leading-tight font-bold tracking-tight text-ink sm:text-4xl">
              {project.data.title}
            </h1>
            <div>
              <h2 className="text-sm font-bold text-ink">Built with</h2>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {stack.map((item) => (
                  <li key={item} className="chip">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-3">
              {project.data.site ? (
                <a href={project.data.site} className="btn-3d btn-orange">
                  Open live demo <ArrowIcon />
                </a>
              ) : null}
              {repos.map((repo, index) => (
                <a key={repo} href={repo} className="btn-3d btn-plain">
                  <GitHubIcon /> {repos.length > 1 ? `Repo ${index + 1}` : "View the code"}
                </a>
              ))}
            </div>
          </div>
          {preview ? (
            <div className="flex items-center justify-center border-t-[1.5px] border-edge bg-desk-2 p-4 sm:p-6 lg:border-t-0 lg:border-l-[1.5px]">
              <img
                src={preview}
                alt={`Preview of ${project.data.title}`}
                className="max-h-[440px] w-auto max-w-full rounded-md border-[1.5px] border-edge bg-white"
              />
            </div>
          ) : null}
        </div>
        <div className="border-t-[1.5px] border-edge p-5 sm:p-8">
          <h2 className="font-mono text-xs font-semibold tracking-wider text-muted uppercase">Summary</h2>
          <div className="mt-2 max-w-[70ch]">
            <MarkdownContent body={project.body} />
          </div>
        </div>
      </Window>
    </Page>
  );
}
