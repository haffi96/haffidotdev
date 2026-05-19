# AGENTS.md

Guidance for AI agents working in this repository.

## Repository Purpose

This repo hosts AI-built apps for `haffi.dev`. It is a pnpm + Turborepo monorepo deployed to Cloudflare Workers.

## Structure

```txt
apps/
  next/       Next.js app deployed at next.haffi.dev
  tanstack/   TanStack Start app deployed at tanstack.haffi.dev
libraries/
  shared/     Shared TypeScript package imported as @haffi/shared
```

Add new apps under `apps/<appname>`. Add shared packages under `libraries/<name>`.

## Tooling

- Package manager: `pnpm@9.15.4`
- Task runner: Turborepo
- Language: TypeScript
- Styling: Tailwind CSS v4
- Deployment: Cloudflare Workers with Wrangler

Use the existing package manager and workspace conventions. Do not introduce another package manager.

## Common Commands

Install dependencies:

```sh
pnpm install
```

Run all dev servers:

```sh
pnpm dev
```

Run one app:

```sh
pnpm --filter @haffi/next dev
pnpm --filter @haffi/tanstack dev
```

Validate before finishing changes:

```sh
pnpm check
pnpm build
```

Deploy apps:

```sh
pnpm deploy:next
pnpm deploy:tanstack
```

## Cloudflare Notes

Wrangler is installed as a workspace dependency. Use `pnpm wrangler ...`, not a global Wrangler install.

The current custom domains are:

- `next.haffi.dev`
- `tanstack.haffi.dev`

If a newly attached custom domain shows `DNS_PROBE_FINISHED_NXDOMAIN`, first check public DNS before changing config. Local routers and devices can cache negative DNS responses.

## App Conventions

Next.js app:

- Location: `apps/next`
- Cloudflare adapter: `@opennextjs/cloudflare`
- Worker build config: `apps/next/open-next.config.ts`
- Wrangler config: `apps/next/wrangler.jsonc`

TanStack Start app:

- Location: `apps/tanstack`
- Cloudflare integration: `@cloudflare/vite-plugin`
- Start plugin: `@tanstack/react-start/plugin/vite`
- Wrangler config: `apps/tanstack/wrangler.jsonc`
- Generated route tree: `apps/tanstack/src/routeTree.gen.ts`

Tailwind styling should preserve each app's visual direction unless the user asks for a redesign.

## Git And Generated Files

Do not commit generated output or dependency folders:

- `node_modules/`
- `.turbo/`
- `.next/`
- `.open-next/`
- `.wrangler/`
- `dist/`
- `*.tsbuildinfo`

Before committing, inspect:

```sh
git status --short
git diff --stat
git diff --check
```

## Secrets

Do not commit secrets, `.env` files, Cloudflare tokens, or OAuth credentials.

GitHub Actions deploys require repository secrets:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

## Change Policy

Prefer minimal changes that fit the existing structure. If adding a new app, include:

- `apps/<appname>/package.json`
- TypeScript config
- Tailwind setup
- Wrangler config
- A starter page that imports from `@haffi/shared`
- Root/package scripts only when they are needed

Always run `pnpm check` and `pnpm build` when changing app code, shared libraries, build config, or dependencies.
