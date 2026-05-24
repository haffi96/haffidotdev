import { createAuthClient } from "better-auth/react";

export const authClient: ReturnType<typeof createAuthClient> = createAuthClient({
  baseURL: typeof window === "undefined" ? undefined : window.location.origin
});
