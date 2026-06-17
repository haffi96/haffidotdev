import { reviseApplicationDocuments, tailoringModelName } from "#/lib/ai";
import { requireUser } from "#/lib/auth";
import { getAppData, getGeneration, getNextRevisionNumber, getOpenGenerationComments, resolveGenerationComments, saveDocument, saveGeneration } from "#/lib/db";
import { documentKey, putDocument } from "#/lib/documents";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/revise")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const auth = await requireUser(request);
        if ("response" in auth) return auth.response;

        const body = (await request.json()) as { generationId?: string };
        const generationId = body.generationId?.trim() || "";
        if (!generationId) return Response.json({ error: "Choose a revision to revise." }, { status: 400 });

        const generation = await getGeneration(auth.user.id, generationId);
        if (!generation) return Response.json({ error: "Generation not found." }, { status: 404 });

        const comments = await getOpenGenerationComments(auth.user.id, generationId);
        if (!comments.length) return Response.json({ error: "Add at least one open comment before requesting a revision." }, { status: 400 });
        if (!generation.session_id) return Response.json({ error: "This generation is missing its revision session. Apply the latest D1 migration first." }, { status: 409 });

        const appData = await getAppData(auth.user.id);
        const output = await reviseApplicationDocuments({ appData, generation, comments });
        const revisionNumber = await getNextRevisionNumber(auth.user.id, generation.session_id);
        const baseFilename = slugify(`${generation.company_name}-${generation.job_url || "job-application"}-v${revisionNumber}`);
        const cvFilename = `${baseFilename}-cv.md`;
        const letterFilename = `${baseFilename}-cover-letter.md`;
        const cvKey = documentKey(auth.user.id, "generated_cv", cvFilename);
        const letterKey = documentKey(auth.user.id, "generated_cover_letter", letterFilename);

        await putDocument(cvKey, output.tailoredCv, "text/markdown; charset=utf-8");
        await putDocument(letterKey, output.coverLetter, "text/markdown; charset=utf-8");

        const cvDocumentId = await saveDocument(auth.user.id, {
          kind: "generated_cv",
          filename: cvFilename,
          content_type: "text/markdown; charset=utf-8",
          r2_key: cvKey,
          size_bytes: new TextEncoder().encode(output.tailoredCv).length
        });
        const coverLetterDocumentId = await saveDocument(auth.user.id, {
          kind: "generated_cover_letter",
          filename: letterFilename,
          content_type: "text/markdown; charset=utf-8",
          r2_key: letterKey,
          size_bytes: new TextEncoder().encode(output.coverLetter).length
        });

        const revisedGenerationId = await saveGeneration(auth.user.id, {
          session_id: generation.session_id,
          revision_number: revisionNumber,
          parent_generation_id: generation.id,
          company_name: generation.company_name,
          job_url: generation.job_url,
          job_description: generation.job_description,
          generated_cv: output.tailoredCv,
          generated_cover_letter: output.coverLetter,
          cv_document_id: cvDocumentId,
          cover_letter_document_id: coverLetterDocumentId,
          model: tailoringModelName()
        });

        await resolveGenerationComments(auth.user.id, generation.id, revisedGenerationId);

        return Response.json({ id: revisedGenerationId, cvDocumentId, coverLetterDocumentId, ...output });
      }
    }
  }
});

function slugify(value: string) {
  return value
    .replace(/^https?:\/\//, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 70) || "job-application";
}
