import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "../components/Icons";
import { Page } from "../components/Page";
import { PageHeader } from "../components/PageHeader";
import { Tile } from "../components/Tile";
import { categoryInfo, categoryLabel, listedBlogs, readingMinutes } from "../lib/writing";

export const Route = createFileRoute("/blogs/")({
  head: () => ({ meta: [{ title: "Writing · Haffi Mazhar" }] }),
  component: BlogsPage
});

function BlogsPage() {
  const groups = Object.entries(
    listedBlogs.reduce<Record<string, typeof listedBlogs>>((acc, entry) => {
      (acc[entry.data.category] ??= []).push(entry);
      return acc;
    }, {})
  ).sort((a, b) => b[1].length - a[1].length);

  return (
    <Page>
      <div className="bento">
        <PageHeader
          eyebrow={`Writing · ${listedBlogs.length} posts`}
          title="Learning logs"
          aside={
            <div className="flex flex-wrap gap-1.5">
              {groups.map(([category, entries]) => (
                <a key={category} href={`#${category}`} className="chip no-underline">
                  {categoryLabel(category)} <span className="ml-1.5 text-muted">{entries.length}</span>
                </a>
              ))}
            </div>
          }
        >
          Notes I write while learning: networking, databases and the fundamentals behind the systems I work on.
        </PageHeader>

        {groups.map(([category, entries], index) => (
          <Tile
            key={category}
            as="section"
            index={index + 1}
            className={`scroll-mt-24 p-6 sm:p-7 md:col-span-2 ${index === 0 ? "lg:row-span-2" : ""}`}
          >
            <div id={category} className="absolute -top-24" aria-hidden="true" />
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">{categoryLabel(category)}</h2>
                {categoryInfo[category] ? <p className="mt-1 text-sm text-muted">{categoryInfo[category].blurb}</p> : null}
              </div>
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent-soft font-mono text-xs font-medium text-accent">
                {entries.length}
              </span>
            </div>
            <ul className="divide-y divide-line">
              {entries.map((entry) => (
                <li key={entry.slug}>
                  <Link
                    to="/blogs/$slug"
                    params={{ slug: entry.slug }}
                    className="group -mx-2 flex items-center justify-between gap-4 rounded-xl px-2 py-3.5 no-underline transition-colors hover:bg-tile-2"
                  >
                    <span className="min-w-0">
                      <span className="block font-medium tracking-tight">{entry.data.title}</span>
                      <span className="mt-0.5 block text-xs text-muted">{readingMinutes(entry.body)} min read</span>
                    </span>
                    <ArrowUpRight className="nudge size-4 shrink-0 text-muted group-hover:text-accent" />
                  </Link>
                </li>
              ))}
            </ul>
          </Tile>
        ))}
      </div>
    </Page>
  );
}
