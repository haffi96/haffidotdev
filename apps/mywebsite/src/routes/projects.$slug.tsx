import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { m } from "motion/react";
import { ArrowIcon, ArrowUpRightIcon, GitHubIcon } from "../components/Icons";
import { MarkdownContent } from "../components/MarkdownContent";
import { Reveal } from "../components/motion/Reveal";
import { SplitText } from "../components/motion/SplitText";
import { Page } from "../components/Page";
import { projectImageId } from "../components/ProjectCard";
import { findProject, getMediaUrl, projects, techTags } from "../lib/content";

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const project = findProject(params.slug);
    if (!project) {
      throw notFound();
    }
    return project;
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.data.title ?? "Project"} · Haffi Mazhar` }] }),
  component: ProjectPage
});

function ProjectPage() {
  const project = Route.useLoaderData();
  const index = projects.findIndex((entry) => entry.slug === project.slug);
  const next = projects[(index + 1) % projects.length];
  const tags = techTags(project.data.techstack);
  const links = [
    project.data.site ? { label: "Live site", href: project.data.site, icon: <ArrowUpRightIcon className="size-4" /> } : null,
    { label: project.data.githublink2 ? "Source (app)" : "Source", href: project.data.githublink1, icon: <GitHubIcon /> },
    project.data.githublink2 ? { label: "Source (API)", href: project.data.githublink2, icon: <GitHubIcon /> } : null
  ].filter((link) => link !== null);

  return (
    <Page className="shell pt-10 sm:pt-16">
      <Link
        to="/projects"
        className="fade-up group inline-flex items-center gap-2 text-sm font-medium text-muted no-underline hover:text-fg"
      >
        <ArrowIcon className="size-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-1" />
        All projects
      </Link>

      <header className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <p className="eyebrow fade-up">Project {String(index + 1).padStart(2, "0")}</p>
          <h1 className="mt-4 text-[clamp(2.3rem,6.5vw,4.75rem)] leading-[0.98] font-semibold tracking-[-0.045em] text-balance">
            <SplitText text={project.data.title} stagger={0.045} />
          </h1>
        </div>
        <div className="fade-up flex flex-wrap gap-2 [animation-delay:0.3s] lg:col-span-4 lg:justify-end">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2.5 text-sm font-medium no-underline transition-colors first:border-fg first:bg-fg first:text-bg hover:border-accent"
            >
              {link.icon}
              {link.label}
            </a>
          ))}
        </div>
      </header>

      <div className="mt-10 overflow-hidden rounded-[2rem] border border-line bg-card p-2 sm:mt-14 sm:p-3">
        <m.img
          layoutId={projectImageId(project.slug)}
          src={getMediaUrl(project.data.preview)}
          alt={`${project.data.title} preview`}
          className="max-h-[70vh] w-full rounded-[1.5rem] bg-raised object-contain"
        />
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <Reveal>
            <p className="eyebrow">Built with</p>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <li key={tag} className="chip">
                  {tag}
                </li>
              ))}
            </ul>
          </Reveal>
        </aside>
        <Reveal className="lg:col-span-8">
          <p className="eyebrow mb-2">Summary</p>
          <MarkdownContent body={project.body} />
        </Reveal>
      </div>

      {next && next.slug !== project.slug ? (
        <Reveal className="mt-20">
          <Link
            to="/projects/$slug"
            params={{ slug: next.slug }}
            className="group flex items-center justify-between gap-6 rounded-[2rem] border border-line bg-card p-6 no-underline transition-colors hover:border-accent/50 sm:p-8"
          >
            <span className="min-w-0">
              <span className="eyebrow">Next project</span>
              <span className="mt-2 block text-xl font-semibold tracking-tight text-balance sm:text-3xl">{next.data.title}</span>
            </span>
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-fg text-bg transition-transform duration-500 group-hover:translate-x-1 group-hover:bg-accent">
              <ArrowIcon className="size-5" />
            </span>
          </Link>
        </Reveal>
      ) : null}
    </Page>
  );
}
