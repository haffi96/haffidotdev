import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BlogRow } from "../components/Cards";
import { Page, PageHeader } from "../components/Page";
import { blogs, visibleBlogs } from "../lib/content";
import { formatCategory } from "../lib/format";

const demoMode = import.meta.env.DEMO === "true";

export const Route = createFileRoute("/blogs/")({
  head: () => ({ meta: [{ title: "Learning logs | Haffi Mazhar" }] }),
  component: BlogsPage
});

function BlogsPage() {
  const allBlogs = demoMode ? blogs : visibleBlogs;
  const categories = [...new Set(allBlogs.map((entry) => entry.data.category))].sort();
  const [selectedCategories, setSelectedCategories] = useState(new Set<string>());

  const filteredBlogs = allBlogs.filter((entry) => selectedCategories.size === 0 || selectedCategories.has(entry.data.category));

  function toggleCategory(category: string) {
    setSelectedCategories((current) => {
      const next = new Set(current);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }

  const pill = (active: boolean) =>
    `rounded-full border px-3.5 py-1.5 font-mono text-xs tracking-wide uppercase transition-colors ${
      active ? "border-neon bg-neon/15 text-neon" : "border-line bg-ink/70 text-mist hover:border-neon/50 hover:text-white"
    }`;

  return (
    <Page backdrop="ambient">
      <PageHeader eyebrow="Learning logs" title="What I'm learning about">
        <p>Notes on networking, databases and the systems underneath the software I work on.</p>
      </PageHeader>
      <div className="mx-auto max-w-4xl px-5 pb-24 sm:px-8">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by category">
          <button type="button" className={pill(selectedCategories.size === 0)} aria-pressed={selectedCategories.size === 0} onClick={() => setSelectedCategories(new Set())}>
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={pill(selectedCategories.has(category))}
              aria-pressed={selectedCategories.has(category)}
              onClick={() => toggleCategory(category)}
            >
              {formatCategory(category)}
            </button>
          ))}
          <span className="ml-auto font-mono text-xs text-mist">
            {filteredBlogs.length} {filteredBlogs.length === 1 ? "post" : "posts"}
          </span>
        </div>
        <ol className="panel mt-6 px-4 py-2 sm:px-6">
          {filteredBlogs.map((entry, index) => (
            <BlogRow key={entry.slug} blog={entry} index={index} />
          ))}
        </ol>
      </div>
    </Page>
  );
}
