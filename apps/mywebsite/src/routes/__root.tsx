import { HeadContent, Link, Scripts, createRootRoute } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { Footer } from "../components/Footer";
import { ArrowIcon } from "../components/Icons";
import { MotionProvider } from "../components/motion/MotionProvider";
import { SplitText } from "../components/motion/SplitText";
import { Nav } from "../components/Nav";
import { Page } from "../components/Page";
import { RouteTransition } from "../components/RouteTransition";
import { profile } from "../lib/profile";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "description", content: `${profile.name}, ${profile.title}. ${profile.summary}` },
      { name: "theme-color", content: "#f7f6f2", media: "(prefers-color-scheme: light)" },
      { name: "theme-color", content: "#0c0c0e", media: "(prefers-color-scheme: dark)" },
      { title: `${profile.name} · ${profile.title}` }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400..800&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap"
      }
    ]
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound
});

const themeScript = `(() => { try { const stored = localStorage.getItem('theme'); const theme = stored === 'dark' || stored === 'light' ? stored : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); document.documentElement.classList.toggle('dark', theme === 'dark'); } catch (_) {} })();`;

function RootDocument({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <HeadContent />
      </head>
      <body>
        <MotionProvider>
          <a
            href="#content"
            className="sr-only z-[70] rounded-full bg-fg px-4 py-2 text-sm text-bg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
          >
            Skip to content
          </a>
          <Nav />
          <div id="content">
            <RouteTransition>{children}</RouteTransition>
          </div>
          <Footer />
        </MotionProvider>
        <Scripts />
      </body>
    </html>
  );
}

function NotFound() {
  return (
    <Page className="shell flex min-h-[60vh] flex-col items-start justify-center pt-20 sm:pt-28">
      <p className="eyebrow fade-up">Error 404</p>
      <h1 className="mt-5 text-[clamp(5rem,22vw,13rem)] leading-[0.85] font-semibold tracking-[-0.06em]">
        <SplitText text="4 0 4" stagger={0.09} emphasis={["0"]} />
      </h1>
      <p className="fade-up mt-8 max-w-md text-lg text-soft [animation-delay:0.35s]">
        Listen... I messed up. This page doesn't exist, or it moved somewhere faster.
      </p>
      <Link
        to="/"
        className="fade-up group mt-8 inline-flex items-center gap-2 rounded-full bg-fg px-5 py-3 text-sm font-medium text-bg no-underline [animation-delay:0.45s]"
      >
        Take me home
        <ArrowIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </Page>
  );
}
