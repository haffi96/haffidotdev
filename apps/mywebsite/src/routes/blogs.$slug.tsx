import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "../components/Icons";
import { MarkdownContent } from "../components/MarkdownContent";
import { Page } from "../components/Page";
import { Tile } from "../components/Tile";
import { findBlog } from "../lib/content";
import { profile } from "../lib/profile";
import { categoryLabel, listedBlogs, readingMinutes } from "../lib/writing";
import avatarUrl from "../media/avatar.png?url";

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
  const position = listedBlogs.findIndex((entry) => entry.slug === blog.slug);
  const more = (position === -1 ? listedBlogs : [...listedBlogs.slice(position + 1), ...listedBlogs.slice(0, position)]).slice(0, 2);

  return (
    <Page>
      <div className="mx-auto max-w-3xl">
        <Link to="/blogs" className="group mb-4 inline-flex items-center gap-1.5 px-1 text-sm text-muted no-underline hover:text-fg">
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" /> All writing
        </Link>

        <Tile as="article" className="px-5 py-8 sm:px-10 sm:py-12 lg:px-14">
          <header className="mb-8 border-b border-line pb-8 sm:mb-10 sm:pb-10">
            <p className="flex flex-wrap items-center gap-2 text-xs text-muted">
              <span className="rounded-full bg-accent-soft px-2.5 py-1 font-medium text-accent">{categoryLabel(blog.data.category)}</span>
              <span>{readingMinutes(blog.body)} min read</span>
            </p>
            <h1 className="mt-4 text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl">{blog.data.title}</h1>
            <div className="mt-6 flex items-center gap-3">
              <img src={avatarUrl} alt="" width={36} height={36} className="size-9 rounded-full object-cover ring-1 ring-line" />
              <div className="text-sm leading-tight">
                <p className="font-medium">{profile.name}</p>
                <p className="text-muted">{profile.title}</p>
              </div>
            </div>
          </header>
          <MarkdownContent body={blog.body} />
        </Tile>

        {more.length > 0 ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-4">
            {more.map((entry, index) => (
              <Tile key={entry.slug} index={index + 1} interactive className="flex flex-col justify-between gap-6 p-6">
                <Link to="/blogs/$slug" params={{ slug: entry.slug }} className="stretched" aria-label={entry.data.title} />
                <div className="flex items-center justify-between">
                  <p className="eyebrow">Keep reading</p>
                  <ArrowUpRight className="nudge size-4 text-muted" />
                </div>
                <div>
                  <p className="font-semibold tracking-tight">{entry.data.title}</p>
                  <p className="mt-1 text-xs text-muted">
                    {categoryLabel(entry.data.category)} · {readingMinutes(entry.body)} min read
                  </p>
                </div>
              </Tile>
            ))}
          </div>
        ) : null}
      </div>
    </Page>
  );
}
