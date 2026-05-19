import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { Page } from "../components/Page";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "description", content: "The personal site of Haffi Mazhar" },
      { title: "Haffi Mazhar" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@200;400;700;900&display=swap"
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
    <Page className="p-20 text-center">
      <h1>Listen... I messed up. This is an error page</h1>
    </Page>
  );
}
