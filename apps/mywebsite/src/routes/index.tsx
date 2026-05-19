import { createFileRoute } from "@tanstack/react-router";
import { Page } from "../components/Page";
import avatarUrl from "../media/avatar.png?url";
import holopinUrl from "../media/holopin.png?url";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Haffi Mazhar - Software Developer" }] }),
  component: Home
});

function Home() {
  return (
    <Page>
      <header>
        <div className="m-auto flex w-full max-w-2xl flex-col items-center space-y-2 px-5 pt-5 text-center md:w-1/2">
          <img src={avatarUrl} alt="avatar.png" className="h-[8.75rem] w-40 rounded-full object-cover" />
          <h1 className="text-xl md:text-3xl">Haffi Mazhar :)</h1>
          <div>haffimazhar96@gmail.com</div>
          <div>07445980261</div>
          <div className="m-auto py-10 text-left text-lg">
            <p>
              Hey, I'm Haffi. I'm a software developer with professional experience in backend and a personal interest in
              frontend.
              <br />
              <br />
              I'm passionate about all things software. Love being able to solve complex problems while getting a deep
              understanding of the tools that I work with.
            </p>
          </div>
        </div>
        <div className="my-2">
          <a href="https://holopin.me/haff96">
            <img src={holopinUrl} alt="https://holopin.me/haff96" className="m-auto flex w-2/3 rounded-xl bg-white" />
          </a>
        </div>
      </header>
    </Page>
  );
}
