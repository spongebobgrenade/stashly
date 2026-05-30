# Stashly TRD

> Version: 4.0
> Status: Active
> Phase: Retrieval Foundation
> Layer: Technical Design

---

# 1. Technical Objective

Build the technical foundation for a Universal AI Memory OS.

The repository is currently validating:

- canonical Memory persistence
- asynchronous enrichment
- synchronization correctness
- Retrieval V1 keyword search
- embedding infrastructure for semantic retrieval

The repository is not yet validating final public product experience.

Public launch requires AI-powered retrieval.

---

# 2. System Principles

- Memory remains canonical.
- Retrieval derives from Memory.
- Embeddings are derived artifacts.
- Retrieval documents are generated views of Memory.
- Heavy processing remains asynchronous.
- Capture must never block on enrichment or embedding generation.
- UI can evolve quickly while architecture remains stable.

---

# 3. Current Runtime Stack

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

# 4. Canonical Entities

## Memory

Current canonical table:

- `saves`

Purpose:

- authoritative user Memory record

## Memory Embedding

Current derived table:

- `memory_embeddings`

Purpose:

- persist semantic retrieval artifacts derived from Memory

Embedding records are not canonical Memory truth.

---

# 5. Current Capture and Processing Flow

```text
User URL
→ Save API
→ saves row created (queued)
→ memory-processing queue
→ metadata worker
→ resolver classification
→ extractor enrichment
→ saves row updated (completed)
→ embedding-processing queue
→ embedding worker
→ retrieval document generation
→ embedding gateway
→ Ollama provider
→ memory_embeddings row created
→ synchronization layer updates UI
```

---

# 6. Memory Processing Architecture

## Capture Layer

Current responsibilities:

- validate input
- create `saves` row
- assign authenticated owner
- initialize `processing_status = queued`
- enqueue metadata processing

## Metadata Processing Layer

Current responsibilities:

- transition `queued -> processing`
- resolve platform and content type
- enrich metadata
- persist canonical Memory fields
- transition `processing -> completed` or `failed`
- enqueue embedding generation

## Synchronization Layer

Current transports:

- realtime updates
- reconciliation polling

Shared contract:

- all state delivery writes through `upsertMemory()`

---

# 7. Retrieval Architecture

## Retrieval V1

Status:

Implemented

Strategy:

- keyword retrieval

Current fields queried:

- `title`
- `description`
- `creator_name`
- `source_platform`
- `original_input`

Implementation:

- `retrieveMemories()`
- `keywordRetrievalStrategy()`

## Retrieval V2

Status:

Foundation implemented

Strategy:

- semantic retrieval using vectors derived from retrieval documents

Current implementation foundation:

- retrieval document builder
- embedding queue
- embedding worker
- embedding gateway
- Ollama provider
- `memory_embeddings`

## Retrieval V3

Status:

Planned

Strategy:

- hybrid keyword + semantic retrieval

## Retrieval V4

Status:

Planned

Strategy:

- AI retrieval
- query understanding
- retrieval planning
- grounded explanation generation

---

# 8. Embedding Architecture V1

## Purpose

Generate semantic retrieval artifacts from canonical Memory without polluting Memory truth.

## Current Components

- `buildRetrievalDocument(memory)`
- `generateEmbedding(text, options?)`
- Ollama provider implementation
- `embedding-processing` queue
- embedding worker
- `memory_embeddings` persistence

## Current Retrieval Document

Built from:

- `title`
- `description`
- `creator_name`

## Current Embedding Provider

Default provider:

- `ollama`

Default model:

- `nomic-embed-text`

## Gateway Rule

Application code calls the embedding gateway, not the provider directly.

This keeps provider selection replaceable over time.

---

# 9. Embedding Storage Rules

Embeddings are stored outside `saves`.

Current embedding row fields include:

- `memory_id`
- `chunk_index`
- `chunk_text`
- `embedding`
- `provider`
- `model`

Implications:

- embeddings may be regenerated
- embeddings may be replaced when models change
- multiple embeddings may exist over time if architecture later supports versioning or chunking

---

# 10. Search and Retrieval UI

Current dashboard validates:

- save flow
- Memory feed
- keyword search
- search empty states
- synchronization behavior

The dashboard is not the final AI retrieval interface.

It is a validation surface for architecture and functionality.

---

# 11. Worker Architecture

## Metadata Worker

Queue:

- `memory-processing`

Responsibilities:

- metadata enrichment
- lifecycle persistence
- embedding job enqueue

## Embedding Worker

Queue:

- `embedding-processing`

Responsibilities:

- fetch completed Memory
- build retrieval document
- generate embedding
- persist to `memory_embeddings`

---

# 12. Security and Isolation

All current retrieval and embedding behavior must remain user-scoped.

Critical rule:

- cross-user retrieval leakage is forbidden
- cross-user vector leakage is forbidden

Embeddings inherit Memory ownership boundaries.

---

# 13. Current Gaps

Not yet implemented:

- vector query path
- semantic retrieval API
- hybrid retrieval fusion
- AI retrieval orchestration
- retrieval explanations
- embedding refresh and invalidation strategy
- embedding deduplication/versioning policy

---

# 14. Launch Readiness Rule

The repository is not launch-ready while retrieval remains keyword-first.

Launch requirement:

```text
AI-powered retrieval must exist before public launch.
```

---

# 15. Summary

Current repository state is:

- Retrieval V1 implemented
- Embedding Architecture V1 implemented
- Semantic retrieval foundation implemented
- Public product experience intentionally deferred until AI retrieval exists
