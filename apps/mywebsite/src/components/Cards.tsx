import { Link } from "@tanstack/react-router";
import type { BlogMeta, ContentEntry, ProjectMeta } from "../lib/content";
import { getMediaUrl } from "../lib/content";
import { categoryStyle, parseTechstack, readingMinutes } from "../lib/format";
import { ArrowIcon, GitHubIcon } from "./Icons";

export function ProjectCard({ project, priority = false }: Readonly<{ project: ContentEntry<ProjectMeta>; priority?: boolean }>) {
  const preview = getMediaUrl(project.data.preview);
  const stack = parseTechstack(project.data.techstack);

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-lg border-[1.5px] border-edge bg-window shadow-[0_3px_0_0_var(--ph-edge)] transition-transform duration-150 hover:-translate-y-0.5">
      <Link
        to="/projects/$slug"
        params={{ slug: project.slug }}
        className="relative block aspect-[16/10] overflow-hidden border-b-[1.5px] border-edge bg-desk-2"
        aria-label={`Read about ${project.data.title}`}
      >
        {preview ? (
          <img
            src={preview}
            alt=""
            loading={priority ? "eager" : "lazy"}
            className="size-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-lg leading-snug font-bold text-ink">
          <Link to="/projects/$slug" params={{ slug: project.slug }} className="no-underline hover:underline">
            {project.data.title}
          </Link>
        </h3>
        <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
          {stack.map((item) => (
            <li key={item} className="chip">
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
          <Link to="/projects/$slug" params={{ slug: project.slug }} className="btn-3d btn-orange px-3 py-1.5 text-xs">
            Details <ArrowIcon className="size-3.5" />
          </Link>
          {project.data.site ? (
            <a href={project.data.site} className="btn-3d btn-plain px-3 py-1.5 text-xs">
              Live demo
            </a>
          ) : null}
          <a href={project.data.githublink1} className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-ink">
            <GitHubIcon className="size-3.5" /> Code
          </a>
        </div>
      </div>
    </article>
  );
}

export function PostRow({ post }: Readonly<{ post: ContentEntry<BlogMeta> }>) {
  const category = categoryStyle(post.data.category);

  return (
    <li>
      <Link
        to="/blogs/$slug"
        params={{ slug: post.slug }}
        className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-1 px-3 py-3 no-underline hover:bg-chrome sm:px-4"
      >
        <span aria-hidden="true" className={`size-2.5 rounded-full border border-edge ${category.dot}`} />
        <span className="min-w-0 font-semibold text-ink group-hover:underline">{post.data.title}</span>
        <ArrowIcon className="size-4 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-ink" />
        <span className="col-start-2 flex flex-wrap gap-x-3 font-mono text-xs text-muted">
          <span>{category.label}</span>
          <span>{readingMinutes(post.body)} min read</span>
        </span>
      </Link>
    </li>
  );
}
