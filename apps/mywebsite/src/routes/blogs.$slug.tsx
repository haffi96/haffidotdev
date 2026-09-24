import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowIcon } from "../components/Icons";
import { MarkdownContent } from "../components/MarkdownContent";
import { Reveal } from "../components/motion/Reveal";
import { ScrollProgress } from "../components/motion/ScrollProgress";
import { SplitText } from "../components/motion/SplitText";
import { Page } from "../components/Page";
import { findBlog, readingTime, visibleBlogs } from "../lib/content";
import { profile } from "../lib/profile";

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
  const newer = index > 0 ? visibleBlogs[index - 1] : undefined;
  const older = index >= 0 ? visibleBlogs[index + 1] : undefined;

  return (
    <Page className="px-5 pt-10 sm:px-8 sm:pt-16">
      <ScrollProgress />
      <div className="mx-auto max-w-[44rem]">
        <Link to="/blogs" className="fade-up group inline-flex items-center gap-2 text-sm font-medium text-muted no-underline hover:text-fg">
          <ArrowIcon className="size-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-1" />
          All posts
        </Link>

        <header className="mt-10 border-b border-line pb-10">
          <p className="fade-up flex flex-wrap items-center gap-2 font-mono text-xs text-muted uppercase">
            <span className="rounded-full bg-accent-soft px-2.5 py-1 text-accent-ink">{blog.data.category}</span>
            <span>{readingTime(blog.body)} min read</span>
          </p>
          <h1 className="mt-6 text-[clamp(2.3rem,7vw,4rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-balance">
            <SplitText text={blog.data.title} stagger={0.05} />
          </h1>
          <p className="fade-up mt-6 text-sm text-muted [animation-delay:0.3s]">
            By <span className="font-medium text-fg">{profile.name}</span>
          </p>
        </header>

        <article className="fade-up mt-4 [animation-delay:0.35s]">
          <MarkdownContent body={blog.body} />
        </article>

        {newer || older ? (
          <Reveal className="mt-20 grid gap-3 sm:grid-cols-2">
            {older ? <Neighbour label="Previous" slug={older.slug} title={older.data.title} /> : <span className="hidden sm:block" />}
            {newer ? <Neighbour label="Next" slug={newer.slug} title={newer.data.title} alignEnd /> : null}
          </Reveal>
        ) : null}
      </div>
    </Page>
  );
}

function Neighbour({ label, slug, title, alignEnd = false }: Readonly<{ label: string; slug: string; title: string; alignEnd?: boolean }>) {
  return (
    <Link
      to="/blogs/$slug"
      params={{ slug }}
      className={`group flex flex-col gap-2 rounded-3xl border border-line bg-card p-6 no-underline transition-colors hover:border-accent/50 ${
        alignEnd ? "sm:items-end sm:text-right" : ""
      }`}
    >
      <span className="eyebrow">{label}</span>
      <span className="text-lg leading-snug font-semibold tracking-tight text-fg transition-colors group-hover:text-accent-ink">{title}</span>
    </Link>
  );
}
