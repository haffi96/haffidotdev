import { createFileRoute } from "@tanstack/react-router";
import { ProjectCard } from "../components/Cards";
import { GitHubIcon } from "../components/Icons";
import { Page } from "../components/Page";
import { SectionHeading } from "../components/SectionHeading";
import { Window } from "../components/Window";
import { projects } from "../lib/content";
import { profile } from "../lib/profile";

export const Route = createFileRoute("/projects/")({
  head: () => ({ meta: [{ title: "Projects | Haffi Mazhar" }] }),
  component: ProjectsPage
});

function ProjectsPage() {
  return (
    <Page>
      <Window title={`~/projects  (${projects.length} items)`} accent="yellow" className="animate-window-pop" labelledBy="projects-heading">
        <SectionHeading
          id="projects-heading"
          level={1}
          kicker="Side quests"
          title="Projects"
          blurb="Weekend builds, SaaS experiments and one very scrappy fighting game. None of them have an on-call rota, which is exactly how I like my hobbies."
          action={
            <a href={profile.links.github} className="btn-3d btn-plain">
              <GitHubIcon /> More on GitHub
            </a>
          }
        />
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} priority={index < 3} />
          ))}
        </div>
      </Window>
    </Page>
  );
}
