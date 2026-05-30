CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS memory_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  memory_id UUID NOT NULL
    REFERENCES saves(id)
    ON DELETE CASCADE,

  chunk_index INTEGER NOT NULL,

  chunk_text TEXT NOT NULL,

  embedding VECTOR(768),

  provider TEXT NOT NULL,

  model TEXT NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_memory_embeddings_memory_id
ON memory_embeddings(memory_id);

CREATE INDEX IF NOT EXISTS idx_memory_embeddings_chunk_index
ON memory_embeddings(chunk_index);