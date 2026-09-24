import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "../components/motion/Reveal";
import { Page } from "../components/Page";
import { PageHeader } from "../components/PageHeader";
import { ProjectCard } from "../components/ProjectCard";
import { projects } from "../lib/content";

export const Route = createFileRoute("/projects/")({
  head: () => ({ meta: [{ title: "Projects · Haffi Mazhar" }] }),
  component: ProjectsPage
});

function ProjectsPage() {
  return (
    <Page>
      <PageHeader eyebrow={`Projects · ${projects.length}`} title="Things I've built on the side." emphasis={["side."]}>
        Side projects, from SaaS experiments to games. Most were built to learn a new stack end to end.
      </PageHeader>
      <div className="shell grid gap-5 md:grid-cols-2">
        {projects.map((project, index) => (
          <Reveal key={project.slug} delay={(index % 2) * 0.08} className="h-full">
            <ProjectCard project={project} index={index} />
          </Reveal>
        ))}
      </div>
    </Page>
  );
}
