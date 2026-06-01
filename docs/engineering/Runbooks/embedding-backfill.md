# Embedding Backfill Runbook

## Purpose

Generate embeddings for memories created before the embedding system existed.

## Preconditions

- Redis worker running
- Ollama running
- nomic-embed-text installed
- Supabase credentials configured

## Execute
npm run backfill:embedding