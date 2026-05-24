import { getEnv } from "./env";

export type Profile = {
  full_name: string;
  target_roles: string;
  location: string;
  work_authorisation: string;
  links: string;
};

export type SourceMaterial = {
  cv_text: string;
  achievements_json: string;
  extra_notes: string;
};

export type AppData = {
  profile: Profile;
  sourceMaterial: SourceMaterial;
  experienceEntries: Array<ExperienceEntry>;
  instructions: string;
  documents: Array<DocumentRecord>;
  generations: Array<GenerationRecord>;
};

export type DocumentRecord = {
  id: string;
  kind: string;
  filename: string;
  content_type: string;
  r2_key: string;
  size_bytes: number;
  parse_status: string;
  parse_error: string;
  created_at: string;
};

export type ExperienceEntry = {
  id: string;
  title: string;
  kind: string;
  content: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type GenerationRecord = {
  id: string;
  company_name: string;
  job_url: string;
  job_description: string;
  generated_cv: string;
  generated_cover_letter: string;
  cv_document_id: string | null;
  cover_letter_document_id: string | null;
  model: string;
  created_at: string;
};

const emptyProfile: Profile = {
  full_name: "",
  target_roles: "",
  location: "",
  work_authorisation: "",
  links: ""
};

const emptySourceMaterial: SourceMaterial = {
  cv_text: "",
  achievements_json: "[]",
  extra_notes: ""
};

export async function getAppData(userId: string): Promise<AppData> {
  const db = getEnv().DB;
  await ensureDefaults(userId);

  const profile = await db.prepare("SELECT full_name, target_roles, location, work_authorisation, links FROM profile WHERE user_id = ?").bind(userId).first<Profile>();
  const sourceMaterial = await db.prepare("SELECT cv_text, achievements_json, extra_notes FROM source_material WHERE user_id = ?").bind(userId).first<SourceMaterial>();
  const instruction = await db.prepare("SELECT instructions FROM agent_instruction WHERE user_id = ?").bind(userId).first<{ instructions: string }>();
  const documents = await db.prepare("SELECT id, kind, filename, content_type, r2_key, size_bytes, parse_status, parse_error, created_at FROM document WHERE user_id = ? ORDER BY created_at DESC LIMIT 25").bind(userId).all<DocumentRecord>();
  const experienceEntries = await db.prepare("SELECT id, title, kind, content, sort_order, created_at, updated_at FROM experience_entry WHERE user_id = ? ORDER BY sort_order, created_at").bind(userId).all<ExperienceEntry>();
  const generations = await db.prepare("SELECT id, company_name, job_url, job_description, generated_cv, generated_cover_letter, cv_document_id, cover_letter_document_id, model, created_at FROM job_generation WHERE user_id = ? ORDER BY created_at DESC LIMIT 20").bind(userId).all<GenerationRecord>();

  return {
    profile: profile || emptyProfile,
    sourceMaterial: sourceMaterial || emptySourceMaterial,
    experienceEntries: experienceEntries.results || [],
    instructions: instruction?.instructions || "",
    documents: documents.results || [],
    generations: generations.results || []
  };
}

export async function ensureDefaults(userId: string) {
  const db = getEnv().DB;
  const id = crypto.randomUUID();
  await db.batch([
    db.prepare("INSERT OR IGNORE INTO profile (id, user_id) VALUES (?, ?)").bind(id, userId),
    db.prepare("INSERT OR IGNORE INTO source_material (id, user_id) VALUES (?, ?)").bind(crypto.randomUUID(), userId),
    db.prepare("INSERT OR IGNORE INTO agent_instruction (id, user_id) VALUES (?, ?)").bind(crypto.randomUUID(), userId)
  ]);
}

export async function saveProfile(userId: string, profile: Profile) {
  await ensureDefaults(userId);
  return getEnv().DB.prepare(
    "UPDATE profile SET full_name = ?, target_roles = ?, location = ?, work_authorisation = ?, links = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?"
  )
    .bind(profile.full_name, profile.target_roles, profile.location, profile.work_authorisation, profile.links, userId)
    .run();
}

export async function saveSourceMaterial(userId: string, source: SourceMaterial) {
  await ensureDefaults(userId);
  return getEnv().DB.prepare(
    "UPDATE source_material SET cv_text = ?, achievements_json = ?, extra_notes = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?"
  )
    .bind(source.cv_text, source.achievements_json || "[]", source.extra_notes, userId)
    .run();
}

export async function replaceExperienceEntries(userId: string, entries: Array<Pick<ExperienceEntry, "id" | "title" | "kind" | "content" | "sort_order">>) {
  const db = getEnv().DB;
  const statements = [db.prepare("DELETE FROM experience_entry WHERE user_id = ?").bind(userId)];

  entries.forEach((entry, index) => {
    statements.push(
      db.prepare(
        "INSERT INTO experience_entry (id, user_id, title, kind, content, sort_order) VALUES (?, ?, ?, ?, ?, ?)"
      ).bind(entry.id || crypto.randomUUID(), userId, entry.title || "Untitled entry", entry.kind || "job", entry.content || "", entry.sort_order ?? index)
    );
  });

  await db.batch(statements);
}

export async function appendExperienceEntries(userId: string, entries: Array<Pick<ExperienceEntry, "title" | "kind" | "content">>) {
  if (!entries.length) return;
  const db = getEnv().DB;
  const current = await db.prepare("SELECT COALESCE(MAX(sort_order), -1) AS max_sort_order FROM experience_entry WHERE user_id = ?").bind(userId).first<{ max_sort_order: number }>();
  const start = (current?.max_sort_order ?? -1) + 1;
  await db.batch(
    entries.map((entry, index) =>
      db.prepare("INSERT INTO experience_entry (id, user_id, title, kind, content, sort_order) VALUES (?, ?, ?, ?, ?, ?)")
        .bind(crypto.randomUUID(), userId, entry.title || "Untitled entry", entry.kind || "job", entry.content || "", start + index)
    )
  );
}

export async function saveInstructions(userId: string, instructions: string) {
  await ensureDefaults(userId);
  return getEnv().DB.prepare("UPDATE agent_instruction SET instructions = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?")
    .bind(instructions, userId)
    .run();
}

export async function saveDocument(userId: string, input: Omit<DocumentRecord, "id" | "created_at" | "parse_status" | "parse_error">) {
  const id = crypto.randomUUID();
  await getEnv().DB.prepare(
    "INSERT INTO document (id, user_id, kind, filename, content_type, r2_key, size_bytes) VALUES (?, ?, ?, ?, ?, ?, ?)"
  )
    .bind(id, userId, input.kind, input.filename, input.content_type, input.r2_key, input.size_bytes)
    .run();
  return id;
}

export async function updateDocumentParseStatus(userId: string, documentId: string, status: string, error = "") {
  await getEnv().DB.prepare("UPDATE document SET parse_status = ?, parse_error = ? WHERE id = ? AND user_id = ?")
    .bind(status, error, documentId, userId)
    .run();
}

export async function getDocument(userId: string, documentId: string) {
  return getEnv().DB.prepare("SELECT id, kind, filename, content_type, r2_key, size_bytes, parse_status, parse_error, created_at FROM document WHERE id = ? AND user_id = ?")
    .bind(documentId, userId)
    .first<DocumentRecord>();
}

export async function saveGeneration(userId: string, generation: Omit<GenerationRecord, "id" | "created_at">) {
  const id = crypto.randomUUID();
  await getEnv().DB.prepare(
    "INSERT INTO job_generation (id, user_id, company_name, job_url, job_description, generated_cv, generated_cover_letter, cv_document_id, cover_letter_document_id, model) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  )
    .bind(
      id,
      userId,
      generation.company_name,
      generation.job_url,
      generation.job_description,
      generation.generated_cv,
      generation.generated_cover_letter,
      generation.cv_document_id,
      generation.cover_letter_document_id,
      generation.model
    )
    .run();
  return id;
}
