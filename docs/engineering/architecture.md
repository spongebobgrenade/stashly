# Stashly Engineering Architecture

## Purpose

This document describes the current implemented technical architecture of Stashly.

It reflects repository reality, not aspirational architecture.

---

# System Overview

Stashly is currently validating the foundation of a Universal AI Memory OS.

The implementation includes:

- canonical Memory persistence
- asynchronous metadata enrichment
- synchronization via realtime plus reconciliation
- Retrieval V1 keyword search
- Embedding Architecture V1

The current UI is a validation environment for architecture and functionality.

It is not the final public product interface.

---

# Current Stack

- Next.js 16
- Supabase
- PostgreSQL
- Supabase Realtime
- Redis
- BullMQ
- Zustand
- Dedicated metadata worker
- Dedicated embedding worker
- Ollama embedding provider

---

# High-Level Runtime Flow

```text
User
→ Next.js UI
→ Save API
→ saves
→ memory-processing queue
→ metadata worker
→ saves updated
→ embedding-processing queue
→ embedding worker
→ memory_embeddings
→ synchronization layer
→ Zustand store
→ UI
```

---

# Architectural Principles

## 1. Database Authority

The database is the canonical source of truth.

Client state, realtime events, reconciliation polling, retrieval documents, and embeddings are all derived views or delivery mechanisms.

## 2. Async By Default

Capture never blocks on:

- metadata extraction
- embedding generation
- future retrieval indexing

## 3. Memory Canonicality

`saves` remains canonical Memory.

`memory_embeddings` is derived retrieval infrastructure.

## 4. Transport Independence

Current synchronization uses:

- realtime
- reconciliation polling

Both update the same client store contract.

---

# Frontend Architecture

## Routes

Pages:

- `/`
- `/login`
- `/dashboard`

API:

- `/api/memories/save`
- `/api/memories/pending`
- `/api/search`

Auth callback:

- `/auth/callback`

## Dashboard Validation Surface

Current dashboard validates:

- URL capture
- optimistic save
- Memory feed rendering
- keyword search
- synchronization correctness

Implementation:

- `src/components/dashboard/dashboard-content.tsx`
- `src/components/memory/memory-bootstrap.tsx`

---

# State Management

Library:

- Zustand

Store:

- `src/lib/memories/store.ts`

Current store actions:

- `initializeMemories()`
- `addOptimisticMemory()`
- `upsertMemory()`

All synchronization transports write through `upsertMemory()`.

---

# Synchronization Architecture

## Realtime Transport

Provider:

- Supabase Realtime

Behavior:

- subscribe to `saves`
- filter by authenticated `user_id`
- upsert changed Memory into the store

## Reconciliation Transport

Behavior:

- poll `/api/memories/pending` every 15 seconds
- fetch non-completed current-user memories
- upsert results into the store

Purpose:

- recover missed realtime delivery

---

# Capture and Memory Processing

## Save API

Responsibilities:

- authenticate user
- validate URL
- create `saves` row
- initialize `processing_status = queued`
- enqueue metadata job

Implementation:

- `src/app/api/memories/save/route.ts`

## Metadata Worker

Queue:

- `memory-processing`

Responsibilities:

- set `processing_status = processing`
- resolve classification
- extract metadata enrichment
- persist Memory fields
- set `processing_status = completed` or `failed`
- enqueue embedding job after successful enrichment

Implementation:

- `src/workers/metadata-worker/worker.ts`
- `src/workers/metadata-worker/metadata-processor.ts`

---

# Metadata Architecture

## Resolver Ownership

Resolver owns:

- `platform`
- `contentType`
- `normalizedUrl`
- `identifier`

Implementation:

- `platform-resolver.ts`

## Extractor Registry

Current registry entries:

- `youtube`
- `github`
- `website`
- `unknown`

Implementation:

- `extractor-registry.ts`

## Extractor Ownership

Extractors return enrichment only:

- `title`
- `description`
- `thumbnailUrl`
- `creatorName`
- `canonicalUrl`
- `rawMetadata`

Current extractors:

- YouTube extractor
- OpenGraph extractor

---

# Retrieval Architecture

## Retrieval V1

Implemented strategy:

- keyword retrieval

Implementation:

- `retrieveMemories()`
- `keywordRetrievalStrategy()`

Current search fields:

- `title`
- `description`
- `creator_name`
- `source_platform`
- `original_input`

## Retrieval V2 Foundation

Implemented infrastructure:

- retrieval document builder
- embedding queue
- embedding worker
- embedding gateway
- Ollama provider
- `memory_embeddings`

Not yet implemented:

- semantic query path

---

# Embedding Architecture V1

## Queue

- `embedding-processing`

## Worker

- `src/workers/embedding-worker/worker.ts`
- `src/workers/embedding-worker/embedding-processor.ts`

## Retrieval Document Generation

Current implementation:

- `buildRetrievalDocument(memory)`

Current fields used:

- `title`
- `description`
- `creator_name`

## Gateway

Current abstraction:

- `generateEmbedding(text, options?)`

Purpose:

- keep provider calls behind a stable gateway

## Provider

Current default provider:

- Ollama

Current model:

- `nomic-embed-text`

## Persistence

Embeddings are written to:

- `memory_embeddings`

Storage model:

- pgvector-backed embedding storage contract in the current Supabase schema/runtime

with fields:

- `memory_id`
- `chunk_index`
- `chunk_text`
- `embedding`
- `provider`
- `model`

---

# Queue Architecture

Current queues:

- `memory-processing`
- `embedding-processing`

Current broker:

- Redis via `ioredis`

Current job payloads:

Memory job:

- `memoryId`
- `url`
- `userId`

Embedding job:

- `memoryId`

---

# Development Runtime

Current scripts:

- `npm run dev`
- `npm run worker`
- `npm run embedding-worker`
- `npm run dev:all`

The current repository expects three active runtime processes for full local behavior:

- Next.js app
- metadata worker
- embedding worker

---

# Current Known Architectural Gap

The repository now generates embeddings, but current user search still routes only through Retrieval V1 keyword search.

So the architecture has:

- semantic retrieval infrastructure

but not yet:

- semantic retrieval serving path

---

# Scaling Direction

Current architecture is appropriate for:

- early retrieval validation
- architecture proving
- pre-launch iteration

Future scale work will likely focus on:

- queue observability
- worker retry strategy
- embedding lifecycle management
- semantic retrieval serving
- hybrid retrieval fusion
- AI retrieval
