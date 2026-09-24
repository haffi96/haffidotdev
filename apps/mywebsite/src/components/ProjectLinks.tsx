import { ArrowUpRight, GitHubIcon } from "./Icons";

export function ProjectLinks({ site, repos }: Readonly<{ site?: string; repos: (string | undefined)[] }>) {
  const repoLinks = repos.filter((repo): repo is string => Boolean(repo));
  return (
    <div className="relative z-10 flex flex-wrap gap-2">
      {site ? (
        <a className="btn btn-primary py-1.5" href={site} target="_blank" rel="noreferrer">
          Live site <ArrowUpRight className="size-3.5" />
        </a>
      ) : null}
      {repoLinks.map((repo, index) => (
        <a key={repo} className="btn btn-ghost py-1.5" href={repo} target="_blank" rel="noreferrer">
          <GitHubIcon className="size-3.5" /> {repoLinks.length > 1 ? `Repo ${index + 1}` : "Source"}
        </a>
      ))}
    </div>
  );
}
