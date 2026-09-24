import { HeadContent, Link, Scripts, createRootRoute } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { ArrowIcon } from "../components/Icons";
import { MotionProvider } from "../components/motion/MotionProvider";
import { Page } from "../components/Page";
import { Window } from "../components/Window";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "description", content: "Haffi Mazhar, Senior Software Engineer building low-latency, real-time systems." },
      { name: "theme-color", content: "#eeefe9" },
      { title: "Haffi Mazhar" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap"
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
            __html: `(() => { let stored = null; try { stored = localStorage.getItem('theme'); } catch (e) {} const theme = stored === 'dark' || stored === 'light' ? stored : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); document.documentElement.classList.toggle('dark', theme === 'dark'); })();`
          }}
        />
        <HeadContent />
      </head>
      <body>
        <MotionProvider>{children}</MotionProvider>
        <Scripts />
      </body>
    </html>
  );
}

function NotFound() {
  return (
    <Page>
      <div className="flex justify-center py-6 sm:py-12">
        <Window title="404.exe has stopped responding" accent="red" className="animate-window-pop w-full max-w-xl" bodyClassName="p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className="flex size-12 shrink-0 items-center justify-center rounded-md border-[1.5px] border-edge bg-ph-yellow font-mono text-2xl font-bold text-[#151515]"
            >
              !
            </span>
            <div className="min-w-0">
              <p className="font-mono text-xs font-semibold tracking-wider text-ph-red uppercase">Error 404</p>
              <h1 className="mt-1 text-2xl leading-tight font-bold text-ink sm:text-3xl">Listen... I messed up. This page doesn't exist.</h1>
              <p className="mt-3 text-body">
                I've spent years making sure requests arrive in under 200ms. This one arrived quickly too, just at the wrong address.
              </p>
            </div>
          </div>
          <div className="mt-7 flex flex-wrap justify-end gap-3">
            <Link to="/blogs" className="btn-3d btn-plain">
              Read the blog
            </Link>
            <Link to="/" className="btn-3d btn-orange">
              Take me home <ArrowIcon />
            </Link>
          </div>
        </Window>
      </div>
    </Page>
  );
}
