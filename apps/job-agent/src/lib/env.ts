import { env } from "cloudflare:workers";

export type AppEnv = {
  DB: D1Database;
  DOCUMENTS: R2Bucket;
  BETTER_AUTH_SECRET?: string;
  BETTER_AUTH_URL?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  OPENAI_API_KEY?: string;
};

export function getEnv() {
  return env as AppEnv;
}
