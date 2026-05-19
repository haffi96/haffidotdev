import { createFileRoute, notFound } from "@tanstack/react-router";
import { MarkdownContent } from "../components/MarkdownContent";
import { Page } from "../components/Page";
import { findBlog } from "../lib/content";

export const Route = createFileRoute("/blogs/$slug")({
  loader: ({ params }) => {
    const blog = findBlog(params.slug);
    if (!blog) {
      throw notFound();
    }
    return blog;
  },
  head: ({ loaderData }) => ({ meta: [{ title: loaderData?.data.title ?? "Blog" }] }),
  component: BlogPage
});

function BlogPage() {
  const blog = Route.useLoaderData();

  return (
    <Page className="px-8 md:px-20 lg:px-[7.5rem] xl:px-[17.5rem] 2xl:px-80">
      <p className="mb-5 text-center font-bold">{blog.data.title}</p>
      <MarkdownContent body={blog.body} />
    </Page>
  );
}
