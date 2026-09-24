import { HeadContent, Link, Scripts, createRootRoute } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { Page } from "../components/Page";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        name: "description",
        content: "Haffi Mazhar, senior software engineer building low-latency WebRTC teleoperation for autonomous vehicles."
      },
      { name: "theme-color", content: "#060809" },
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
    <html lang="en">
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
    <Page className="grid place-items-center py-16 sm:py-24">
      <div className="corners w-full max-w-xl border border-line">
        <div className="flex items-center justify-between border-b border-line px-3 py-2 sm:px-4">
          <span className="hud-label text-zinc-400">Cam_unknown · 404</span>
          <span className="hud-label flex items-center gap-1.5 text-amber">
            <span className="size-1.5 rounded-full bg-amber" /> No carrier
          </span>
        </div>
        <div className="relative grid aspect-[16/9] place-items-center overflow-hidden bg-ink-900">
          <div
            aria-hidden="true"
            className="animate-static absolute -inset-[10%] opacity-20 [background-image:repeating-radial-gradient(circle_at_17%_32%,#5cf2a0_0_1px,transparent_1px_3px),repeating-radial-gradient(circle_at_73%_61%,#e4e4e7_0_1px,transparent_1px_4px)]"
          />
          <div aria-hidden="true" className="scanlines absolute inset-0" />
          <div className="relative bg-ink-950/80 px-4 py-3 text-center">
            <p className="font-mono text-3xl text-amber sm:text-4xl">SIGNAL LOST</p>
            <p className="mt-1 font-mono text-[11px] tracking-widest text-zinc-400 uppercase">ICE failed · no route to page</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line p-4">
          <p className="text-sm text-zinc-400">This page doesn't exist, or the link dropped out.</p>
          <Link to="/" className="font-mono text-xs tracking-wider text-phos uppercase no-underline hover:text-phos-200">
            Reconnect →
          </Link>
        </div>
      </div>
    </Page>
  );
}
