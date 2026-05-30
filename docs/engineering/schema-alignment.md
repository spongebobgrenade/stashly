# Schema Alignment

Status: Active

---

# 1. Purpose

This document aligns current persisted entities with canonical Memory architecture and current retrieval infrastructure.

It covers:

- canonical Memory persistence
- derived retrieval persistence
- ownership boundaries
- generated type expectations

---

# 2. Authority Chain

Memory Architecture
↓
Database Schema
↓
Generated Types
↓
Runtime Alignment
↓
Implementation

Lower layers must align upward.

---

# 3. Canonical Persistence Entity

Current canonical Memory table:

```text
saves
```

This table owns authoritative Memory persistence.

---

# 4. Canonical Memory Fields

Identity:

```text
id
user_id
```

Input:

```text
original_input
```

Classification:

```text
content_type
source_platform
```

Enrichment:

```text
canonical_url
title
description
thumbnail_url
creator_name
raw_metadata
```

Lifecycle:

```text
processing_status
```

Audit:

```text
created_at
updated_at
```

---

# 5. Derived Retrieval Entity

Current derived retrieval table:

```text
memory_embeddings
```

Purpose:

- persist vector-ready retrieval artifacts derived from Memory
- persist pgvector-backed semantic retrieval artifacts outside canonical Memory

Current observed fields in generated types:

```text
id
memory_id
chunk_index
chunk_text
embedding
provider
model
created_at
updated_at
```

Rules:

- `memory_embeddings` derives from `saves`
- `memory_embeddings` is not canonical Memory truth
- `memory_embeddings` may be regenerated

---

# 6. Ownership Alignment

## Capture Layer

Owns:

```text
original_input
user_id
processing_status = queued
```

## Resolver

Owns:

```text
source_platform
content_type
```

## Extractors

Own:

```text
canonical_url
title
description
thumbnail_url
creator_name
raw_metadata
```

## Processing Layer

Owns:

```text
processing_status
```

and persistence of resolver and extractor outputs into `saves`.

## Embedding Layer

Owns:

```text
chunk_index
chunk_text
embedding
provider
model
```

within `memory_embeddings`.

---

# 7. Lifecycle Alignment

Current canonical Memory lifecycle:

```text
queued
→ processing
→ completed

queued
→ processing
→ failed
```

Save API creates:

```text
queued
```

Metadata worker writes:

```text
processing
completed
failed
```

Embedding generation is downstream of completed Memory enrichment.

It does not create a new base Memory lifecycle state.

---

# 8. Generated Type Alignment

Source:

```text
src/types/database.types.ts
```

Rules:

- generated types mirror current database shape
- generated types do not define semantics
- application Memory types derive from generated types
- derived retrieval tables must also be represented correctly in generated types

---

# 9. Retrieval Alignment

Current Retrieval V1 reads from:

```text
saves
```

Current semantic retrieval foundation writes to:

```text
memory_embeddings
```

Schema alignment rule:

- retrieval indexes and vectors must remain outside base Memory persistence

---

# 10. Current Alignment Status

Aligned:

- `saves` as canonical Memory store
- resolver-owned classification persistence
- extractor-owned enrichment persistence
- `memory_embeddings` as derived retrieval storage in generated types and runtime code

Current repository gap:

- checked-in SQL migrations in `supabase/migrations/` do not yet describe the current `memory_embeddings` table used by generated types and runtime code

This is schema-source drift and must remain visible until migrations catch up.

---

# 11. Review Triggers

Review this document whenever:

- Memory fields change
- derived retrieval entities change
- embedding storage shape changes
- semantic retrieval serving is introduced
- hybrid retrieval is introduced
- generated types are regenerated

Alignment must be maintained continuously.
