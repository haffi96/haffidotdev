import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { drizzle } from "drizzle-orm/d1";
import { authSchema } from "./auth-schema";
import { getEnv } from "./env";

const appEnv = getEnv();

export const auth = betterAuth({
  baseURL: appEnv.BETTER_AUTH_URL || "http://localhost:3000",
  secret: appEnv.BETTER_AUTH_SECRET || "development-only-change-me",
  database: drizzleAdapter(drizzle(appEnv.DB, { schema: authSchema }), {
    provider: "sqlite",
    schema: authSchema
  }),
  emailAndPassword: {
    enabled: true
  },
  socialProviders: {
    google: {
      clientId: appEnv.GOOGLE_CLIENT_ID || "",
      clientSecret: appEnv.GOOGLE_CLIENT_SECRET || ""
    }
  },
  plugins: [tanstackStartCookies()]
});

export async function getSession(request: Request) {
  return auth.api.getSession({ headers: request.headers });
}

export async function requireUser(request: Request) {
  const session = await getSession(request);

  if (!session?.user) {
    return { response: Response.json({ error: "Unauthorized" }, { status: 401 }) } as const;
  }

  return { user: session.user } as const;
}
