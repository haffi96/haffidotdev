import { getEnv } from "./env";

export function documentKey(userId: string, kind: string, filename: string) {
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 120) || "document.txt";
  return `${userId}/${kind}/${crypto.randomUUID()}-${safeName}`;
}

export async function putDocument(key: string, body: string | ArrayBuffer | ReadableStream, contentType: string) {
  await getEnv().DOCUMENTS.put(key, body, {
    httpMetadata: { contentType }
  });
}

export async function getDocumentObject(key: string) {
  return getEnv().DOCUMENTS.get(key);
}
