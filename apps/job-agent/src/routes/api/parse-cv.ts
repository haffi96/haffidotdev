import { parseCvIntoExperience } from "#/lib/ai";
import { requireUser } from "#/lib/auth";
import { appendExperienceEntries, getDocument, updateDocumentParseStatus } from "#/lib/db";
import { getDocumentObject } from "#/lib/documents";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/parse-cv")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const auth = await requireUser(request);
        if ("response" in auth) return auth.response;

        const body = (await request.json()) as { documentId?: string };
        if (!body.documentId) return Response.json({ error: "Missing document id." }, { status: 400 });

        const document = await getDocument(auth.user.id, body.documentId);
        if (!document) return Response.json({ error: "Document not found." }, { status: 404 });

        await updateDocumentParseStatus(auth.user.id, document.id, "parsing");

        try {
          const object = await getDocumentObject(document.r2_key);
          if (!object) throw new Error("Document object not found in R2.");

          const entries = await parseCvIntoExperience({
            filename: document.filename,
            contentType: document.content_type,
            bytes: await object.arrayBuffer()
          });

          await appendExperienceEntries(auth.user.id, entries);
          await updateDocumentParseStatus(auth.user.id, document.id, "parsed");
          return Response.json({ entries });
        } catch (error) {
          const message = error instanceof Error ? error.message : "CV parsing failed.";
          await updateDocumentParseStatus(auth.user.id, document.id, "failed", message);
          return Response.json({ error: message }, { status: 500 });
        }
      }
    }
  }
});
