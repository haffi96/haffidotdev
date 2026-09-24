import { createFileRoute } from "@tanstack/react-router";
import { Page, PageHeader } from "../components/Page";

export const Route = createFileRoute("/holopin")({
  head: () => ({ meta: [{ title: "Holopin Board | Haffi Mazhar" }] }),
  component: HolopinPage
});

function HolopinPage() {
  return (
    <Page>
      <PageHeader eyebrow="Badges" title="Holopin board" />
      <div className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        <a href="https://holopin.io/@haff96" className="panel block p-3">
          <img className="m-auto w-full rounded-xl bg-white" src="https://holopin.me/haff96" alt="@haff96's Holopin board" />
        </a>
      </div>
    </Page>
  );
}
