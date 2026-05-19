import { formatAppTitle, haffiDomain } from "@haffi/shared";

const app = {
  name: "next",
  url: `https://next.${haffiDomain}`,
  framework: "Next.js"
};

export default function Home() {
  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,rgba(68,176,255,0.32),transparent_34rem),linear-gradient(135deg,#07111f,#111827_52%,#06141c)] p-8">
      <section className="w-full max-w-[760px] rounded-[28px] border border-[rgba(236,247,255,0.16)] bg-[rgba(7,17,31,0.72)] p-[clamp(28px,7vw,64px)] shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-[18px]">
        <p className="mb-[18px] text-[0.82rem] font-bold tracking-[0.14em] text-[#7dd3fc] uppercase">{app.url}</p>
        <h1 className="m-0 text-[clamp(3rem,9vw,6rem)] leading-[0.9] tracking-[-0.07em]">{app.name}</h1>
        <p className="mt-7 max-w-[58ch] text-[clamp(1rem,3vw,1.25rem)] leading-[1.7] text-[#b9d8ea]">
          {formatAppTitle(app)}. This starter is wired through the pnpm workspace and ready for Cloudflare Workers with OpenNext.
        </p>
        <div className="mt-[34px] flex flex-wrap gap-3" aria-label="Stack details">
          <span className="rounded-full border border-[rgba(125,211,252,0.36)] px-[14px] py-[9px] text-[#d8f2ff]">pnpm workspace</span>
          <span className="rounded-full border border-[rgba(125,211,252,0.36)] px-[14px] py-[9px] text-[#d8f2ff]">Turborepo</span>
          <span className="rounded-full border border-[rgba(125,211,252,0.36)] px-[14px] py-[9px] text-[#d8f2ff]">Cloudflare Workers</span>
        </div>
      </section>
    </main>
  );
}
