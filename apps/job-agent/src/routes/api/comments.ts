import { requireUser } from "#/lib/auth";
import { getAppData, getGeneration, saveGenerationComment } from "#/lib/db";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/comments")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const auth = await requireUser(request);
        if ("response" in auth) return auth.response;

        const body = (await request.json()) as { generationId?: string; documentKind?: string; anchorText?: string; commentText?: string };
        const generationId = body.generationId?.trim() || "";
        const documentKind = body.documentKind === "cv" || body.documentKind === "cover_letter" ? body.documentKind : null;
        const anchorText = body.anchorText?.trim() || "";
        const commentText = body.commentText?.trim() || "";

        if (!generationId || !documentKind || !commentText) {
          return Response.json({ error: "Choose a document block and add a comment." }, { status: 400 });
        }

        const generation = await getGeneration(auth.user.id, generationId);
        if (!generation) return Response.json({ error: "Generation not found." }, { status: 404 });

        const id = await saveGenerationComment(auth.user.id, {
          generation_id: generationId,
          document_kind: documentKind,
          anchor_text: anchorText,
          comment_text: commentText
        });

        return Response.json({ id, data: await getAppData(auth.user.id) });
      }
    }
  }
});
