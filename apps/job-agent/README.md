# Job Agent

TanStack Start app for `jobs.haffi.dev`, deployed to Cloudflare Workers with D1 for structured data and R2 for document storage.

## Cloudflare Resources

Create the backing resources from the repository root:

```sh
pnpm wrangler d1 create haffi-job-agent
pnpm wrangler r2 bucket create haffi-job-agent-documents
```

Copy the generated D1 `database_id` into `wrangler.jsonc`.

Apply migrations:

```sh
pnpm --dir apps/job-agent wrangler d1 migrations apply haffi-job-agent --local
pnpm --dir apps/job-agent wrangler d1 migrations apply haffi-job-agent --remote
```

## Secrets

Set these in the Cloudflare UI or with `wrangler secret put`:

```txt
BETTER_AUTH_SECRET
BETTER_AUTH_URL
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
OPENAI_API_KEY
```

For local development, create `.dev.vars` in this directory with the same keys. Do not commit it.

## Commands

```sh
pnpm --filter @haffi/job-agent dev
pnpm --filter @haffi/job-agent check
pnpm --filter @haffi/job-agent build
pnpm deploy:job-agent
```
