import { Link } from "@tanstack/react-router";
import { type BlogMeta, type ContentEntry, type ProjectMeta, getMediaUrl } from "../lib/content";
import { formatCategory, parseTechstack, readingTime } from "../lib/format";
import { ArrowIcon, GitHubIcon } from "./Icons";

export function ProjectCard({ project, index }: Readonly<{ project: ContentEntry<ProjectMeta>; index: number }>) {
  const preview = getMediaUrl(project.data.preview);
  const tech = parseTechstack(project.data.techstack);

  return (
    <article className="panel group flex h-full flex-col overflow-hidden transition-colors hover:border-neon/40">
      <Link to="/projects/$slug" params={{ slug: project.slug }} className="relative block overflow-hidden no-underline" tabIndex={-1}>
        <div className="aspect-[16/10] w-full overflow-hidden bg-ink">
          {preview ? (
            <img
              src={preview}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover opacity-85 transition duration-700 group-hover:scale-[1.03] group-hover:opacity-100 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          ) : null}
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--color-panel),transparent_55%)]" />
        <span className="absolute top-3 left-3 rounded-full border border-white/10 bg-void/70 px-2.5 py-1 font-mono text-[0.68rem] tracking-widest text-neon backdrop-blur">
          {String(index + 1).padStart(2, "0")}
        </span>
      </Link>
      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <h3 className="font-display text-xl font-semibold tracking-tight text-white">
          <Link to="/projects/$slug" params={{ slug: project.slug }} className="no-underline hover:text-neon">
            {project.data.title}
          </Link>
        </h3>
        <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
          {tech.map((item) => (
            <li key={item} className="chip">
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-2 text-sm">
          <Link
            to="/projects/$slug"
            params={{ slug: project.slug }}
            className="inline-flex items-center gap-1.5 text-white no-underline hover:text-neon"
          >
            Details <ArrowIcon className="size-3.5" />
          </Link>
          {project.data.site ? (
            <a href={project.data.site} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-mist no-underline hover:text-neon">
              Live site <ArrowIcon className="size-3.5" />
            </a>
          ) : null}
          <a href={project.data.githublink1} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-mist no-underline hover:text-neon">
            <GitHubIcon className="size-3.5" /> Code
          </a>
        </div>
      </div>
    </article>
  );
}

export function BlogRow({ blog, index }: Readonly<{ blog: ContentEntry<BlogMeta>; index: number }>) {
  return (
    <li className="border-b border-line/70 first:border-t">
      <Link
        to="/blogs/$slug"
        params={{ slug: blog.slug }}
        className="group flex items-start gap-4 px-1 py-5 no-underline transition-colors hover:bg-white/[0.02] sm:items-center sm:gap-6 sm:px-3"
      >
        <span className="pt-1.5 font-mono text-xs text-mist/70 sm:pt-0">{String(index + 1).padStart(2, "0")}</span>
        <span className="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <span className="font-display text-lg font-medium text-white transition-colors group-hover:text-neon sm:text-xl">
            {blog.data.title}
          </span>
          <span className="flex shrink-0 items-center gap-3 font-mono text-[0.7rem] tracking-wide text-mist uppercase">
            <span className="text-neon">{formatCategory(blog.data.category)}</span>
            <span>{readingTime(blog.body)} min read</span>
          </span>
        </span>
        <ArrowIcon className="mt-1.5 size-4 shrink-0 text-mist transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neon motion-reduce:transition-none sm:mt-0" />
      </Link>
    </li>
  );
}
