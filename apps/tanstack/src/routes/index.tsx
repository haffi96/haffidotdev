import { formatAppTitle, haffiDomain } from "@haffi/shared";
import { createFileRoute } from "@tanstack/react-router";

const app = {
  name: "tanstack",
  url: `https://tanstack.${haffiDomain}`,
  framework: "TanStack Start"
};

export const Route = createFileRoute("/")({
  component: Home
});

function Home() {
  return (
    <main className="page">
      <section className="panel">
        <p className="eyebrow">{app.url}</p>
        <h1>{app.name}</h1>
        <p className="summary">
          {formatAppTitle(app)}. This starter is wired through the pnpm workspace and ready for Cloudflare Workers.
        </p>
        <div className="meta" aria-label="Stack details">
          <span>pnpm workspace</span>
          <span>Turborepo</span>
          <span>Cloudflare Workers</span>
        </div>
      </section>
    </main>
  );
}
