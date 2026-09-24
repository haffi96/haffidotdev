import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Page } from "../components/Page";
import { BlogRow, Container, PageHeader } from "../components/ui";
import { blogs, categoryLabel, visibleBlogs } from "../lib/content";

const demoMode = import.meta.env.DEMO === "true";
const categoryOrder = ["networking", "database", "general"];

export const Route = createFileRoute("/blogs/")({
  head: () => ({ meta: [{ title: "Learning logs - Haffi Mazhar" }] }),
  component: BlogsPage
});

function BlogsPage() {
  const allBlogs = demoMode ? blogs : visibleBlogs;
  const [selected, setSelected] = useState<string | null>(null);

  const categories = [...new Set(allBlogs.map((blog) => blog.data.category))].sort(
    (a, b) => rank(a) - rank(b) || a.localeCompare(b)
  );
  const groups = categories
    .filter((category) => selected === null || category === selected)
    .map((category) => ({ category, entries: allBlogs.filter((blog) => blog.data.category === category) }));

  return (
    <Page>
      <Container narrow>
        <PageHeader eyebrow="~/blogs" title="Learning logs">
          <p>Notes on what I'm learning about: networking, databases and whatever else I'm poking at. Written mostly for future me.</p>
        </PageHeader>

        <div role="group" aria-label="Filter by category" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          <FilterButton active={selected === null} onClick={() => setSelected(null)}>
            all <span className="text-zinc-400">{allBlogs.length}</span>
          </FilterButton>
          {categories.map((category) => (
            <FilterButton
              key={category}
              active={selected === category}
              onClick={() => setSelected((current) => (current === category ? null : category))}
            >
              {categoryLabel(category).toLowerCase()}{" "}
              <span className="text-zinc-400">{allBlogs.filter((blog) => blog.data.category === category).length}</span>
            </FilterButton>
          ))}
        </div>

        <div className="mt-10 space-y-12">
          {groups.map((group) => (
            <section key={group.category} aria-labelledby={`cat-${group.category}`}>
              <h2
                id={`cat-${group.category}`}
                className="flex items-center gap-3 font-mono text-xs tracking-wide text-zinc-500 uppercase"
              >
                {categoryLabel(group.category)}
                <span aria-hidden className="h-px flex-1 bg-zinc-300 dark:bg-zinc-800" />
              </h2>
              <ul className="mt-3 divide-y divide-zinc-300/70 dark:divide-zinc-800/70">
                {group.entries.map((blog) => (
                  <BlogRow key={blog.slug} blog={blog} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Container>
    </Page>
  );
}

function rank(category: string) {
  const index = categoryOrder.indexOf(category);
  return index === -1 ? categoryOrder.length : index;
}

function FilterButton({ active, onClick, children }: Readonly<{ active: boolean; onClick: () => void; children: React.ReactNode }>) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`shrink-0 rounded-full border px-3 py-1 font-mono text-xs transition-colors ${
        active
          ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900"
          : "border-zinc-300 text-zinc-700 hover:border-zinc-500 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500"
      }`}
    >
      {children}
    </button>
  );
}
