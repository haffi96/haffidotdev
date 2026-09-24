import { createFileRoute } from "@tanstack/react-router";
import { Page } from "../components/Page";
import { Container, PageHeader } from "../components/ui";

export const Route = createFileRoute("/holopin")({
  head: () => ({ meta: [{ title: "Holopin Board - Haffi Mazhar" }] }),
  component: HolopinPage
});

function HolopinPage() {
  return (
    <Page>
      <Container>
        <PageHeader eyebrow="~/holopin" title="Holopin board" />
        <a href="https://holopin.io/@haff96" className="block overflow-hidden rounded-xl border border-zinc-300 bg-white p-2 dark:border-zinc-800">
          <img className="m-auto w-full" src="https://holopin.me/haff96" alt="@haff96's Holopin board" />
        </a>
      </Container>
    </Page>
  );
}
