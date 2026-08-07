-- signpost owned subscriber list (single opt-in) + durable rate limiter.
CREATE TABLE IF NOT EXISTS subscribers (
  id              TEXT PRIMARY KEY,
  email           TEXT NOT NULL,
  email_lower     TEXT NOT NULL UNIQUE,
  referrer        TEXT,
  utm_source      TEXT,
  created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  unsubscribed_at TEXT,
  suppressed_at   TEXT,
  mirrored_at     TEXT
);
CREATE INDEX IF NOT EXISTS ix_subscribers_unmirrored ON subscribers (created_at) WHERE mirrored_at IS NULL;

CREATE TABLE IF NOT EXISTS rate_limit (
  bucket_key   TEXT PRIMARY KEY,
  count        INTEGER NOT NULL,
  window_start INTEGER NOT NULL
);
