import { createFileRoute } from "@tanstack/react-router";
import { Page } from "../components/Page";

export const Route = createFileRoute("/holopin")({
  head: () => ({ meta: [{ title: "Holopin Board" }] }),
  component: HolopinPage
});

function HolopinPage() {
  return (
    <Page className="pt-10 sm:pt-14">
      <p className="hud-label text-phos-500">Badges</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50">Holopin board</h1>
      <a href="https://holopin.io/@haff96" className="corners mt-8 block border border-line p-3">
        <img className="m-auto w-full bg-white" src="https://holopin.me/haff96" alt="@haff96's Holopin board" />
      </a>
    </Page>
  );
}
