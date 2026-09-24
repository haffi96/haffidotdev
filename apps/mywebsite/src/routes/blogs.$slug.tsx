import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { MarkdownContent } from "../components/MarkdownContent";
import { Page } from "../components/Page";
import { Container } from "../components/ui";
import { categoryLabel, findBlog, readingTime } from "../lib/content";
import { profile } from "../lib/profile";

export const Route = createFileRoute("/blogs/$slug")({
  loader: ({ params }) => {
    const blog = findBlog(params.slug);
    if (!blog) {
      throw notFound();
    }
    return blog;
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.data.title ?? "Blog"} - Haffi Mazhar` }] }),
  component: BlogPage
});

function BlogPage() {
  const blog = Route.useLoaderData();

  return (
    <Page>
      <Container narrow className="pt-10 sm:pt-14">
        <Link to="/blogs" className="font-mono text-xs text-zinc-500 no-underline hover:text-zinc-950 dark:hover:text-white">
          &lt;- all posts
        </Link>
        <article className="mt-6">
          <header className="border-b border-zinc-300 pb-8 dark:border-zinc-800">
            <p className="font-mono text-xs text-amber-600 dark:text-amber-400">
              {categoryLabel(blog.data.category).toLowerCase()} · {readingTime(blog.body)} min read
            </p>
            <h1 className="mt-3 text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">{blog.data.title}</h1>
            <p className="mt-4 text-sm text-zinc-500">by {profile.name}</p>
          </header>
          <div className="pt-8">
            <MarkdownContent body={blog.body} />
          </div>
        </article>
        <div className="mt-16 flex items-center justify-between gap-4 border-t border-zinc-300 pt-6 font-mono text-xs dark:border-zinc-800">
          <Link to="/blogs" className="text-zinc-500 no-underline hover:text-zinc-950 dark:hover:text-white">
            &lt;- more posts
          </Link>
          <a href="#top" className="text-zinc-500 no-underline hover:text-zinc-950 dark:hover:text-white">
            top ↑
          </a>
        </div>
      </Container>
    </Page>
  );
}
