import { Link } from "@tanstack/react-router";
import { m } from "motion/react";
import { getMediaUrl, techTags, type ContentEntry, type ProjectMeta } from "../lib/content";
import { ArrowUpRightIcon, GitHubIcon } from "./Icons";
import { TiltCard } from "./motion/TiltCard";

export function projectImageId(slug: string) {
  return `project-image-${slug}`;
}

export function ProjectCard({ project, index }: Readonly<{ project: ContentEntry<ProjectMeta>; index: number }>) {
  const tags = techTags(project.data.techstack);

  return (
    <TiltCard className="h-full rounded-[1.75rem]">
      <article className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-card shadow-[0_1px_0_rgb(0_0_0/0.03),0_20px_40px_-28px_rgb(0_0_0/0.35)] transition-shadow duration-500 group-hover:shadow-[0_1px_0_rgb(0_0_0/0.03),0_40px_70px_-30px_rgb(0_0_0/0.45)]">
        <Link to="/projects/$slug" params={{ slug: project.slug }} className="block no-underline">
          <div className="relative m-2 overflow-hidden rounded-[1.35rem] bg-raised">
            <m.img
              layoutId={projectImageId(project.slug)}
              src={getMediaUrl(project.data.preview)}
              alt={`${project.data.title} preview`}
              loading="lazy"
              decoding="async"
              className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
            />
            <span className="absolute top-3 left-3 rounded-full bg-black/55 px-2.5 py-1 font-mono text-[0.65rem] text-white backdrop-blur-md">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <div className="px-5 pt-3 sm:px-6">
            <h3 className="flex items-start justify-between gap-4 text-lg leading-snug font-semibold tracking-tight text-fg sm:text-xl">
              <span className="text-balance">{project.data.title}</span>
              <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-full border border-line text-soft transition-all duration-500 group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
                <ArrowUpRightIcon className="size-3.5" />
              </span>
            </h3>
          </div>
        </Link>
        <div className="mt-auto flex flex-col gap-4 px-5 pt-4 pb-5 sm:px-6 sm:pb-6">
          <ul className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <li key={tag} className="chip">
                {tag}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-4 text-sm font-medium">
            {project.data.site ? (
              <a href={project.data.site} className="inline-flex items-center gap-1.5 text-soft no-underline hover:text-accent-ink">
                <ArrowUpRightIcon className="size-3.5" /> Live site
              </a>
            ) : null}
            <a href={project.data.githublink1} className="inline-flex items-center gap-1.5 text-soft no-underline hover:text-accent-ink">
              <GitHubIcon className="size-3.5" /> Source
            </a>
          </div>
        </div>
      </article>
    </TiltCard>
  );
}
