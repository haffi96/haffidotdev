import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { MarkdownContent } from "../components/MarkdownContent";
import { Page } from "../components/Page";
import { Chip, Container, ExternalLink } from "../components/ui";
import { findProject, getMediaUrl, parseTechstack } from "../lib/content";

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const project = findProject(params.slug);
    if (!project) {
      throw notFound();
    }
    return project;
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.data.title ?? "Project"} - Haffi Mazhar` }] }),
  component: ProjectPage
});

function ProjectPage() {
  const project = Route.useLoaderData();
  const preview = getMediaUrl(project.data.preview);

  return (
    <Page>
      <Container narrow className="pt-10 sm:pt-14">
        <Link to="/projects" className="font-mono text-xs text-zinc-500 no-underline hover:text-zinc-950 dark:hover:text-white">
          &lt;- all projects
        </Link>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">{project.data.title}</h1>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {parseTechstack(project.data.techstack).map((tech) => (
            <Chip key={tech}>{tech}</Chip>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-sm">
          {project.data.site ? <ExternalLink href={project.data.site}>live site</ExternalLink> : null}
          <ExternalLink href={project.data.githublink1}>source</ExternalLink>
          {project.data.githublink2 ? <ExternalLink href={project.data.githublink2}>api source</ExternalLink> : null}
        </div>

        {preview ? (
          <figure className="mt-10 overflow-hidden rounded-xl border border-zinc-300 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <img src={preview} alt={`${project.data.title} demo`} className="w-full" />
          </figure>
        ) : null}

        <section className="mt-10">
          <h2 className="font-mono text-xs text-zinc-500">summary</h2>
          <div className="mt-3">
            <MarkdownContent body={project.body} />
          </div>
        </section>
      </Container>
    </Page>
  );
}
