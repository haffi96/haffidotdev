import { createFileRoute } from "@tanstack/react-router";
import { Page } from "../components/Page";

export const Route = createFileRoute("/holopin")({
  head: () => ({ meta: [{ title: "Holopin Board" }] }),
  component: HolopinPage
});

function HolopinPage() {
  return (
    <Page className="px-5 pt-10 text-center">
      <a href="https://holopin.io/@haff96">
        <img className="m-auto rounded-xl bg-white" src="https://holopin.me/haff96" alt="@haff96's Holopin board" />
      </a>
    </Page>
  );
}
