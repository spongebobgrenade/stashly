# Runtime Alignment

> Status: Active  
> Authority: Memory Architecture -> Runtime Alignment -> Implementation

---

# 1. Purpose

This document records how canonical Memory semantics are implemented in the repository.

It prevents drift between:

- Memory Architecture
- TRD
- database schema and generated types
- API contracts
- workers
- synchronization
- retrieval
- embeddings

---

# 2. Authority Chain

Philosophy
↓
PRD
↓
Memory Architecture
↓
TRD
↓
Runtime Alignment
↓
Implementation

If implementation conflicts with this document, implementation changes.

If this document conflicts with Memory Architecture, this document changes.

---

# 3. Canonical Memory Type

Source:

- `src/types/memory.ts`

Current rule:

```ts
export type Memory = Tables<"saves">;
```

Memory derives from generated database types.

No handwritten canonical Memory entity is allowed.

---

# 4. Canonical Persistence

Current canonical Memory table:

- `saves`

Canonical Memory columns:

- `id`
- `user_id`
- `original_input`
- `content_type`
- `source_platform`
- `canonical_url`
- `title`
- `description`
- `thumbnail_url`
- `creator_name`
- `raw_metadata`
- `processing_status`
- `created_at`
- `updated_at`

---

# 5. Derived Retrieval Persistence

Current derived retrieval table:

- `memory_embeddings`

Purpose:

- store semantic retrieval artifacts derived from Memory
- store pgvector-backed embedding data outside canonical Memory

Current derived embedding columns observed in generated types:

- `id`
- `memory_id`
- `chunk_index`
- `chunk_text`
- `embedding`
- `provider`
- `model`
- `created_at`
- `updated_at`

Alignment rule:

- `memory_embeddings` is not canonical Memory persistence
- embeddings may be regenerated or replaced

---

# 6. Capture Contract

Capture layer responsibilities:

- validate input
- authenticate user
- create Memory row
- preserve `original_input`
- assign `user_id`
- initialize `processing_status = queued`
- enqueue metadata processing

Capture does not own:

- metadata enrichment
- embedding generation
- retrieval scoring

---

# 7. Metadata Worker Contract

Metadata worker responsibilities:

- `queued -> processing`
- resolver classification
- extractor enrichment
- persist Memory fields
- `processing -> completed` or `failed`
- enqueue embedding job after successful completion

Worker may persist:

- `source_platform`
- `content_type`
- `canonical_url`
- `title`
- `description`
- `thumbnail_url`
- `creator_name`
- `raw_metadata`
- `processing_status`

---

# 8. Resolver Ownership

Resolver owns:

- `platform`
- `contentType`
- `normalizedUrl`
- `identifier`

Classification ownership is authoritative at the resolver layer.

No extractor may override it.

No worker may invent alternative classification.

---

# 9. Extractor Ownership

Extractors own enrichment only.

Allowed extractor outputs:

- `title`
- `description`
- `thumbnailUrl`
- `creatorName`
- `canonicalUrl`
- `rawMetadata`

Forbidden extractor outputs:

- `sourcePlatform`
- `contentType`

---

# 10. Embedding Worker Contract

Embedding worker responsibilities:

- fetch completed Memory
- build retrieval document from Memory
- generate embedding through the gateway
- persist derived row into `memory_embeddings`

Embedding worker does not own:

- Memory truth
- Memory lifecycle semantics
- canonical metadata fields

---

# 11. Retrieval Document Rule

Retrieval documents are generated views of Memory.

Current implementation builds them from:

- `title`
- `description`
- `creator_name`

Alignment rule:

- retrieval documents derive from Memory
- retrieval documents must not replace Memory truth

---

# 12. Embedding Gateway Rule

Application code calls the embedding gateway.

Current implementation:

- `generateEmbedding(text, options?)`

Current provider:

- `ollama`

Alignment rule:

- provider selection is an infrastructure concern
- application layers should not couple directly to provider-specific APIs

---

# 13. Synchronization Contract

Current transports:

- realtime
- reconciliation polling

Both transports must update state through:

```ts
upsertMemory()
```

Synchronization owns delivery.

Synchronization does not own Memory truth.

---

# 14. Retrieval Alignment

Current user-serving retrieval:

- Retrieval V1 keyword search

Current API path:

```text
/api/search
→ retrieveMemories()
→ keywordRetrievalStrategy()
```

Current query fields:

- `title`
- `description`
- `creator_name`
- `source_platform`
- `original_input`

Current semantic retrieval status:

- embedding foundation exists
- no semantic query-serving path yet

---

# 15. Local Development Requirements

Current local runtime processes:

```bash
npm run dev
npm run worker
npm run embedding-worker
```

Optional combined script:

```bash
npm run dev:all
```

Without the metadata worker:

- memories remain queued or incomplete

Without the embedding worker:

- `memory_embeddings` is not populated
- semantic retrieval foundation is incomplete

---

# 16. Accepted Current Behavior

Accepted current runtime behavior:

- resolver classifications are written directly to `saves.content_type` and `saves.source_platform`
- metadata completion triggers embedding queueing
- embeddings are stored outside canonical Memory
- search remains keyword-first while semantic foundations are still being built

---

# 17. Current Alignment Status

Aligned:

- canonical Memory persistence
- generated Memory typing
- resolver-owned classification
- extractor-owned enrichment
- synchronization contract
- Retrieval V1
- Embedding Architecture V1 as a derived layer

Not yet complete:

- semantic retrieval serving path
- hybrid retrieval
- AI retrieval
- embedding lifecycle management

These systems must continue to derive from Memory rather than redefine it.
