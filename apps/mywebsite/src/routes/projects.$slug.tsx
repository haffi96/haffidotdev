import { createFileRoute, notFound } from "@tanstack/react-router";
import { MarkdownContent } from "../components/MarkdownContent";
import { Page } from "../components/Page";
import { findProject } from "../lib/content";

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const project = findProject(params.slug);
    if (!project) {
      throw notFound();
    }
    return project;
  },
  head: ({ loaderData }) => ({ meta: [{ title: loaderData?.data.title ?? "Project" }] }),
  component: ProjectPage
});

function ProjectPage() {
  const project = Route.useLoaderData();

  return (
    <Page className="px-8 text-center md:px-20">
      <h1>{project.data.techstack}</h1>
      <p className="font-bold">Summary:</p>
      <MarkdownContent body={project.body} />
    </Page>
  );
}
