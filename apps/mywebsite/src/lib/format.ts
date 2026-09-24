/** "( Typescript, NextJS, Stripe ) =>" -> ["Typescript", "NextJS", "Stripe"] */
export function parseTechstack(techstack: string) {
  return techstack
    .replace(/=>\s*$/, "")
    .replace(/[()]/g, "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function readingTime(body: string) {
  const words = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function formatCategory(category: string) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}
