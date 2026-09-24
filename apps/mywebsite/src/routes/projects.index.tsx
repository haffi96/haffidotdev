import { createFileRoute } from "@tanstack/react-router";
import { FeedTile } from "../components/FeedTile";
import { Page } from "../components/Page";
import { projects } from "../lib/content";

export const Route = createFileRoute("/projects/")({
  head: () => ({ meta: [{ title: "Projects · Haffi Mazhar" }] }),
  component: ProjectsPage
});

function ProjectsPage() {
  return (
    <Page className="pt-10 sm:pt-14">
      <header className="border-b border-line pb-8">
        <p className="hud-label text-phos-500">
          <span className="text-zinc-600">[01]</span> Camera feeds · {projects.length} sources
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">Projects</h1>
        <p className="mt-3 max-w-2xl text-zinc-400">
          Side projects and experiments, from SaaS builders to serverless feeds and a Pygame fighter. Open a feed for the
          details, the live site and the source.
        </p>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <FeedTile key={project.slug} project={project} index={index} />
        ))}
      </div>
    </Page>
  );
}
