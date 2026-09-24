/** "( Typescript, NextJS, Stripe ) =>" becomes ["Typescript", "NextJS", "Stripe"]. */
export function parseTechstack(techstack: string | undefined) {
  if (!techstack) {
    return [];
  }
  return techstack
    .replace(/=>\s*$/, "")
    .replace(/^\s*\(|\)\s*$/g, "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function readingMinutes(body: string) {
  const words = body.replace(/```[\s\S]*?```/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export const categoryStyles: Record<string, { label: string; dot: string }> = {
  networking: { label: "Networking", dot: "bg-ph-blue" },
  database: { label: "Database", dot: "bg-ph-red" },
  general: { label: "General", dot: "bg-ph-yellow" }
};

export function categoryStyle(category: string) {
  return categoryStyles[category] ?? { label: category, dot: "bg-ph-purple" };
}
