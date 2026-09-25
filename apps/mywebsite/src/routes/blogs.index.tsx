import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PostRow } from "../components/Cards";
import { Page } from "../components/Page";
import { SectionHeading } from "../components/SectionHeading";
import { Window } from "../components/Window";
import { blogs, visibleBlogs } from "../lib/content";
import { categoryStyle } from "../lib/format";

const demoMode = import.meta.env.DEMO === "true";

export const Route = createFileRoute("/blogs/")({
  head: () => ({ meta: [{ title: "Learning logs | Haffi Mazhar" }] }),
  component: BlogsPage
});

function BlogsPage() {
  const allBlogs = demoMode ? blogs : visibleBlogs;
  const [selectedCategories, setSelectedCategories] = useState(new Set<string>());

  const categories = Array.from(new Set(allBlogs.map((entry) => entry.data.category))).sort();
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

  return (
    <Page>
      <Window title="~/learning-logs" accent="purple" className="animate-window-pop" bodyClassName="p-0" labelledBy="blogs-heading">
        <div className="p-5 sm:p-8">
          <SectionHeading
            id="blogs-heading"
            level={1}
            kicker="Learning logs"
            title="What I'm learning about"
            blurb="Networking, databases and the occasional rabbit hole. Written mostly so future me can stop re-googling the OSI model."
          />
        </div>
        <div className="grid border-t-[1.5px] border-edge md:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="border-b-[1.5px] border-edge bg-desk-2 p-4 md:border-r-[1.5px] md:border-b-0" aria-label="Filter posts">
            <fieldset>
              <legend className="font-mono text-xs font-semibold tracking-wider text-muted uppercase">Filter by topic</legend>
              <div className="mt-3 flex flex-wrap gap-2 md:flex-col">
                {categories.map((category) => {
                  const style = categoryStyle(category);
                  const checked = selectedCategories.has(category);
                  const count = allBlogs.filter((entry) => entry.data.category === category).length;
                  return (
                    <label
                      key={category}
                      className={`flex cursor-pointer items-center gap-2 rounded-md border-[1.5px] px-3 py-1.5 text-sm font-semibold transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-hm-blue ${
                        checked ? "border-edge bg-window text-ink shadow-[0_2px_0_0_var(--hm-edge)]" : "border-transparent text-body hover:bg-chrome"
                      }`}
                    >
                      <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggleCategory(category)} />
                      <span
                        aria-hidden="true"
                        className={`flex size-4 items-center justify-center rounded-sm border-[1.5px] border-edge ${checked ? style.dot : "bg-window"}`}
                      >
                        {checked ? (
                          <svg className="size-3 text-[#151515]" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m2.5 6 2.5 2.5 4.5-5" />
                          </svg>
                        ) : null}
                      </span>
                      {style.label}
                      <span className="ml-auto font-mono text-xs text-muted">{count}</span>
                    </label>
                  );
                })}
              </div>
              {selectedCategories.size > 0 ? (
                <button type="button" className="btn-3d btn-plain mt-4 px-3 py-1 text-xs" onClick={() => setSelectedCategories(new Set())}>
                  Clear filters
                </button>
              ) : null}
            </fieldset>
          </aside>
          <div className="min-w-0">
            <p className="border-b-[1.5px] border-dashed border-line px-4 py-2 font-mono text-xs text-muted" aria-live="polite">
              {filteredBlogs.length} {filteredBlogs.length === 1 ? "post" : "posts"}
              {selectedCategories.size > 0 ? " (filtered)" : ""}
            </p>
            {filteredBlogs.length > 0 ? (
              <ul className="divide-y-[1.5px] divide-dashed divide-line">
                {filteredBlogs.map((entry) => (
                  <PostRow key={entry.slug} post={entry} />
                ))}
              </ul>
            ) : (
              <p className="p-6 text-muted">Nothing here yet. Clearly I need to learn more things.</p>
            )}
          </div>
        </div>
      </Window>
    </Page>
  );
}
