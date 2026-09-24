import { HeadContent, Link, Scripts, createRootRoute } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { Page } from "../components/Page";
import { Container } from "../components/ui";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "description", content: "Haffi Mazhar - Senior Software Engineer building real-time systems, backend services and cloud infrastructure." },
      { title: "Haffi Mazhar" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
      }
    ]
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound
});

function RootDocument({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try { const stored = localStorage.getItem('theme'); const theme = stored === 'dark' || stored === 'light' ? stored : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); document.documentElement.classList.toggle('dark', theme === 'dark'); } catch (e) {} })();`
          }}
        />
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
    <Page>
      <Container className="py-24 text-center sm:py-32">
        <p className="font-mono text-sm text-amber-600 dark:text-amber-400">error 404</p>
        <h1 className="mt-4 font-mono text-6xl font-medium tracking-tight sm:text-7xl">:(</h1>
        <p className="mx-auto mt-6 max-w-md text-lg text-zinc-600 dark:text-zinc-400">
          Listen... I messed up. This page doesn't exist, or it moved somewhere I forgot about.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white no-underline hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Take me home
          </Link>
          <Link
            to="/blogs"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium no-underline hover:bg-white dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Read a blog
          </Link>
        </div>
      </Container>
    </Page>
  );
}
