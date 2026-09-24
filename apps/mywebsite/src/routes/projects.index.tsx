import { createFileRoute } from "@tanstack/react-router";
import { Page } from "../components/Page";
import { Container, PageHeader, ProjectCard } from "../components/ui";
import { projects } from "../lib/content";
import { profile } from "../lib/profile";

export const Route = createFileRoute("/projects/")({
  head: () => ({ meta: [{ title: "Projects - Haffi Mazhar" }] }),
  component: ProjectsPage
});

function ProjectsPage() {
  return (
    <Page>
      <Container>
        <PageHeader eyebrow="~/projects" title="Side projects">
          <p>
            Things I've built outside of work to learn a new stack, scratch an itch or just have fun. More on{" "}
            <a href={profile.links.github} className="text-zinc-900 underline decoration-zinc-400 hover:decoration-amber-500 dark:text-zinc-100">
              GitHub
            </a>
            .
          </p>
        </PageHeader>
        <div className="grid gap-5 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} headingLevel="h2" />
          ))}
        </div>
      </Container>
    </Page>
  );
}
