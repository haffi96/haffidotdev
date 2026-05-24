import { createOpenAI } from "@ai-sdk/openai";
import { generateText, Output } from "ai";
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

export const parsingModelName = "gpt-4o-mini";

export function tailoringModelName() {
  return getEnv().TAILORING_MODEL || "gpt-5.5";
}

export async function generateApplicationDocuments(input: {
  appData: AppData;
  companyName: string;
  jobUrl: string;
  jobDescription: string;
}) {
  const { appData, companyName, jobUrl, jobDescription } = input;
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

CV layout rules:
- Preserve the original CV structure as closely as possible from the source material.
- Keep the same broad section order and section names where they can be inferred.
- Keep experience grouped by the same jobs/projects rather than merging or splitting entries unless the source material already separates them.
- Keep roughly the same bullet density and level of detail as the source entries.
- Do not redesign the CV, add new decorative sections, or change it into a different template.
- Tailoring should primarily reorder emphasis, lightly adjust summaries, and select the most relevant bullets while maintaining the original layout.

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

Company:
${companyName}

Job URL:
${jobUrl || "No URL provided."}

Job description:
${jobDescription || "No job description provided."}`;

  const openai = createOpenAI({ apiKey: getEnv().OPENAI_API_KEY });
  const result = await generateText({
    model: openai(tailoringModelName()),
    output: Output.object({ schema: outputSchema }),
    prompt
  });

  return result.output;
}

export async function parseCvIntoExperience(input: { filename: string; contentType: string; bytes: ArrayBuffer }) {
  const openai = createOpenAI({ apiKey: getEnv().OPENAI_API_KEY });
  const text = cvText(input);
  const prompt = cvParsePrompt(input, text);

  if (text) {
    const result = await generateText({
      model: openai(parsingModelName),
      output: Output.object({ schema: experienceSchema }),
      prompt,
      abortSignal: AbortSignal.timeout(45_000)
    });
    return result.output.entries;
  }

  const result = await generateText({
    model: openai(parsingModelName),
    output: Output.object({ schema: experienceSchema }),
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          {
            type: "file",
            data: new Uint8Array(input.bytes),
            mediaType: input.contentType || "application/pdf",
            filename: input.filename,
          }
        ]
      }
    ],
    abortSignal: AbortSignal.timeout(45_000)
  });

  return result.output.entries;
}

function cvText(input: { contentType: string; bytes: ArrayBuffer }) {
  return input.contentType.startsWith("text/") ? new TextDecoder().decode(input.bytes).slice(0, 40_000) : "";
}

function cvParsePrompt(input: { filename: string; contentType: string; bytes: ArrayBuffer }, text = cvText(input)) {
  return `Extract the user's jobs and notable projects into separate experience entries.

Rules:
- Create one entry per job or project.
- Use the job title, company, or project name as the entry title.
- Preserve facts from the CV. Do not invent dates, metrics, employers, technologies, or achievements.
- Use Markdown bullet points in content.
- Use kind "job" for employment, "project" for side/personal/open-source projects, and "other" only when neither fits.

Filename: ${input.filename}
Content type: ${input.contentType}
${text ? `\nCV text:\n${text}` : "\nThe CV is a PDF/binary document. Extract text from the attached PDF content."}`;
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
