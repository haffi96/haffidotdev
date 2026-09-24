import { createFileRoute } from "@tanstack/react-router";
import { Page } from "../components/Page";
import { Tile } from "../components/Tile";

export const Route = createFileRoute("/holopin")({
  head: () => ({ meta: [{ title: "Holopin Board · Haffi Mazhar" }] }),
  component: HolopinPage
});

function HolopinPage() {
  return (
    <Page>
      <Tile className="p-2">
        <a href="https://holopin.io/@haff96" aria-label="@haff96's Holopin board">
          <img className="w-full rounded-[1.1rem] bg-white" src="https://holopin.me/haff96" alt="@haff96's Holopin board" />
        </a>
      </Tile>
    </Page>
  );
}
