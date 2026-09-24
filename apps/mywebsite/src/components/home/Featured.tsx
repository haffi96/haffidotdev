import { Link } from "@tanstack/react-router";
import { projects, visibleBlogs } from "../../lib/content";
import { ArrowIcon } from "../Icons";
import { Reveal } from "../motion/Reveal";
import { PostRow } from "../PostRow";
import { ProjectCard } from "../ProjectCard";
import { SectionHeading } from "../SectionHeading";

function SeeAll({ to, label }: Readonly<{ to: "/projects" | "/blogs"; label: string }>) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2.5 text-sm font-medium no-underline transition-colors hover:border-fg"
    >
      {label}
      <ArrowIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}

export function FeaturedProjects() {
  return (
    <section className="shell py-20 sm:py-28">
      <SectionHeading
        index="05"
        eyebrow="Side projects"
        title={
          <>
            Things I've built <span className="font-display font-normal text-accent italic">for fun.</span>
          </>
        }
        aside={<SeeAll to="/projects" label="All projects" />}
      />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.slice(0, 3).map((project, index) => (
          <Reveal key={project.slug} delay={index * 0.08} className="h-full">
            <ProjectCard project={project} index={index} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function RecentPosts() {
  return (
    <section className="shell py-20 sm:py-28">
      <SectionHeading
        index="06"
        eyebrow="Writing"
        title={
          <>
            Notes from what I'm <span className="font-display font-normal text-accent italic">learning.</span>
          </>
        }
        aside={<SeeAll to="/blogs" label="All posts" />}
      />
      <div className="border-b border-line">
        {visibleBlogs.slice(0, 4).map((post, index) => (
          <Reveal key={post.slug} delay={index * 0.06}>
            <PostRow post={post} index={index} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
