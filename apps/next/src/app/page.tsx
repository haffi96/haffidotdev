import { formatAppTitle, haffiDomain } from "@haffi/shared";

const app = {
  name: "next",
  url: `https://next.${haffiDomain}`,
  framework: "Next.js"
};

export default function Home() {
  return (
    <main className="page">
      <section className="card">
        <p className="eyebrow">{app.url}</p>
        <h1>{app.name}</h1>
        <p className="summary">
          {formatAppTitle(app)}. This starter is wired through the pnpm workspace and ready for Cloudflare Workers with OpenNext.
        </p>
        <div className="meta" aria-label="Stack details">
          <span className="pill">pnpm workspace</span>
          <span className="pill">Turborepo</span>
          <span className="pill">Cloudflare Workers</span>
        </div>
      </section>
    </main>
  );
}
