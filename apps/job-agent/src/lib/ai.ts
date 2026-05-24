import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import type { AppData } from "./db";
import { getEnv } from "./env";

const outputSchema = z.object({
  tailoredCv: z.string(),
  coverLetter: z.string()
});

const experienceSchema = z.object({
  entries: z.array(
    z.object({
      title: z.string(),
      kind: z.enum(["job", "project", "other"]),
      content: z.string()
    })
  )
});

export const modelName = "gpt-4o-mini";

export async function generateApplicationDocuments(input: {
  appData: AppData;
  jobUrl: string;
  jobDescription: string;
}) {
  const { appData, jobUrl, jobDescription } = input;
  const experience = appData.experienceEntries.length
    ? appData.experienceEntries.map(({ title, kind, content }) => ({ title, kind, content }))
    : safeJson(appData.sourceMaterial.achievements_json);

  const prompt = `You are a precise job-application assistant.

Your task:
- Create a CV that is only slightly tailored to the job.
- Create a tailored cover letter.

Hard rules:
- Do not invent facts, tools, employers, dates, responsibilities, metrics, credentials, or outcomes.
- Keep the CV close to the original source CV.
- Only adjust wording, ordering, emphasis, and summary language when it is clearly supported by the user's source material.
- Preserve the user's source material as the source of truth.
- If the job description is thin, be conservative.
- Return Markdown.

User profile:
${JSON.stringify(appData.profile, null, 2)}

Original CV:
The source CV is stored as an uploaded document. Use the structured experience entries and extra unchanged source notes as the editable source of truth.

Experience entries:
${JSON.stringify(experience, null, 2)}

Extra unchanged source notes:
${appData.sourceMaterial.extra_notes || "No extra notes provided."}

Additional user instructions:
${appData.instructions || "No additional instructions provided."}

Job URL:
${jobUrl || "No URL provided."}

Job description:
${jobDescription || "No job description provided."}`;

  const openai = createOpenAI({ apiKey: getEnv().OPENAI_API_KEY });
  const result = await generateObject({
    model: openai(modelName),
    schema: outputSchema,
    prompt
  });

  return result.object;
}

export async function parseCvIntoExperience(input: { filename: string; contentType: string; bytes: ArrayBuffer }) {
  const openai = createOpenAI({ apiKey: getEnv().OPENAI_API_KEY });
  const text = input.contentType.startsWith("text/") ? new TextDecoder().decode(input.bytes).slice(0, 40_000) : "";
  const prompt = `Extract the user's jobs and notable projects into separate experience entries.

Rules:
- Create one entry per job or project.
- Use the job title, company, or project name as the entry title.
- Preserve facts from the CV. Do not invent dates, metrics, employers, technologies, or achievements.
- Use Markdown bullet points in content.
- Use kind "job" for employment, "project" for side/personal/open-source projects, and "other" only when neither fits.

Filename: ${input.filename}
Content type: ${input.contentType}
${text ? `\nCV text:\n${text}` : "\nThe CV is a PDF/binary document. Extract text from the attached PDF content."}`;

  if (text) {
    const result = await generateObject({ model: openai(modelName), schema: experienceSchema, prompt });
    return result.object.entries;
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      authorization: `Bearer ${getEnv().OPENAI_API_KEY}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: modelName,
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: prompt },
            {
              type: "input_file",
              filename: input.filename,
              file_data: `data:${input.contentType || "application/pdf"};base64,${toBase64(input.bytes)}`
            }
          ]
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "experience_entries",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              entries: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    title: { type: "string" },
                    kind: { type: "string", enum: ["job", "project", "other"] },
                    content: { type: "string" }
                  },
                  required: ["title", "kind", "content"]
                }
              }
            },
            required: ["entries"]
          },
          strict: true
        }
      }
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI CV parsing failed (${response.status}).`);
  }

  const body = (await response.json()) as { output?: Array<{ content?: Array<{ text?: string }> }> };
  const json = body.output?.flatMap((item) => item.content || []).find((item) => item.text)?.text;
  if (!json) throw new Error("OpenAI did not return parsed experience entries.");
  return experienceSchema.parse(JSON.parse(json)).entries;
}

function toBase64(bytes: ArrayBuffer) {
  let binary = "";
  const array = new Uint8Array(bytes);
  for (const byte of array) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function safeJson(value: string) {
  try {
    return JSON.parse(value || "[]") as unknown;
  } catch {
    return value;
  }
}

export async function fetchJobDescription(url: string) {
  if (!url) return "";
  const parsed = new URL(url);
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error("Only HTTP and HTTPS job links are supported.");
  }

  const response = await fetch(parsed, {
    headers: {
      accept: "text/html,text/plain;q=0.9,*/*;q=0.8",
      "user-agent": "haffi-job-agent/0.1"
    }
  });

  if (!response.ok) {
    throw new Error(`Could not fetch job description (${response.status}).`);
  }

  const text = await response.text();
  return text
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 20_000);
}
