import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeftIcon } from "../components/Icons";
import { MarkdownContent } from "../components/MarkdownContent";
import { Page } from "../components/Page";
import { findBlog } from "../lib/content";
import { formatCategory, readingTime } from "../lib/format";
import { profile } from "../lib/profile";

export const Route = createFileRoute("/blogs/$slug")({
  loader: ({ params }) => {
    const blog = findBlog(params.slug);
    if (!blog) {
      throw notFound();
    }
    return blog;
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.data.title ?? "Blog"} | Haffi Mazhar` }] }),
  component: BlogPage
});

function BlogPage() {
  const blog = Route.useLoaderData();

  return (
    <Page>
      <article className="mx-auto max-w-3xl px-5 pt-28 pb-24 sm:px-8 md:pt-36">
        <Link to="/blogs" className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.16em] text-mist uppercase no-underline hover:text-neon">
          <ArrowLeftIcon className="size-3.5" /> All posts
        </Link>
        <header className="mt-8 border-b border-line/70 pb-8">
          <p className="flex flex-wrap items-center gap-3 font-mono text-xs tracking-[0.16em] uppercase">
            <span className="text-neon">{formatCategory(blog.data.category)}</span>
            <span className="text-line">/</span>
            <span className="text-mist">{readingTime(blog.body)} min read</span>
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight font-semibold tracking-tight text-balance text-white sm:text-5xl">
            {blog.data.title}
          </h1>
          <p className="mt-4 text-sm text-mist">By {profile.name}</p>
        </header>
        <MarkdownContent body={blog.body} className="mt-8" />
      </article>
    </Page>
  );
}
