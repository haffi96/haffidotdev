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

export type GenerationComment = {
  id: string;
  generation_id: string;
  document_kind: "cv" | "cover_letter";
  anchor_text: string;
  comment_text: string;
  status: "open" | "resolved";
  resolved_by_generation_id: string | null;
  created_at: string;
  resolved_at: string | null;
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
  session_id: string | null;
  revision_number: number;
  parent_generation_id: string | null;
  company_name: string;
  job_url: string;
  job_description: string;
  generated_cv: string;
  generated_cover_letter: string;
  cv_document_id: string | null;
  cover_letter_document_id: string | null;
  model: string;
  created_at: string;
  comments: Array<GenerationComment>;
};

type GenerationRow = Omit<GenerationRecord, "comments">;

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
  const generations = await db.prepare("SELECT id, session_id, revision_number, parent_generation_id, company_name, job_url, job_description, generated_cv, generated_cover_letter, cv_document_id, cover_letter_document_id, model, created_at FROM job_generation WHERE user_id = ? ORDER BY created_at DESC LIMIT 50").bind(userId).all<GenerationRow>();
  const comments = await db.prepare("SELECT id, generation_id, document_kind, anchor_text, comment_text, status, resolved_by_generation_id, created_at, resolved_at FROM generation_comment WHERE user_id = ? ORDER BY created_at").bind(userId).all<GenerationComment>();

  return {
    profile: profile || emptyProfile,
    sourceMaterial: sourceMaterial || emptySourceMaterial,
    experienceEntries: experienceEntries.results || [],
    instructions: instruction?.instructions || "",
    documents: documents.results || [],
    generations: attachComments(generations.results || [], comments.results || [])
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

export async function createApplicationSession(userId: string, input: { company_name: string; job_url: string; job_description: string }) {
  const id = crypto.randomUUID();
  await getEnv().DB.prepare(
    "INSERT INTO job_application_session (id, user_id, company_name, job_url, job_description) VALUES (?, ?, ?, ?, ?)"
  )
    .bind(id, userId, input.company_name, input.job_url, input.job_description)
    .run();
  return id;
}

export async function saveGeneration(userId: string, generation: Omit<GenerationRow, "id" | "created_at">) {
  const id = crypto.randomUUID();
  await getEnv().DB.prepare(
    "INSERT INTO job_generation (id, user_id, session_id, revision_number, parent_generation_id, company_name, job_url, job_description, generated_cv, generated_cover_letter, cv_document_id, cover_letter_document_id, model) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  )
    .bind(
      id,
      userId,
      generation.session_id,
      generation.revision_number,
      generation.parent_generation_id,
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

export async function getGeneration(userId: string, generationId: string) {
  const row = await getEnv().DB.prepare("SELECT id, session_id, revision_number, parent_generation_id, company_name, job_url, job_description, generated_cv, generated_cover_letter, cv_document_id, cover_letter_document_id, model, created_at FROM job_generation WHERE id = ? AND user_id = ?")
    .bind(generationId, userId)
    .first<GenerationRow>();
  if (!row) return null;

  const comments = await getEnv().DB.prepare("SELECT id, generation_id, document_kind, anchor_text, comment_text, status, resolved_by_generation_id, created_at, resolved_at FROM generation_comment WHERE generation_id = ? AND user_id = ? ORDER BY created_at")
    .bind(generationId, userId)
    .all<GenerationComment>();
  return { ...row, comments: comments.results || [] };
}

export async function getOpenGenerationComments(userId: string, generationId: string) {
  const comments = await getEnv().DB.prepare("SELECT id, generation_id, document_kind, anchor_text, comment_text, status, resolved_by_generation_id, created_at, resolved_at FROM generation_comment WHERE generation_id = ? AND user_id = ? AND status = 'open' ORDER BY created_at")
    .bind(generationId, userId)
    .all<GenerationComment>();
  return comments.results || [];
}

export async function getNextRevisionNumber(userId: string, sessionId: string) {
  const row = await getEnv().DB.prepare("SELECT COALESCE(MAX(revision_number), 0) + 1 AS next_revision_number FROM job_generation WHERE user_id = ? AND session_id = ?")
    .bind(userId, sessionId)
    .first<{ next_revision_number: number }>();
  return row?.next_revision_number || 1;
}

export async function saveGenerationComment(userId: string, input: Pick<GenerationComment, "generation_id" | "document_kind" | "anchor_text" | "comment_text">) {
  const id = crypto.randomUUID();
  await getEnv().DB.prepare(
    "INSERT INTO generation_comment (id, user_id, generation_id, document_kind, anchor_text, comment_text) VALUES (?, ?, ?, ?, ?, ?)"
  )
    .bind(id, userId, input.generation_id, input.document_kind, input.anchor_text, input.comment_text)
    .run();
  return id;
}

export async function resolveGenerationComments(userId: string, generationId: string, resolvedByGenerationId: string) {
  await getEnv().DB.prepare("UPDATE generation_comment SET status = 'resolved', resolved_by_generation_id = ?, resolved_at = CURRENT_TIMESTAMP WHERE generation_id = ? AND user_id = ? AND status = 'open'")
    .bind(resolvedByGenerationId, generationId, userId)
    .run();
}

function attachComments(generations: Array<GenerationRow>, comments: Array<GenerationComment>) {
  return generations.map((generation) => ({
    ...generation,
    comments: comments.filter((comment) => comment.generation_id === generation.id)
  }));
}
