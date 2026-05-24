import { requireUser } from "#/lib/auth";
import { getDocument } from "#/lib/db";
import { getDocumentObject } from "#/lib/documents";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/document/$")({
  server: {
    handlers: {
      GET: async ({ request, params }: { request: Request; params: { _splat: string } }) => {
        const auth = await requireUser(request);
        if ("response" in auth) return auth.response;

        const document = await getDocument(auth.user.id, params._splat);
        if (!document) return Response.json({ error: "Document not found." }, { status: 404 });

        const object = await getDocumentObject(document.r2_key);
        if (!object) return Response.json({ error: "Document object not found." }, { status: 404 });

        const disposition = new URL(request.url).searchParams.get("disposition") === "inline" ? "inline" : "attachment";

        return new Response(object.body, {
          headers: {
            "content-type": document.content_type,
            "content-disposition": `${disposition}; filename="${document.filename.replace(/"/g, "")}"`
          }
        });
      }
    }
  }
});
