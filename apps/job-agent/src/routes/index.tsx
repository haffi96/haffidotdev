import { haffiDomain } from "@haffi/shared";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, FileText, Lock, Sparkles } from "lucide-react";
import { ThemeToggle } from "#/components/ThemeToggle";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card";

export const Route = createFileRoute("/")({
  component: Home
});

const features = [
  { Icon: FileText, text: "Source material stays unchanged and editable." },
  { Icon: Sparkles, text: "Instructions steer future outputs without rewriting your profile." },
  { Icon: Lock, text: "Auth, data, and documents stay server-side on Cloudflare." }
];

function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fde68a,transparent_32rem),linear-gradient(135deg,#f8fafc,#e2e8f0)] px-6 py-8 dark:bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.22),transparent_30rem),linear-gradient(135deg,#020617,#0f172a)]">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col justify-center gap-10">
        <nav className="flex items-center justify-between">
          <div className="font-mono text-sm font-bold tracking-[0.18em] uppercase text-slate-950 dark:text-slate-100">jobs.{haffiDomain}</div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="outline">Sign in</Button>
            </Link>
          </div>
        </nav>
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-950">AI job application workspace</p>
            <h1 className="max-w-4xl text-5xl font-black tracking-[-0.05em] text-slate-950 dark:text-slate-100 md:text-7xl">
              Keep your CV honest. Tailor it just enough.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700 dark:text-slate-300">
              Store your source CV, achievement bullets, and agent instructions, then generate conservative job-specific CVs and cover letters from a job link.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/login">
                <Button className="gap-2" variant="secondary">
                  Start tailoring <ArrowRight size={16} />
                </Button>
              </Link>
              <a href="https://haffi.dev">
                <Button variant="ghost">Back to haffi.dev</Button>
              </a>
            </div>
          </div>
          <Card className="border-slate-950 shadow-[12px_12px_0_#0f172a] dark:border-slate-600 dark:shadow-[12px_12px_0_#334155]">
            <CardHeader>
              <CardTitle>Built for repeat applications</CardTitle>
              <CardDescription>Structured source material in D1, files in R2, generation through OpenAI.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {features.map(({ Icon, text }) => (
                <div key={text} className="flex gap-3 rounded-lg bg-slate-50 p-4 text-sm font-medium text-slate-700 dark:bg-slate-950 dark:text-slate-300">
                  <Icon className="mt-0.5 text-slate-950 dark:text-amber-300" size={18} />
                  <span>{text}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
