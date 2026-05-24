ALTER TABLE document ADD COLUMN parse_status TEXT NOT NULL DEFAULT 'not_started';
ALTER TABLE document ADD COLUMN parse_error TEXT NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS experience_entry (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'job',
  content TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS experience_entry_user_id_idx ON experience_entry(user_id);
