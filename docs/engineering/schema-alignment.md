# Schema Alignment

Status: Active

Purpose:

This document aligns:

- Memory Architecture
- Database Schema
- Generated Types
- Runtime Contracts
- Worker Contracts
- Store Contracts

The database schema is the persisted representation of Memory.

Generated types derive from schema.

Runtime derives from generated types.

No layer may independently redefine Memory.

---

# Alignment Authority

Ownership hierarchy:

Memory Architecture
↓
Database Schema
↓
Generated Types
↓
Runtime Alignment
↓
Implementation

Lower layers must align with higher layers.

Drift must be corrected.

Drift must not be accommodated.

---

# Canonical Persistence Entity

Current canonical persistence entity:

```text
saves
```

The table name may change in the future.

The field contract is the authoritative concern.

---

# Canonical Memory Fields

## Identity

```text
id
user_id
```

Purpose:

Memory ownership and identity.

---

## Input

```text
original_input
```

Purpose:

Preserve original captured content.

---

## Classification

```text
content_type
source_platform
```

Purpose:

Memory classification.

Ownership:

Resolver

---

## Enrichment

```text
canonical_url

title
description

thumbnail_url

creator_name

raw_metadata
```

Purpose:

Metadata enrichment.

Ownership:

Extractors

---

## Lifecycle

```text
processing_status
```

Allowed values:

```text
queued
processing
completed
failed
```

Ownership:

Processing Layer

---

## Audit

```text
created_at
updated_at
```

Purpose:

Persistence auditing.

Ownership:

Database

---

# Canonical Lifecycle Alignment

Current lifecycle:

```text
queued
↓
processing
↓
completed
```

Failure path:

```text
queued
↓
processing
↓
failed
```

Rules:

Save API creates:

```text
queued
```

Worker creates:

```text
processing
```

Worker completes:

```text
completed
```

Worker failures write:

```text
failed
```

No additional lifecycle states are currently allowed.

---

# Ownership Alignment

## Capture Layer

Owns:

```text
original_input
user_id
processing_status = queued
```

Implementation:

```text
/api/memories/save
```

---

## Resolver

Owns:

```text
source_platform
content_type
```

Implementation:

```text
platform-resolver.ts
```

Resolver classifications are authoritative.

---

## Extractors

Own:

```text
title
description
thumbnail_url
creator_name
canonical_url
raw_metadata
```

Implementation:

```text
youtube.ts
opengraph.ts
```

Extractors do not own classification.

---

## Worker

Owns:

```text
processing_status
```

and persistence of:

```text
source_platform
content_type

title
description
thumbnail_url
creator_name
canonical_url
raw_metadata
```

Implementation:

```text
metadata-processor.ts
```

Worker may persist fields.

Worker may not redefine ownership.

---

## Synchronization Layer

Owns:

Delivery.

Does not own Memory truth.

Implementation:

```text
Realtime
+
Reconciliation
```

Memory truth remains the database.

---

# Generated Type Alignment

Source:

```text
src/types/database.types.ts
```

Rules:

Generated types:

- mirror schema
- are never manually edited
- are regenerated after schema changes

Generated types are persistence contracts.

Generated types are not semantic contracts.

---

# Application Type Alignment

Source:

```ts
export type Memory = Tables<"saves">;
```

Rules:

Application Memory derives from generated types.

Duplicate Memory entities are forbidden.

Handwritten persistence interfaces are forbidden.

---

# Store Alignment

Implementation:

```text
src/lib/memories/store.ts
```

Current store actions:

```text
initializeMemories()

addOptimisticMemory()

upsertMemory()
```

Rules:

Store state derives from canonical Memory.

Store may create optimistic projections.

Store may not redefine Memory.

---

# Synchronization Alignment

Current transports:

## Realtime

Flow:

Database
↓
Realtime
↓
upsertMemory()

---

## Reconciliation

Flow:

/api/memories/pending
↓
Memory[]
↓
upsertMemory()

---

Rule:

All transports update Memory through:

```text
upsertMemory()
```

No transport may bypass the store.

---

# Search Alignment

Current search:

Keyword Search V1

Search fields:

```text
title
description
creator_name
source_platform
original_input
```

Search derives from canonical Memory.

Search may not introduce parallel memory models.

---

# Extractor Registry Alignment

Implementation:

```text
extractor-registry.ts
```

Current registry entries:

```text
youtube
github
website
unknown
```

Rules:

New platform support enters through registry registration.

Workers must not contain platform-specific branching.

---

# Current Alignment Status

## Aligned

✓ Memory Architecture

✓ Database Schema

✓ Generated Types

✓ Memory Type Definition

✓ Lifecycle Contract

✓ Resolver Ownership

✓ Extractor Ownership

✓ Worker Contract

✓ Synchronization Layer

✓ Search Architecture V1

✓ Optimistic Save Architecture

✓ Extractor Registry

---

## Accepted Runtime Behavior

Current implementation writes:

```text
resolved.contentType
```

directly into:

```text
saves.content_type
```

Examples:

```text
video
short
playlist
repository
article
website
unknown
```

This behavior is accepted.

Future Memory Taxonomy expansion may introduce a mapping layer.

Current implementation remains aligned.

---

## Future Alignment Work

Future systems requiring schema alignment:

- Collections
- Relationships
- Embeddings
- Semantic Retrieval
- Knowledge Graph
- Rediscovery Engine
- AI Retrieval

These systems must derive from canonical Memory.

They may not redefine Memory.

---

# Alignment Review Triggers

Review this document whenever:

- schema changes
- new memory types are introduced
- lifecycle changes
- new extractors are added
- new synchronization transports are added
- retrieval architecture changes
- Memory Architecture changes

Alignment must be maintained continuously.

---

# Last Updated

After:

- Canonical Memory Foundation Lock
- Resolver Ownership Refactor
- Extractor Registry Introduction
- Search Architecture V1
- Synchronization Layer V1

Status:

Aligned