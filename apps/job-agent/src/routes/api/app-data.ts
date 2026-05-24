import { getAppData, replaceExperienceEntries, saveInstructions, saveProfile, saveSourceMaterial } from "#/lib/db";
import { requireUser } from "#/lib/auth";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/app-data")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        const auth = await requireUser(request);
        if ("response" in auth) return auth.response;
        return Response.json(await getAppData(auth.user.id));
      },
      POST: async ({ request }: { request: Request }) => {
        const auth = await requireUser(request);
        if ("response" in auth) return auth.response;

        const body = (await request.json()) as {
          profile?: Parameters<typeof saveProfile>[1];
          sourceMaterial?: Parameters<typeof saveSourceMaterial>[1];
          experienceEntries?: Parameters<typeof replaceExperienceEntries>[1];
          instructions?: string;
        };

        if (body.profile) await saveProfile(auth.user.id, body.profile);
        if (body.sourceMaterial) await saveSourceMaterial(auth.user.id, body.sourceMaterial);
        if (body.experienceEntries) await replaceExperienceEntries(auth.user.id, body.experienceEntries);
        if (typeof body.instructions === "string") await saveInstructions(auth.user.id, body.instructions);

        return Response.json(await getAppData(auth.user.id));
      }
    }
  }
});
