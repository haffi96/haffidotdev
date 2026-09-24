import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, m } from "motion/react";
import { useState } from "react";
import { ease, spring } from "../components/motion/MotionProvider";
import { Page } from "../components/Page";
import { PageHeader } from "../components/PageHeader";
import { PostRow } from "../components/PostRow";
import { blogs, visibleBlogs } from "../lib/content";

const demoMode = import.meta.env.DEMO === "true";

export const Route = createFileRoute("/blogs/")({
  head: () => ({ meta: [{ title: "Learning logs · Haffi Mazhar" }] }),
  component: BlogsPage
});

function BlogsPage() {
  const allBlogs = demoMode ? blogs : visibleBlogs;
  const categories = ["all", ...Array.from(new Set(allBlogs.map((entry) => entry.data.category))).sort()];
  const [selected, setSelected] = useState("all");

  const filteredBlogs = allBlogs.filter((entry) => selected === "all" || entry.data.category === selected);

  return (
    <Page>
      <PageHeader eyebrow={`Learning logs · ${allBlogs.length} posts`} title="Notes on what I'm learning." emphasis={["learning."]}>
        Short write-ups on networking, databases and the fundamentals underneath the systems I work on.
      </PageHeader>

      <div className="shell">
        <div
          role="group"
          aria-label="Filter posts by category"
          className="fade-up inline-flex max-w-full gap-0.5 overflow-x-auto rounded-full border border-line bg-card p-1 [scrollbar-width:none] [animation-delay:0.45s]"
        >
          {categories.map((category) => {
            const active = selected === category;
            return (
              <button
                key={category}
                type="button"
                aria-pressed={active}
                onClick={() => setSelected(category)}
                className={`relative shrink-0 rounded-full px-3 py-1.5 text-sm sm:px-4 font-medium capitalize transition-colors duration-300 ${
                  active ? "text-bg" : "text-soft hover:text-fg"
                }`}
              >
                {active ? <m.span layoutId="blog-filter" className="absolute inset-0 rounded-full bg-fg" transition={spring} /> : null}
                <span className="relative">
                  {category}
                  <span className={`ml-1.5 font-mono text-[0.7rem] ${active ? "text-bg/60" : "text-muted"}`}>
                    {category === "all" ? allBlogs.length : allBlogs.filter((entry) => entry.data.category === category).length}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <m.ul layout className="mt-10 border-b border-line">
          <AnimatePresence initial={false} mode="popLayout">
            {filteredBlogs.map((entry, index) => (
              <m.li
                key={entry.slug}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
                transition={{ duration: 0.45, ease, layout: spring }}
              >
                <PostRow post={entry} index={index} />
              </m.li>
            ))}
          </AnimatePresence>
        </m.ul>
      </div>
    </Page>
  );
}
