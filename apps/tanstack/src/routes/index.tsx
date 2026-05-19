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
    <main className="grid min-h-screen place-items-center bg-[#f8efe0] bg-[linear-gradient(90deg,rgba(32,23,16,0.08)_1px,transparent_1px),linear-gradient(rgba(32,23,16,0.08)_1px,transparent_1px)] bg-[length:38px_38px] p-8">
      <section className="w-full max-w-[820px] rounded-lg border-2 border-[#201710] bg-[#fff9ed] p-[clamp(28px,7vw,68px)] shadow-[14px_14px_0_#201710]">
        <p className="mb-[18px] font-mono text-[0.82rem] font-extrabold tracking-[0.12em] uppercase">{app.url}</p>
        <h1 className="m-0 text-[clamp(3.2rem,11vw,7.5rem)] leading-[0.85] tracking-[-0.08em]">{app.name}</h1>
        <p className="mt-[30px] max-w-[56ch] text-[clamp(1.1rem,3vw,1.45rem)] leading-[1.55]">
          {formatAppTitle(app)}. This starter is wired through the pnpm workspace and ready for Cloudflare Workers.
        </p>
        <div className="mt-[34px] flex flex-wrap gap-2.5" aria-label="Stack details">
          <span className="rounded-full border-2 border-[#201710] px-[13px] py-2 font-mono text-[0.86rem]">pnpm workspace</span>
          <span className="rounded-full border-2 border-[#201710] px-[13px] py-2 font-mono text-[0.86rem]">Turborepo</span>
          <span className="rounded-full border-2 border-[#201710] px-[13px] py-2 font-mono text-[0.86rem]">Cloudflare Workers</span>
        </div>
      </section>
    </main>
  );
}
