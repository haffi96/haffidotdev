import { requireUser } from "#/lib/auth";
import { saveDocument } from "#/lib/db";
import { documentKey, putDocument } from "#/lib/documents";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/upload")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const auth = await requireUser(request);
          if ("response" in auth) {
            console.warn({ event: "cv_upload_unauthorized", path: new URL(request.url).pathname });
            return auth.response;
          }

          console.log({
            event: "cv_upload_started",
            userId: auth.user.id,
            contentType: request.headers.get("content-type"),
            contentLength: request.headers.get("content-length")
          });

          const upload = await readUpload(request);

          if (!upload) {
            console.warn({ event: "cv_upload_missing_file", userId: auth.user.id });
            return Response.json({ error: "Missing file in upload request." }, { status: 400 });
          }

          const key = documentKey(auth.user.id, upload.kind, upload.name);

          console.log({
            event: "cv_upload_file_received",
            userId: auth.user.id,
            filename: upload.name,
            fileType: upload.contentType,
            fileSize: upload.size,
            r2Key: key
          });

          await putDocument(key, upload.bytes, upload.contentType);
          const id = await saveDocument(auth.user.id, {
            kind: upload.kind,
            filename: upload.name,
            content_type: upload.contentType,
            r2_key: key,
            size_bytes: upload.size
          });

          console.log({ event: "cv_upload_completed", userId: auth.user.id, documentId: id, r2Key: key });

          return Response.json({ id });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown upload failure.";
          console.error({ event: "cv_upload_failed", message, stack: error instanceof Error ? error.stack : undefined });
          return Response.json({ error: message }, { status: 500 });
        }
      }
    }
  }
});

async function readUpload(request: Request) {
  const contentType = request.headers.get("content-type") || "application/octet-stream";

  if (contentType.includes("application/json")) {
    const body = (await request.json()) as {
      kind?: string;
      filename?: string;
      contentType?: string;
      size?: number;
      data?: string;
    };

    if (!body.filename || !body.data) return null;
    const bytes = base64ToArrayBuffer(body.data);

    return {
      name: body.filename,
      kind: body.kind || "source_cv",
      contentType: body.contentType || "application/octet-stream",
      size: body.size || bytes.byteLength,
      bytes
    };
  }

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const file = form.get("file");
    if (!isFormDataFile(file)) return null;

    return {
      name: file.name,
      kind: String(form.get("kind") || "source_cv"),
      contentType: file.type || "application/octet-stream",
      size: file.size,
      bytes: await file.arrayBuffer()
    };
  }

  const encodedName = request.headers.get("x-file-name");
  const bytes = await request.arrayBuffer();
  const size = Number(request.headers.get("x-file-size") || bytes.byteLength);

  if (!encodedName || bytes.byteLength === 0) return null;

  return {
    name: decodeURIComponent(encodedName),
    kind: request.headers.get("x-file-kind") || "source_cv",
    contentType,
    size,
    bytes
  };
}

function isFormDataFile(value: FormDataEntryValue | null): value is File {
  return typeof value === "object" && value !== null && "name" in value && "size" in value && "arrayBuffer" in value;
}

function base64ToArrayBuffer(value: string) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes.buffer;
}
