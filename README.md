# haffi.dev apps

Monorepo for AI-built apps deployed to Cloudflare Workers under `haffi.dev`.

## Structure

```txt
apps/
  mywebsite/  Personal website at haffi.dev
  job-agent/  Job application agent at jobs.haffi.dev
  next/       Next.js starter at next.haffi.dev
  tanstack/   TanStack Start starter at tanstack.haffi.dev
libraries/
  shared/     Shared TypeScript package
```

## Requirements

- Node.js 22+
- pnpm 9+
- Cloudflare account with `haffi.dev` in the account

Install pnpm if needed:

```sh
npm install --global pnpm@9.15.4
```

Install dependencies:

```sh
pnpm install
```

## Local Development

Run all apps:

```sh
pnpm dev
```

Run one app:

```sh
pnpm --filter @haffi/mywebsite dev
pnpm --filter @haffi/job-agent dev
pnpm --filter @haffi/next dev
pnpm --filter @haffi/tanstack dev
```

## Cloudflare Setup

Wrangler is installed as a workspace dependency. After `pnpm install`, authenticate locally:

```sh
pnpm wrangler login
pnpm wrangler whoami
```

The app configs define custom domains:

- `apps/mywebsite/wrangler.jsonc` -> `haffi.dev`
- `apps/job-agent/wrangler.jsonc` -> `jobs.haffi.dev`
- `apps/next/wrangler.jsonc` -> `next.haffi.dev`
- `apps/tanstack/wrangler.jsonc` -> `tanstack.haffi.dev`

Deploy locally:

```sh
pnpm deploy:mywebsite
pnpm deploy:job-agent
pnpm deploy:next
pnpm deploy:tanstack
```

`apps/job-agent` also requires D1, R2, and app secrets. See `apps/job-agent/README.md` for setup.

## GitHub Deploys

Pushes to `main` run `.github/workflows/deploy.yml` and deploy the apps configured in that workflow.

Add these GitHub repository secrets:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

The API token needs Workers deploy permissions and permission to manage routes/custom domains for `haffi.dev`.
