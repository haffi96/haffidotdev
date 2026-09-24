import { createFileRoute } from "@tanstack/react-router";
import { Page } from "../components/Page";
import { PageHeader } from "../components/PageHeader";

export const Route = createFileRoute("/holopin")({
  head: () => ({ meta: [{ title: "Holopin Board · Haffi Mazhar" }] }),
  component: HolopinPage
});

function HolopinPage() {
  return (
    <Page>
      <PageHeader eyebrow="Holopin" title="Badge board." emphasis={["board."]} />
      <div className="shell">
        <a href="https://holopin.io/@haff96" className="block overflow-hidden rounded-[2rem] border border-line bg-white p-3">
          <img className="mx-auto w-full" src="https://holopin.me/haff96" alt="@haff96's Holopin board" />
        </a>
      </div>
    </Page>
  );
}
