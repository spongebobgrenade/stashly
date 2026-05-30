# Runtime Alignment

> Product: Stashly  
> Type: Engineering Governance Document  
> Status: Active  
> Layer: Engineering  
> Authority: Memory Architecture → Runtime Alignment → Implementation

---

# 1. Purpose

This document prevents runtime drift between:

- Memory Architecture
- Database Schema
- Generated Types
- APIs
- Workers
- Synchronization Layer
- Retrieval Layer
- Client State

Memory Architecture defines Memory semantics.

Runtime Alignment defines how those semantics are implemented in code.

Implementation must align with Runtime Alignment.

---

# 2. Authority Chain

The authoritative ownership chain is:

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

Rules:

If implementation conflicts with Runtime Alignment:

Implementation changes.

If Runtime Alignment conflicts with Memory Architecture:

Runtime Alignment changes.

Memory Architecture remains authoritative.

---

# 3. Canonical Memory Ownership

The canonical Memory entity is defined by:

docs/product/Memory-Architecture.md

No implementation layer may redefine:

- Memory identity
- Memory ownership
- Memory lifecycle
- Memory trust boundaries
- Memory semantics

Memory Architecture owns those definitions.

---

# 4. Canonical Persistence Layer

The database is the persisted representation of Memory.

Current canonical Memory columns:

- id
- user_id
- original_input
- content_type
- source_platform
- canonical_url
- title
- description
- thumbnail_url
- creator_name
- raw_metadata
- processing_status
- created_at
- updated_at

Columns outside Memory Architecture constitute schema drift.

Schema drift must be corrected.

---

# 5. Generated Type Rules

Source:

src/types/database.types.ts

Rules:

- Generated types mirror database schema.
- Generated types are never manually edited.
- Regenerate after schema changes.
- Generated types do not define Memory semantics.

Generated types represent persistence structure only.

---

# 6. Canonical Application Memory Type

Source:

src/types/memory.ts

Current rule:

```ts
export type Memory = Tables<"saves">;
```

Rules:

- Memory derives from generated database types.
- No duplicate Memory definitions.
- No handwritten Memory entities.

Database truth remains authoritative.

---

# 7. Processing Lifecycle Ownership

Canonical lifecycle:

queued
→ processing
→ completed

queued
→ processing
→ failed

Ownership:

Processing Layer

Responsibilities:

- lifecycle transitions
- lifecycle persistence

UI may display lifecycle state.

UI may not redefine lifecycle semantics.

Retrieval may read lifecycle state.

Retrieval may not redefine lifecycle semantics.

---

# 8. Capture Layer Contract

Capture Layer responsibilities:

- validate input
- preserve original_input
- assign owner
- create memory
- enqueue processing

Current initial state:

```text
processing_status = queued
```

Capture Layer does not own enrichment.

Capture Layer does not own lifecycle completion.

---

# 9. Worker Contract

Worker responsibilities:

- transition queued → processing
- perform enrichment
- persist metadata
- transition processing → completed
- transition processing → failed

Worker may write:

- source_platform
- content_type
- canonical_url
- title
- description
- thumbnail_url
- creator_name
- raw_metadata
- processing_status

Worker may not redefine Memory semantics.

Worker may not bypass resolver ownership.

---

# 10. Resolver Ownership Rules

Resolver owns classification.

Implementation:

platform-resolver.ts

Resolver owns:

- platform
- contentType
- normalizedUrl
- identifier

Resolver classification is authoritative.

No downstream component may override classification.

---

# 11. Extractor Ownership Rules

Extractors own enrichment only.

Extractors may produce:

- title
- description
- thumbnailUrl
- creatorName
- canonicalUrl
- rawMetadata

Extractors must not produce:

- sourcePlatform
- contentType

Classification ownership belongs to the Resolver.

---

# 12. Extractor Registry Rules

Implementation:

extractor-registry.ts

Registry owns extractor selection.

Current supported registry entries:

- youtube
- github
- website
- unknown

New platform support must be added through registry registration.

Avoid switch-statement growth.

Avoid platform detection inside workers.

---

# 13. Synchronization Layer Contract

Synchronization owns Memory delivery.

Synchronization does not own Memory truth.

Memory truth remains the database.

Current transports:

## Realtime Transport

Responsibilities:

- subscribe to memory updates
- receive database changes
- deliver updates to store

Flow:

Database
↓
Realtime
↓
upsertMemory()

---

## Reconciliation Transport

Responsibilities:

- recover missed updates
- maintain client consistency

Current implementation:

15-second polling

Flow:

/api/memories/pending
↓
Memory[]
↓
upsertMemory()

---

## Synchronization Rule

All transports must update state through:

```ts
upsertMemory()
```

UI must not require transport-specific logic.

Future transports:

- Mobile Sync
- Extension Sync
- Offline Recovery
- Multi-Device Synchronization

must follow the same contract.

---

# 14. State Ownership Rules

Capture Layer owns:

- creation

Processing Layer owns:

- lifecycle transitions
- enrichment

Synchronization Layer owns:

- state delivery

Retrieval Layer owns:

- retrieval logic

UI Layer owns:

- presentation

No layer owns Memory semantics except Memory Architecture.

---

# 15. Store Ownership Rules

Implementation:

src/lib/memories/store.ts

Store responsibilities:

- memory cache
- optimistic insertion
- state updates

Canonical store actions:

initializeMemories()

addOptimisticMemory()

upsertMemory()

All runtime transports must use:

```ts
upsertMemory()
```

for Memory updates.

---

# 16. Search Alignment Rules

Current search:

Keyword Search V1

Implementation:

- SearchBar
- useSearch()
- /api/search
- SearchResults

Current retrieval strategy:

ILIKE matching across:

- title
- description
- creator_name
- source_platform
- original_input

Future retrieval systems:

- semantic search
- embeddings
- relationships
- rediscovery

must derive from canonical Memory.

They may not redefine Memory.

---

# 17. Schema Drift Rules

The following indicate schema drift:

- schema fields not present in Memory Architecture
- application types differing from generated types
- workers writing undeclared fields
- extractors owning classification
- transport layers bypassing upsertMemory()
- UI requiring undeclared Memory fields

Drift must be corrected immediately.

Do not build around drift.

Align the system.

---

# 18. Deferred Architecture Decisions

## RA-001: Memory Taxonomy Expansion

Status:

Deferred

Current behavior:

Resolver classifications are written directly into:

```text
saves.content_type
```

Examples:

- video
- short
- playlist
- repository
- article
- website

Reason:

Current taxonomy is sufficient for MVP.

Future Memory Architecture may introduce:

- note
- image
- screenshot
- pdf
- file
- audio

At that point a dedicated mapping layer may be required.

---

## RA-002: Attribution Model Expansion

Status:

Deferred

Current behavior:

```text
og:site_name
↓
creator_name
```

Known limitation:

Publisher and creator are not always the same entity.

Future model may separate:

- creator_name
- publisher_name
- platform_name

---

## RA-003: Synchronization Optimization

Status:

Deferred

Current behavior:

Reconciliation polls every 15 seconds.

Reason:

Simple and reliable.

Future architecture:

State-aware synchronization.

Example:

Pending Memories Exist
↓
Polling Enabled

No Pending Memories
↓
Polling Disabled

This optimization is intentionally deferred.

---

# 19. Local Development Requirements

Terminal 1:

```bash
npm run dev
```

Terminal 2:

```bash
npm run worker
```

Worker is mandatory.

Without worker:

- memories remain queued
- enrichment never occurs
- metadata never appears
- synchronization receives no lifecycle updates

---

# 20. Current Alignment Status

Aligned:

✓ Memory Architecture

✓ Database Schema

✓ Generated Types

✓ Worker Contract

✓ Resolver Ownership

✓ Extractor Ownership

✓ Extractor Registry

✓ Synchronization Layer

✓ Search Architecture V1

✓ Optimistic Save Architecture

Remaining Future Work:

- Platform Expansion
- Memory Taxonomy Expansion
- Semantic Retrieval
- Embeddings
- Knowledge Graph
- Relationships
- Rediscovery
- AI Retrieval

These systems must build on canonical Memory rather than redefine it.