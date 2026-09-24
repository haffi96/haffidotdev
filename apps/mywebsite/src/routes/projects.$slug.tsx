import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowIcon, ArrowLeftIcon, GitHubIcon } from "../components/Icons";
import { MarkdownContent } from "../components/MarkdownContent";
import { Page } from "../components/Page";
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

const buttonClass =
  "inline-flex items-center gap-2 rounded-full border border-line bg-ink/70 px-4 py-2 text-sm text-white no-underline transition hover:border-neon/60 hover:text-neon";

function ProjectPage() {
  const project = Route.useLoaderData();
  const preview = getMediaUrl(project.data.preview);
  const repos = [project.data.githublink1, project.data.githublink2].filter((link): link is string => Boolean(link));

  return (
    <Page>
      <article className="mx-auto max-w-5xl px-5 pt-28 pb-24 sm:px-8 md:pt-36">
        <Link to="/projects" className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.16em] text-mist uppercase no-underline hover:text-neon">
          <ArrowLeftIcon className="size-3.5" /> All projects
        </Link>
        <header className="mt-8">
          <p className="eyebrow">Project</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
            {project.data.title}
          </h1>
          <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Tech stack">
            {parseTechstack(project.data.techstack).map((item) => (
              <li key={item} className="chip">
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.data.site ? (
              <a
                href={project.data.site}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-neon px-4 py-2 text-sm font-semibold text-void no-underline transition hover:bg-white"
              >
                Visit live site <ArrowIcon className="size-3.5" />
              </a>
            ) : null}
            {repos.map((repo, index) => (
              <a key={repo} href={repo} target="_blank" rel="noreferrer" className={buttonClass}>
                <GitHubIcon /> {repos.length > 1 ? `Repository ${index + 1}` : "Repository"}
              </a>
            ))}
          </div>
        </header>
        {preview ? (
          <figure className="panel mt-10 flex justify-center overflow-hidden bg-ink/80 p-2 sm:p-3">
            <img
              src={preview}
              alt={`${project.data.title} preview`}
              className="max-h-[70vh] w-auto max-w-full rounded-xl object-contain"
            />
          </figure>
        ) : null}
        <section className="mx-auto mt-12 max-w-3xl">
          <h2 className="eyebrow">Summary</h2>
          <MarkdownContent body={project.body} className="mt-4" />
        </section>
      </article>
    </Page>
  );
}
