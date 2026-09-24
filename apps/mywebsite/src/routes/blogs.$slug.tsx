import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { readingMinutes } from "../components/Hud";
import { logId } from "../components/LogList";
import { MarkdownContent } from "../components/MarkdownContent";
import { Page } from "../components/Page";
import { findBlog, visibleBlogs } from "../lib/content";

export const Route = createFileRoute("/blogs/$slug")({
  loader: ({ params }) => {
    const blog = findBlog(params.slug);
    if (!blog) {
      throw notFound();
    }
    return blog;
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.data.title ?? "Blog"} · Haffi Mazhar` }] }),
  component: BlogPage
});

function BlogPage() {
  const blog = Route.useLoaderData();
  const index = visibleBlogs.findIndex((entry) => entry.slug === blog.slug);
  const previous = index > 0 ? visibleBlogs[index - 1] : undefined;
  const next = index >= 0 && index < visibleBlogs.length - 1 ? visibleBlogs[index + 1] : undefined;

  return (
    <Page className="pt-8 sm:pt-12">
      <article className="mx-auto max-w-[70ch]">
        <nav aria-label="Breadcrumb" className="font-mono text-[11px] tracking-wider text-zinc-500 uppercase">
          <Link to="/blogs" className="no-underline hover:text-phos">
            Logs
          </Link>{" "}
          <span className="text-zinc-700">/</span> <span className="text-zinc-400">{blog.data.category}</span>
        </nav>

        <header className="mt-6 border-b border-line pb-6">
          <h1 className="text-3xl leading-tight font-semibold tracking-tight text-balance text-zinc-50 sm:text-[2.6rem]">
            {blog.data.title}
          </h1>
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] tracking-wider text-zinc-500 uppercase">
            <span className="text-zinc-400">{logId(blog)}</span>
            <span className="text-phos-500">{blog.data.category}</span>
            <span>{readingMinutes(blog.body)} min read</span>
          </p>
        </header>

        <div className="mt-8">
          <MarkdownContent body={blog.body} />
        </div>
      </article>

      {previous || next ? (
        <nav aria-label="More logs" className="mx-auto mt-16 grid max-w-[70ch] gap-3 border-t border-line pt-6 sm:grid-cols-2">
          {previous ? (
            <Link
              to="/blogs/$slug"
              params={{ slug: previous.slug }}
              className="corners border border-line p-4 no-underline transition-colors hover:border-line-strong"
            >
              <span className="hud-label">← Previous log</span>
              <span className="mt-1 block font-medium text-zinc-100">{previous.data.title}</span>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
          {next ? (
            <Link
              to="/blogs/$slug"
              params={{ slug: next.slug }}
              className="corners border border-line p-4 text-right no-underline transition-colors hover:border-line-strong"
            >
              <span className="hud-label">Next log →</span>
              <span className="mt-1 block font-medium text-zinc-100">{next.data.title}</span>
            </Link>
          ) : null}
        </nav>
      ) : null}
    </Page>
  );
}
