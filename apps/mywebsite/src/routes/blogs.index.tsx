import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Page } from "../components/Page";
import { blogs, visibleBlogs } from "../lib/content";

const demoMode = import.meta.env.DEMO === "true";

export const Route = createFileRoute("/blogs/")({
  head: () => ({ meta: [{ title: "Learning logs" }] }),
  component: BlogsPage
});

function BlogsPage() {
  const allBlogs = demoMode ? blogs : visibleBlogs;
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

  return (
    <Page>
      <div className="my-2 p-10 text-center">
        <h2 className="text-lg font-bold italic">What I'm learning about</h2>
        <div className="mt-5 flex flex-wrap justify-center gap-5">
          <Checkbox
            label="Networking"
            value={selectedCategories.has("networking")}
            onChange={() => toggleCategory("networking")}
          />
          <Checkbox
            label="Database"
            value={selectedCategories.has("database")}
            onChange={() => toggleCategory("database")}
          />
          <button className="bg-zinc-500 p-1 hover:bg-zinc-700" type="button" onClick={() => setSelectedCategories(new Set())}>
            Clear?
          </button>
        </div>
        <ul className="pt-10">
          {filteredBlogs.map((entry) => (
            <li className="list-none p-2 underline text-black dark:text-zinc-300" key={entry.slug}>
              <a href={`/blogs/${entry.slug}`}>{entry.data.title}</a>
            </li>
          ))}
        </ul>
      </div>
    </Page>
  );
}

function Checkbox({ label, value, onChange }: Readonly<{ label: string; value: boolean; onChange: () => void }>) {
  return (
    <label>
      <input type="checkbox" checked={value} onChange={onChange} /> {label}
    </label>
  );
}
