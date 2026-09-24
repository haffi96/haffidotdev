import { HeadContent, Link, Scripts, createRootRoute } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { ArrowLeft } from "../components/Icons";
import { Page } from "../components/Page";
import { Tile } from "../components/Tile";
import { profile } from "../lib/profile";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "description", content: profile.summary },
      { title: profile.name }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap"
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
            __html: `(() => { const stored = localStorage.getItem('theme'); const theme = stored || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); document.documentElement.classList.toggle('dark', theme === 'dark'); localStorage.setItem('theme', theme); })();`
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
      <div className="bento">
        <Tile className="flex min-h-[22rem] flex-col items-start justify-between gap-10 p-6 sm:p-10 md:col-span-2 lg:col-span-3">
          <p className="eyebrow">Error 404</p>
          <div>
            <p className="font-mono text-7xl font-medium tracking-tighter sm:text-9xl">
              <span className="gradient-text">404</span>
            </p>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">Listen... I messed up.</h1>
            <p className="mt-2 max-w-md text-fg-2">This page doesn't exist, or it moved somewhere lower latency.</p>
          </div>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft className="size-4" /> Back home
          </Link>
        </Tile>
        <div className="grid gap-3 md:col-span-2 md:grid-cols-2 md:gap-4 lg:col-span-1 lg:grid-cols-1">
          <Tile index={1} interactive className="flex flex-col justify-between gap-6 p-6">
            <Link to="/projects" className="stretched" aria-label="Projects" />
            <p className="eyebrow">Browse</p>
            <p className="text-xl font-semibold tracking-tight">Projects</p>
          </Tile>
          <Tile index={2} interactive className="flex flex-col justify-between gap-6 p-6">
            <Link to="/blogs" className="stretched" aria-label="Writing" />
            <p className="eyebrow">Read</p>
            <p className="text-xl font-semibold tracking-tight">Writing</p>
          </Tile>
        </div>
      </div>
    </Page>
  );
}
