import { Link } from "@tanstack/react-router";
import type { ReactNode, SVGProps } from "react";
import { type ContentEntry, type BlogMeta, type ProjectMeta, categoryLabel, getMediaUrl, parseTechstack, readingTime } from "../lib/content";

export function Container({
  children,
  className = "",
  narrow = false
}: Readonly<{ children: ReactNode; className?: string; narrow?: boolean }>) {
  return <div className={`mx-auto w-full px-5 sm:px-8 ${narrow ? "max-w-3xl" : "max-w-5xl"} ${className}`}>{children}</div>;
}

export function SectionHeading({
  index,
  title,
  action
}: Readonly<{ index: string; title: string; action?: ReactNode }>) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4 border-b border-zinc-300 pb-3 dark:border-zinc-800">
      <h2 className="flex items-baseline gap-3 text-xl font-semibold tracking-tight sm:text-2xl">
        <span className="font-mono text-xs font-normal text-amber-600 sm:text-sm dark:text-amber-400">{index}</span>
        {title}
      </h2>
      {action}
    </div>
  );
}

export function Chip({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <span className="inline-flex items-center rounded-md border border-zinc-300 bg-zinc-50 px-2 py-0.5 font-mono text-[11px] text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
      {children}
    </span>
  );
}

export function ArrowLink({ to, children }: Readonly<{ to: string; children: ReactNode }>) {
  const className =
    "group inline-flex shrink-0 items-center gap-1 font-mono text-xs text-zinc-600 no-underline hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white";
  const content = (
    <>
      {children}
      <span aria-hidden className="transition-transform motion-safe:group-hover:translate-x-0.5">
        -&gt;
      </span>
    </>
  );

  // Static files (like the resume PDF) are not router routes, so use a plain anchor for them.
  if (/\.[a-z0-9]+$/i.test(to)) {
    return (
      <a href={to} className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link to={to} className={className}>
      {content}
    </Link>
  );
}

export function ProjectCard({ project, headingLevel = "h3" }: Readonly<{ project: ContentEntry<ProjectMeta>; headingLevel?: "h2" | "h3" }>) {
  const Heading = headingLevel;
  const preview = getMediaUrl(project.data.preview);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-zinc-300 bg-white transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600">
      <div className="aspect-[16/10] overflow-hidden border-b border-zinc-200 bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-800">
        {preview ? (
          <img
            src={preview}
            alt={`${project.data.title} preview`}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-500 motion-safe:group-hover:scale-[1.02]"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <Heading className="text-base font-semibold leading-snug tracking-tight">
          <Link
            to="/projects/$slug"
            params={{ slug: project.slug }}
            className="no-underline after:absolute after:inset-0 after:content-[''] hover:underline"
          >
            {project.data.title}
          </Link>
        </Heading>
        <div className="flex flex-wrap gap-1.5">
          {parseTechstack(project.data.techstack).map((tech) => (
            <Chip key={tech}>{tech}</Chip>
          ))}
        </div>
        <div className="relative z-10 mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-2 font-mono text-xs">
          {project.data.site ? <ExternalLink href={project.data.site}>live site</ExternalLink> : null}
          <ExternalLink href={project.data.githublink1}>source</ExternalLink>
          {project.data.githublink2 ? <ExternalLink href={project.data.githublink2}>api source</ExternalLink> : null}
        </div>
      </div>
    </article>
  );
}

export function ExternalLink({ href, children }: Readonly<{ href: string; children: ReactNode }>) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-zinc-600 underline decoration-zinc-400 hover:text-zinc-950 hover:decoration-amber-500 dark:text-zinc-400 dark:decoration-zinc-600 dark:hover:text-white"
    >
      {children}
      <span aria-hidden>↗</span>
    </a>
  );
}

export function BlogRow({ blog, showCategory = false }: Readonly<{ blog: ContentEntry<BlogMeta>; showCategory?: boolean }>) {
  return (
    <li>
      <Link
        to="/blogs/$slug"
        params={{ slug: blog.slug }}
        className="group -mx-3 flex items-center justify-between gap-4 rounded-lg px-3 py-3 no-underline transition-colors hover:bg-white dark:hover:bg-zinc-900"
      >
        <span className="min-w-0">
          <span className="block font-medium leading-snug group-hover:underline">{blog.data.title}</span>
          <span className="mt-1 block font-mono text-xs text-zinc-500">
            {showCategory ? `${categoryLabel(blog.data.category).toLowerCase()} · ` : ""}
            {readingTime(blog.body)} min read
          </span>
        </span>
        <span
          aria-hidden
          className="shrink-0 font-mono text-sm text-zinc-400 transition-transform group-hover:text-amber-600 motion-safe:group-hover:translate-x-0.5 dark:group-hover:text-amber-400"
        >
          -&gt;
        </span>
      </Link>
    </li>
  );
}

export function PageHeader({ eyebrow, title, children }: Readonly<{ eyebrow: string; title: string; children?: ReactNode }>) {
  return (
    <header className="pt-12 pb-10 sm:pt-16">
      <p className="font-mono text-xs text-amber-600 dark:text-amber-400">{eyebrow}</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      {children ? <div className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">{children}</div> : null}
    </header>
  );
}

type IconProps = SVGProps<SVGSVGElement>;

export function GitHubIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden {...props}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

export function LinkedInIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden {...props}>
      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export function FileIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </svg>
  );
}
