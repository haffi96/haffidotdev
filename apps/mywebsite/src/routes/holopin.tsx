import { createFileRoute } from "@tanstack/react-router";
import { Page } from "../components/Page";
import { Window } from "../components/Window";

export const Route = createFileRoute("/holopin")({
  head: () => ({ meta: [{ title: "Holopin Board | Haffi Mazhar" }] }),
  component: HolopinPage
});

function HolopinPage() {
  return (
    <Page>
      <Window title="holopin-board.png" accent="purple" bodyClassName="p-4 sm:p-6">
        <h1 className="mb-4 text-2xl font-bold text-ink">Holopin board</h1>
        <a href="https://holopin.io/@haff96">
          <img className="mx-auto w-full max-w-3xl rounded-md border-[1.5px] border-line bg-white" src="https://holopin.me/haff96" alt="@haff96's Holopin board" />
        </a>
      </Window>
    </Page>
  );
}
