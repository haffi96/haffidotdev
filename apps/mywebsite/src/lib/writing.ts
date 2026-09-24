import { blogs, visibleBlogs } from "./content";

const demoMode = import.meta.env.DEMO === "true";

/** Posts shown in listings (hidden drafts only appear in demo mode). */
export const listedBlogs = demoMode ? blogs : visibleBlogs;

export const categoryInfo: Record<string, { label: string; blurb: string }> = {
  general: { label: "Systems & fundamentals", blurb: "Data structures, concurrency, distributed systems and tooling." },
  networking: { label: "Networking", blurb: "How packets and requests find their way across the wire." },
  database: { label: "Databases", blurb: "Postgres techniques and data modelling notes." }
};

export function categoryLabel(category: string) {
  return categoryInfo[category]?.label ?? category.charAt(0).toUpperCase() + category.slice(1);
}

export function readingMinutes(body: string) {
  const words = body.replace(/```[\s\S]*?```/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
