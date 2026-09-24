import { createFileRoute } from "@tanstack/react-router";
import { ProjectCard } from "../components/Cards";
import { Page, PageHeader } from "../components/Page";
import { projects } from "../lib/content";

export const Route = createFileRoute("/projects/")({
  head: () => ({ meta: [{ title: "Projects | Haffi Mazhar" }] }),
  component: ProjectsPage
});

function ProjectsPage() {
  return (
    <Page backdrop="ambient">
      <PageHeader eyebrow="Side projects" title="Things I've built">
        <p>
          Products and experiments from outside the day job: SaaS builders, serverless feeds, mobile apps and the odd
          game.
        </p>
      </PageHeader>
      <ul className="mx-auto grid max-w-6xl gap-5 px-5 pb-24 sm:px-8 md:grid-cols-2">
        {projects.map((project, index) => (
          <li key={project.slug}>
            <ProjectCard project={project} index={index} />
          </li>
        ))}
      </ul>
    </Page>
  );
}
