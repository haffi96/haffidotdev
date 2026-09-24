import { Link } from "@tanstack/react-router";
import { excerpt, readingTime, type BlogMeta, type ContentEntry } from "../lib/content";
import { ArrowIcon } from "./Icons";

export function PostRow({ post, index, showExcerpt = true }: Readonly<{ post: ContentEntry<BlogMeta>; index: number; showExcerpt?: boolean }>) {
  const summary = showExcerpt ? excerpt(post.body) : "";

  return (
    <Link
      to="/blogs/$slug"
      params={{ slug: post.slug }}
      className="group relative isolate grid grid-cols-[auto_1fr_auto] items-start gap-x-4 gap-y-1 border-t border-line py-6 no-underline sm:gap-x-8 sm:py-7"
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-[-0.75rem] inset-y-1 -z-10 origin-bottom scale-y-50 rounded-2xl bg-card opacity-0 shadow-sm transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-y-100 group-hover:opacity-100 sm:inset-x-[-1.25rem]"
      />
      <span className="pt-1 font-mono text-xs text-muted tabular-nums">{String(index + 1).padStart(2, "0")}</span>
      <span className="min-w-0">
        <span className="block text-lg leading-snug font-semibold tracking-tight text-fg transition-colors group-hover:text-accent-ink sm:text-xl">
          {post.data.title}
        </span>
        {summary ? <span className="mt-2 line-clamp-2 block text-[0.95rem] leading-relaxed text-muted">{summary}</span> : null}
        <span className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[0.7rem] text-muted uppercase">
          <span className="text-accent-ink">{post.data.category}</span>
          <span aria-hidden="true">·</span>
          <span>{readingTime(post.body)} min read</span>
        </span>
      </span>
      <span className="mt-1 grid size-9 place-items-center rounded-full border border-line text-soft transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:border-fg group-hover:bg-fg group-hover:text-bg">
        <ArrowIcon className="size-4 transition-transform duration-500 group-hover:-rotate-45" />
      </span>
    </Link>
  );
}
