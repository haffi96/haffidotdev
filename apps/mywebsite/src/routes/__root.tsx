import { HeadContent, Link, Scripts, createRootRoute } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { ArrowLeftIcon } from "../components/Icons";
import { Page } from "../components/Page";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        name: "description",
        content: "Haffi Mazhar, Senior Software Engineer building low-latency, real-time systems for autonomous vehicle teleoperation."
      },
      { name: "theme-color", content: "#04060b" },
      { title: "Haffi Mazhar" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@500;600;700&display=swap"
      }
    ]
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound
});

function RootDocument({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function NotFound() {
  return (
    <Page backdrop="ambient">
      <section className="mx-auto flex min-h-[80svh] max-w-3xl flex-col items-start justify-center px-5 pt-28 pb-16 sm:px-8">
        <p className="eyebrow">Error 404 · packet lost</p>
        <h1 className="mt-4 font-display text-6xl font-semibold tracking-tight text-white text-glow sm:text-8xl">404</h1>
        <p className="mt-5 max-w-lg text-lg text-mist">
          Listen... I messed up. This route dropped somewhere between the client and the server, and no retry is going to
          bring it back.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-neon px-5 py-2.5 text-sm font-semibold text-void no-underline transition hover:bg-white"
          >
            <ArrowLeftIcon /> Back to home
          </Link>
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-haze no-underline transition hover:border-neon/60 hover:text-white"
          >
            Read the blog
          </Link>
        </div>
      </section>
    </Page>
  );
}
