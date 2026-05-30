# Stashly Engineering Decision Log

Status: Active

---

# Decision Record Purpose

This document records accepted architectural decisions that materially shape the repository.

It preserves:

- what was decided
- why it was decided
- what current implementation now reflects

---

# Historical Accepted Decisions

## 2026-05-24: Asynchronous Metadata Enrichment

Status:

Accepted

Reason:

Metadata extraction is too slow for request-response UX.

Repository effect:

- capture returns immediately
- enrichment happens in a worker

## 2026-05-24: BullMQ + Redis

Status:

Accepted

Reason:

Dedicated queues were required for asynchronous processing.

Repository effect:

- `memory-processing`
- `embedding-processing`

## 2026-05-24: Supabase As Primary Backend

Status:

Accepted

Repository effect:

- PostgreSQL
- Auth
- Realtime

## 2026-05-24: Zustand For Client State

Status:

Accepted

Repository effect:

- central client Memory store
- shared synchronization update path

## 2026-05-25: Optimistic Memory Creation

Status:

Accepted

Repository effect:

- immediate placeholder memory before enrichment finishes

## 2026-05-25: Database As Source Of Truth

Status:

Accepted

Repository effect:

- realtime and reconciliation are delivery layers only

## 2026-05-25: Realtime As Primary Update Transport

Status:

Accepted

Repository effect:

- realtime subscription is primary
- reconciliation is safety net

## 2026-05-25: Reconciliation Safety Layer

Status:

Accepted

Repository effect:

- polling `/api/memories/pending`

## 2026-05-29: Canonical Memory Foundation Locked

Status:

Accepted

Repository effect:

- Memory semantics derive downward into schema, types, workers, and retrieval systems

---

# ADR-001: Memory Type Source Of Truth

Status:

Accepted

Date:

2026-05-30

Decision:

Memory derives from generated Supabase types.

```ts
export type Memory = Tables<"saves">;
```

Consequence:

- schema changes require type regeneration

---

# ADR-002: Worker Runtime Separation

Status:

Accepted

Date:

2026-05-30

Decision:

Asynchronous processing runs in dedicated worker processes outside the Next.js runtime.

Current implementation:

- metadata worker
- embedding worker

Consequence:

- local dev requires multiple processes
- worker observability matters

---

# ADR-003: Optimistic Save Architecture

Status:

Accepted

Date:

2026-05-30

Decision:

Users receive immediate visual confirmation before background processing finishes.

Consequence:

- queued and processing states are first-class

---

# ADR-004: Provider-Agnostic AI And Embedding Gateway Strategy

Status:

Accepted

Date:

2026-05-30, updated 2026-05-30 implementation alignment pass

Decision:

Provider-facing AI and embedding calls should be hidden behind gateway abstractions rather than spread through application logic.

Current implementation:

- embedding gateway abstraction exists
- current default embedding provider is Ollama

Future intent remains:

- provider replaceability
- model replaceability
- capability-driven selection

Consequence:

- application code calls the gateway, not provider-specific APIs directly

---

# ADR-005: Synchronization Layer Architecture

Status:

Accepted

Date:

2026-05-30

Decision:

Memory delivery is owned by a synchronization layer with replaceable transports.

Current transports:

- realtime
- reconciliation polling

Shared contract:

- `upsertMemory()`

---

# ADR-006: Resolver Owns Classification

Status:

Accepted

Date:

2026-05-30

Decision:

Resolver exclusively owns:

- platform
- contentType
- normalizedUrl
- identifier

Consequence:

- worker persists resolver classification directly

---

# ADR-007: Extractor Registry Architecture

Status:

Accepted

Date:

2026-05-30

Decision:

Extractor selection is registry-owned, not worker-owned and not implemented through unbounded switch growth.

Current registry entries:

- youtube
- github
- website
- unknown

---

# ADR-008: Embeddings Are Derived Retrieval Artifacts

Status:

Accepted

Date:

2026-05-30

Decision:

Embeddings are stored outside canonical Memory and are derived from Memory through retrieval document generation.

Current implementation:

- `buildRetrievalDocument(memory)`
- embedding queue
- embedding worker
- `memory_embeddings`

Consequence:

- embeddings may be regenerated
- Memory remains canonical

---

# ADR-009: Retrieval Layer Phasing

Status:

Accepted

Date:

2026-05-30

Decision:

Retrieval evolves in stages rather than jumping directly to AI retrieval.

Current staged model:

- Retrieval V1 = keyword retrieval
- Retrieval V2 = semantic retrieval
- Retrieval V3 = hybrid retrieval
- Retrieval V4 = AI retrieval

Current repository state:

- V1 implemented
- V2 foundation implemented

Consequence:

- current UI is a validation environment, not the final public retrieval product

---

# Future Decisions Pending

- semantic retrieval serving architecture
- hybrid retrieval fusion strategy
- AI retrieval orchestration
- embedding lifecycle management
- vector query strategy details
- relationship graph architecture
- rediscovery engine architecture

---

# Last Updated

After:

- Search V1
- Synchronization V1
- Embedding Architecture V1
- retrieval document generation
- Ollama embedding provider
