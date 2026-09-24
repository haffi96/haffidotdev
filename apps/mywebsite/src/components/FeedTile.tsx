import { Link } from "@tanstack/react-router";
import { getMediaUrl, type ContentEntry, type ProjectMeta } from "../lib/content";
import { Chip, parseTechstack } from "./Hud";

export function FeedTile({ project, index }: Readonly<{ project: ContentEntry<ProjectMeta>; index: number }>) {
  const camId = `CAM ${String(index + 1).padStart(2, "0")}`;
  const tags = parseTechstack(project.data.techstack);

  return (
    <article className="corners group flex min-w-0 flex-col border border-line transition-colors hover:border-line-strong">
      <Link to="/projects/$slug" params={{ slug: project.slug }} className="block no-underline" aria-label={project.data.title}>
        <div className="relative aspect-video overflow-hidden border-b border-line bg-ink-900">
          <img
            src={getMediaUrl(project.data.preview)}
            alt=""
            loading="lazy"
            decoding="async"
            className="size-full object-cover object-top opacity-85 saturate-[0.85] transition duration-300 group-hover:opacity-100 group-hover:saturate-100 motion-reduce:transition-none"
          />
          <div aria-hidden="true" className="scanlines pointer-events-none absolute inset-0 opacity-60" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-2 font-mono text-[10px] tracking-wider text-phos-200 uppercase">
            <span className="bg-ink-950/75 px-1.5 py-0.5">{camId}</span>
            <span className="flex items-center gap-1.5 bg-ink-950/75 px-1.5 py-0.5 text-zinc-300">
              <span className="size-1.5 rounded-full bg-alert" /> Feed
            </span>
          </div>
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base leading-snug font-semibold text-zinc-50">
          <Link to="/projects/$slug" params={{ slug: project.slug }} className="no-underline hover:text-phos">
            {project.data.title}
          </Link>
        </h3>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Chip key={tag}>{tag}</Chip>
          ))}
        </div>
        <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-4 font-mono text-[11px] tracking-wider uppercase">
          <Link to="/projects/$slug" params={{ slug: project.slug }} className="text-phos no-underline hover:text-phos-200">
            Open feed →
          </Link>
          {project.data.site ? (
            <a href={project.data.site} target="_blank" rel="noreferrer" className="text-zinc-400 no-underline hover:text-zinc-100">
              Live ↗
            </a>
          ) : null}
          <a href={project.data.githublink1} target="_blank" rel="noreferrer" className="text-zinc-400 no-underline hover:text-zinc-100">
            Repo ↗
          </a>
        </div>
      </div>
    </article>
  );
}
