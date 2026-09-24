import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LogList } from "../components/LogList";
import { Page } from "../components/Page";
import { blogs, visibleBlogs } from "../lib/content";

const demoMode = import.meta.env.DEMO === "true";

export const Route = createFileRoute("/blogs/")({
  head: () => ({ meta: [{ title: "Logs · Haffi Mazhar" }] }),
  component: BlogsPage
});

function BlogsPage() {
  const allBlogs = demoMode ? blogs : visibleBlogs;
  const categories = Array.from(new Set(allBlogs.map((entry) => entry.data.category))).sort();
  const [selectedCategories, setSelectedCategories] = useState(new Set<string>());

  const filteredBlogs = allBlogs.filter((entry) => {
    if (selectedCategories.size === 0) {
      return true;
    }
    return selectedCategories.has(entry.data.category);
  });

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

  const filterClass = (active: boolean) =>
    `px-3 py-1.5 font-mono text-[11px] tracking-wider uppercase transition-colors border ${
      active ? "border-phos bg-phos text-ink-950" : "border-line-strong text-zinc-400 hover:border-zinc-500 hover:text-zinc-100"
    }`;

  return (
    <Page className="pt-10 sm:pt-14">
      <header className="border-b border-line pb-8">
        <p className="hud-label text-phos-500">
          <span className="text-zinc-600">[02]</span> Logs · {allBlogs.length} entries
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">What I'm learning about</h1>
        <p className="mt-3 max-w-2xl text-zinc-400">
          Field notes on networking, databases and the systems underneath the software. Written to understand, kept to
          remember.
        </p>
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-2" role="group" aria-label="Filter by category">
        <span className="hud-label mr-2">Filter</span>
        <button type="button" aria-pressed={selectedCategories.size === 0} className={filterClass(selectedCategories.size === 0)} onClick={() => setSelectedCategories(new Set())}>
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            aria-pressed={selectedCategories.has(category)}
            className={filterClass(selectedCategories.has(category))}
            onClick={() => toggleCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {filteredBlogs.length > 0 ? (
          <LogList entries={filteredBlogs} />
        ) : (
          <p className="corners border border-line p-6 font-mono text-sm text-zinc-500">No log entries match this filter.</p>
        )}
      </div>
    </Page>
  );
}
