import { fetchJobDescription, generateApplicationDocuments, modelName } from "#/lib/ai";
import { requireUser } from "#/lib/auth";
import { getAppData, saveDocument, saveGeneration } from "#/lib/db";
import { documentKey, putDocument } from "#/lib/documents";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/generate")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const auth = await requireUser(request);
        if ("response" in auth) return auth.response;

        const body = (await request.json()) as { jobUrl?: string; jobDescription?: string };
        const jobUrl = body.jobUrl?.trim() || "";
        let jobDescription = body.jobDescription?.trim() || "";

        if (!jobDescription && jobUrl) {
          jobDescription = await fetchJobDescription(jobUrl);
        }

        if (!jobDescription) {
          return Response.json({ error: "Add a job description URL or paste the job description." }, { status: 400 });
        }

        const appData = await getAppData(auth.user.id);
        const output = await generateApplicationDocuments({ appData, jobUrl, jobDescription });

        const baseFilename = slugify(jobUrl || "job-application");
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

        const generationId = await saveGeneration(auth.user.id, {
          job_url: jobUrl,
          job_description: jobDescription,
          generated_cv: output.tailoredCv,
          generated_cover_letter: output.coverLetter,
          cv_document_id: cvDocumentId,
          cover_letter_document_id: coverLetterDocumentId,
          model: modelName
        });

        return Response.json({ id: generationId, cvDocumentId, coverLetterDocumentId, ...output });
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
