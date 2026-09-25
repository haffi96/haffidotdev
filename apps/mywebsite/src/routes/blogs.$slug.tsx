import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowIcon, MailIcon } from "../components/Icons";
import { MarkdownContent } from "../components/MarkdownContent";
import { Page } from "../components/Page";
import { findBlog } from "../lib/content";
import { categoryStyle, readingMinutes } from "../lib/format";
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
  const category = categoryStyle(blog.data.category);

  return (
    <Page>
      <nav aria-label="Breadcrumb" className="mx-auto mb-4 max-w-[860px] font-mono text-sm">
        <Link to="/blogs" className="inline-flex items-center gap-1.5 font-semibold text-muted no-underline hover:text-ink">
          <ArrowIcon className="size-4 rotate-180" /> learning-logs
        </Link>
        <span className="text-muted"> / {blog.slug}</span>
      </nav>

      <article className="animate-window-pop mx-auto max-w-[860px] overflow-hidden rounded-lg border-[1.5px] border-edge bg-window shadow-[0_2px_0_0_var(--hm-edge)]">
        <div className="flex items-center gap-2 border-b-[1.5px] border-edge bg-chrome px-3 py-1.5">
          <span aria-hidden="true" className={`size-2.5 rounded-sm border border-edge ${category.dot}`} />
          <p className="min-w-0 flex-1 truncate font-mono text-xs text-muted">{blog.slug}.mdx</p>
          <p className="shrink-0 font-mono text-xs text-muted">{readingMinutes(blog.body)} min read</p>
        </div>

        <header className="border-b-[1.5px] border-dashed border-line px-5 pt-8 pb-7 sm:px-10 sm:pt-12 md:px-14">
          <p className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-edge bg-desk-2 px-3 py-0.5 font-mono text-xs font-medium text-ink">
            <span aria-hidden="true" className={`size-2 rounded-full ${category.dot}`} />
            {category.label}
          </p>
          <h1 className="mt-4 text-3xl leading-[1.12] font-bold tracking-tight text-ink sm:text-[2.6rem]">{blog.data.title}</h1>
          <p className="mt-4 text-sm text-muted">
            By <span className="font-semibold text-ink">{profile.name}</span> · {readingMinutes(blog.body)} min read
          </p>
        </header>

        <div className="px-5 py-8 sm:px-10 md:px-14 md:py-10">
          <div className="mx-auto max-w-[68ch]">
            <MarkdownContent body={blog.body} />
          </div>
        </div>

        <footer className="flex flex-col gap-4 border-t-[1.5px] border-edge bg-desk-2 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-10 md:px-14">
          <p className="text-sm text-body">
            Spotted a mistake or have a better explanation? I'd genuinely love to hear it.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href={`mailto:${profile.email}?subject=${encodeURIComponent(`Re: ${blog.data.title}`)}`} className="btn-3d btn-orange">
              <MailIcon /> Email me
            </a>
            <Link to="/blogs" className="btn-3d btn-plain">
              More posts
            </Link>
          </div>
        </footer>
      </article>
    </Page>
  );
}
