# Runtime Alignment

> Product: Stashly  
> Type: Engineering Governance Document  
> Status: Active  
> Layer: Engineering  
> Authority: Memory Architecture -> Runtime Alignment -> Implementation

---

# 1. Purpose

This document exists to prevent runtime drift between:

- Memory Architecture
- Database Schema
- Generated Types
- Application Types
- Workers
- APIs
- Client State

The Memory Architecture defines Memory truth.

Runtime systems must align with that truth.

This document records how Memory Architecture is implemented in code.

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

If implementation conflicts with Runtime Alignment:

Implementation changes.

If Runtime Alignment conflicts with Memory Architecture:

Runtime Alignment changes.

Memory Architecture remains authoritative for Memory semantics.

---

# 3. Canonical Memory Ownership

The canonical Memory entity is defined by:

docs/product/Memory-Architecture.md

No implementation layer may redefine:

- Memory identity
- Memory ownership
- Memory lifecycle
- Memory field meaning
- Memory trust boundaries

---

# 4. Canonical Persistence Layer

The database schema is the persisted representation of Memory.

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

Columns outside the canonical Memory Architecture are considered schema drift.

---

# 5. Generated Type Rules

Generated database types must always mirror the database schema.

Source:

src/types/database.types.ts

Rules:

- Never manually edit generated types.
- Regenerate after schema changes.
- Application Memory types derive from generated types.
- Generated types do not define Memory semantics.

---

# 6. Canonical Application Memory Type

Source:

src/types/memory.ts

Current rule:

```ts
export type Memory = Tables<"saves">;
```

Application Memory types derive from database truth.

No duplicate handwritten Memory entity definitions are allowed.

---

# 7. Processing Lifecycle Ownership

Canonical lifecycle:

queued
→ processing
→ completed

queued
→ processing
→ failed

Lifecycle ownership belongs to the processing layer.

UI may display lifecycle state.

UI may not redefine lifecycle meaning.

Retrieval may read lifecycle state.

Retrieval may not redefine lifecycle meaning.

---

# 8. Save Flow Contract

Capture Layer responsibilities:

- create Memory
- preserve original_input
- assign owner
- enqueue processing

Current initial state:

processing_status = queued

The Save Layer does not own enrichment completion.

---

# 9. Worker Contract

Processing Layer responsibilities:

- transition queued → processing
- enrich metadata
- update canonical fields
- transition processing → completed
- transition processing → failed

Worker may write:

- source_platform
- canonical_url
- title
- description
- thumbnail_url
- creator_name
- raw_metadata
- processing_status

Worker may not redefine Memory semantics.

---

# 10. State Ownership Rules

Capture Layer owns:

- creation

Processing Layer owns:

- lifecycle transitions

Retrieval Layer owns:

- retrieval logic

UI Layer owns:

- presentation

No layer owns Memory semantics except Memory Architecture.

---

# 11. Schema Drift Rules

The following indicate schema drift:

- columns existing in schema but not Memory Architecture
- application types differing from generated types
- workers writing undeclared Memory fields
- UI requiring fields absent from canonical Memory

Schema drift must be corrected immediately.

Do not build around drift.

Do not patch around drift.

Align the system instead.

---

# 12. Deferred Architecture Decisions

## Memory Type Mapping Layer

Status:

Deferred

Reason:

Resolver taxonomy and Memory taxonomy intentionally differ.

Resolver content types:

- video
- short
- playlist
- repository
- article
- website
- unknown

Canonical Memory content types:

- link
- note
- image
- screenshot
- pdf
- file
- text
- audio
- video

Decision:

Resolver content types must never be written directly into Memory.

A dedicated Memory Type Mapping Layer will be introduced when non-link memory capture begins.

Planned mapping:

video → video

short → video

playlist → video

repository → link

article → link

website → link

unknown → link

Owner:

Memory Architecture

---

# 13. Future Alignment Rules

Whenever a future architectural decision is intentionally deferred:

Either:

1. implement it immediately

or

2. document it here

No architectural decision may exist only in chat history.

This document exists to preserve alignment across:

- new chats
- future contributors
- future Codex runs
- future implementation phases

---

# 14. Current Alignment Status

Aligned:

- Memory Architecture
- Database Schema
- Generated Types
- Worker Metadata Contract
- Canonical Metadata Fields

Remaining Future Work:

- Memory Type Mapping Layer
- Retrieval Architecture
- Search Architecture
- Relationship Architecture
- Rediscovery Architecture

These systems must derive from Memory rather than redefine it.

## Deferred UI Optimization

### Next.js Image Migration

Status: Deferred

File:
- src/components/memory-card.tsx

Reason:
- Does not affect Memory Architecture
- Does not affect persistence correctness
- Does not affect retrieval correctness
- Does not affect async processing lifecycle

May be addressed during UI optimization phase.

## Thumbnail Rendering Decision

Stashly V1 uses:

<Image unoptimized />

Reason:
- Memory thumbnails originate from arbitrary OpenGraph sources.
- Maintaining a growing Next.js image-domain allowlist creates operational overhead and causes Memory cards to fail when new domains appear.
- Thumbnail optimization may be reintroduced in a future dedicated Media Pipeline.
- V1 prioritizes Memory reliability over image optimization.

## UI Performance Backlog

### Next.js Image LCP Warning

Observed:

Image was detected as Largest Contentful Paint (LCP).
Please add loading="eager".

Decision:

No action in Stashly V1.

Reason:

- The warning does not affect correctness.
- The warning does not affect Memory Architecture.
- The warning does not affect retrieval reliability.
- Thumbnail rendering works correctly.

Future Consideration:

Evaluate selective use of:

loading="eager"

for above-the-fold Memory cards during a dedicated UI performance optimization pass.

## Website Attribution

Current State

OpenGraph extraction maps:

og:site_name -> creator_name

Reason

Provides a useful attribution signal for V1.

Known Limitation

Website brand and content creator are not always the same entity.

Future Work

Introduce a dedicated attribution model separating:

- creator_name
- publisher_name
- platform_name

Local Development Startup

Terminal 1:
npm run dev

Terminal 2:
npm run worker

Worker is mandatory.

If worker is not running:
- saves remain queued
- enrichment never happens
- metadata never appears