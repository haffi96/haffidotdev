import { createFileRoute } from "@tanstack/react-router";
import { About } from "../components/home/About";
import { Achievements } from "../components/home/Achievements";
import { Experience } from "../components/home/Experience";
import { FeaturedProjects, RecentPosts } from "../components/home/Featured";
import { Hero } from "../components/home/Hero";
import { Skills } from "../components/home/Skills";
import { Page } from "../components/Page";
import { profile } from "../lib/profile";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: `${profile.name} · ${profile.title}` }] }),
  component: Home
});

function Home() {
  return (
    <Page>
      <Hero />
      <About />
      <Achievements />
      <Experience />
      <Skills />
      <FeaturedProjects />
      <RecentPosts />
    </Page>
  );
}
