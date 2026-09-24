import { Link } from "@tanstack/react-router";
import type { BlogMeta, ContentEntry } from "../lib/content";
import { readingMinutes } from "./Hud";

export function logId(entry: ContentEntry<BlogMeta>) {
  return `LOG-${String(entry.data.rank).padStart(3, "0")}`;
}

export function LogList({ entries }: Readonly<{ entries: ContentEntry<BlogMeta>[] }>) {
  return (
    <ul className="corners border border-line">
      {entries.map((entry) => (
        <li key={entry.slug} className="border-b border-line last:border-b-0">
          <Link
            to="/blogs/$slug"
            params={{ slug: entry.slug }}
            className="group grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-3 py-4 no-underline transition-colors hover:bg-ink-850 sm:grid-cols-[6.5rem_7rem_1fr_auto] sm:px-4"
          >
            <span className="col-span-2 flex gap-3 font-mono text-[11px] tracking-wider text-zinc-500 uppercase sm:col-span-1 sm:block">
              <span className="text-zinc-400">{logId(entry)}</span>
              <span className="sm:hidden">· {entry.data.category}</span>
            </span>
            <span className="hidden font-mono text-[11px] tracking-wider text-phos-500 uppercase sm:block">{entry.data.category}</span>
            <span className="min-w-0 text-[15px] font-medium text-zinc-100 group-hover:text-phos-200">{entry.data.title}</span>
            <span className="font-mono text-[11px] text-zinc-500 tabular-nums">
              {readingMinutes(entry.body)} min <span className="text-phos-500">→</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
