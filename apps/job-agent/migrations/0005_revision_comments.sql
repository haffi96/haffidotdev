CREATE TABLE IF NOT EXISTS job_application_session (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL DEFAULT '',
  job_url TEXT NOT NULL DEFAULT '',
  job_description TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE job_generation ADD COLUMN session_id TEXT REFERENCES job_application_session(id) ON DELETE CASCADE;
ALTER TABLE job_generation ADD COLUMN revision_number INTEGER NOT NULL DEFAULT 1;
ALTER TABLE job_generation ADD COLUMN parent_generation_id TEXT REFERENCES job_generation(id) ON DELETE SET NULL;

INSERT INTO job_application_session (id, user_id, company_name, job_url, job_description, created_at, updated_at)
SELECT id, user_id, company_name, job_url, job_description, created_at, created_at
FROM job_generation
WHERE session_id IS NULL;

UPDATE job_generation
SET session_id = id,
    revision_number = 1
WHERE session_id IS NULL;

CREATE TABLE IF NOT EXISTS generation_comment (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  generation_id TEXT NOT NULL REFERENCES job_generation(id) ON DELETE CASCADE,
  document_kind TEXT NOT NULL CHECK (document_kind IN ('cv', 'cover_letter')),
  anchor_text TEXT NOT NULL DEFAULT '',
  comment_text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
  resolved_by_generation_id TEXT REFERENCES job_generation(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at TEXT
);

CREATE INDEX IF NOT EXISTS job_application_session_user_id_idx ON job_application_session(user_id);
CREATE INDEX IF NOT EXISTS job_generation_session_id_idx ON job_generation(session_id);
CREATE INDEX IF NOT EXISTS generation_comment_generation_id_idx ON generation_comment(generation_id);
CREATE INDEX IF NOT EXISTS generation_comment_user_id_status_idx ON generation_comment(user_id, status);
