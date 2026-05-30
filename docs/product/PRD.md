# Stashly PRD

> Version: 5.0
> Status: Active
> Phase: Pre-Launch Retrieval Foundation
> Classification: Internal

---

# 1. Executive Summary

Stashly is a Universal AI Memory OS.

The product exists to reduce remembering burden by letting users save information once, forget it safely, and recover it later through retrieval systems that increasingly understand intent rather than exact storage details.

Current repository focus:

- validate canonical Memory architecture
- validate asynchronous capture and enrichment
- validate synchronization reliability
- validate Retrieval V1
- lay the foundation for semantic and AI retrieval

Stashly is not being publicly launched yet.

Public launch requires AI-powered retrieval, not just storage and keyword search.

---

# 2. Product Positioning

## What Stashly Is

Stashly is:

- a Universal AI Memory OS
- a personal memory layer for a user’s digital life
- a retrieval-first system
- an asynchronous enrichment system
- a foundation for semantic and AI retrieval

Core positioning statement:

> Users should not need to remember where they saved something. Users should only need to remember intent.

## What Stashly Is Not

Stashly is not:

- a bookmark manager
- a read-later tool
- a folder-based archive
- a manual organization workspace
- a dashboard product in its final form

Bookmark management is only a small subset of the long-term product surface.

---

# 3. Current Product State

The current UI is a validation environment.

Its job is to prove:

- Memory creation works
- asynchronous enrichment works
- synchronization works
- Retrieval V1 works
- embedding generation works
- future retrieval systems can be layered onto canonical Memory

The current UI is not the final product expression.

It is intentionally simple because the current priority is validating architecture and retrieval foundations.

---

# 4. Product Promise

Primary promise:

> Save once. Recover later without remembering storage details.

Expanded promise:

> The system remembers your digital life so you do not have to.

Primary user loop:

```text
See something valuable
→ Save it to Stashly
→ Forget naturally
→ Retrieve by intent later
→ Trust increases
```

---

# 5. Locked Product Principles

- Retrieval quality is the primary product value.
- Memory remains canonical.
- Heavy processing remains asynchronous.
- Backend owns business logic.
- Users should not manage manual organization.
- UI may evolve quickly while architecture remains stable.
- Derived retrieval systems must never become the source of truth.
- Build systems in their final architectural shape, with minimum necessary surface area now.

---

# 6. Current Implemented Scope

## Capture and Memory Flow

Implemented:

- Google authentication
- URL saving
- optimistic save confirmation
- async metadata enrichment
- canonical Memory persistence in `saves`
- realtime plus reconciliation synchronization

## Retrieval Foundation

Implemented:

- Search / Retrieval V1
- keyword retrieval across canonical Memory fields
- dashboard search UI
- retrieval layer abstraction

## Embedding Foundation

Implemented:

- `memory_embeddings` persisted vector artifacts
- embedding queue
- embedding worker
- retrieval document generation
- embedding gateway abstraction
- Ollama embedding provider
- pgvector-backed storage contract in the current schema/types

---

# 7. Retrieval Roadmap

Stashly retrieval evolves in four explicit stages.

## Retrieval V1

Status:

Implemented

Description:

- keyword retrieval
- lexical matching across Memory metadata
- search UI wired into the dashboard

## Retrieval V2

Status:

Foundation implemented, query path not yet active

Description:

- semantic retrieval
- embedding generation from retrieval documents
- vector-backed memory retrieval

## Retrieval V3

Status:

Planned

Description:

- hybrid retrieval
- keyword + semantic fusion
- improved ranking and confidence behavior

## Retrieval V4

Status:

Planned

Description:

- AI retrieval
- query understanding
- retrieval planning
- retrieval explanations
- memory recovery by intent rather than exact query wording

Public launch gate:

```text
AI-powered retrieval must exist before public launch.
```

---

# 8. Core Product Systems

## C1. Universal Memory Capture

Current implementation:

- URL-first capture
- asynchronous enrichment pipeline

Long-term direction:

- screenshots
- images
- PDFs
- notes
- text
- audio
- files

## C2. Retrieval

Current implementation:

- Retrieval V1 keyword search

Required before launch:

- AI-powered retrieval

## C3. Synchronization

Current implementation:

- realtime delivery
- reconciliation polling
- shared store contract

## C4. Embedding Infrastructure

Current implementation:

- retrieval document builder
- embedding worker
- local embedding provider strategy
- derived embedding persistence

Purpose:

- enable semantic retrieval without redefining Memory

---

# 9. Memory and Retrieval Relationship

Memory remains authoritative.

Retrieval derives from Memory.

Embeddings are derived artifacts.

Retrieval documents are generated views of Memory.

Neither embeddings nor retrieval documents may become the source of truth for user memory.

---

# 10. Current Launch Boundary

Stashly is not ready for public launch.

Reasons:

- AI retrieval is not implemented
- semantic retrieval is not queryable yet
- hybrid retrieval is not implemented
- rediscovery systems are not implemented
- capture remains URL-first

Current milestone:

```text
Architecture validation before public launch.
```

---

# 11. Success Criteria For Current Phase

The current phase is successful if the repository proves:

- canonical Memory architecture remains stable
- asynchronous enrichment remains reliable
- synchronization stays consistent
- Retrieval V1 is usable
- embedding generation is reliable enough to unlock Retrieval V2
- future retrieval layers can derive from Memory without changing Memory truth

---

# 12. Product Metrics Direction

Current internal validation metrics should prioritize:

- save success rate
- enrichment completion rate
- synchronization correctness
- keyword retrieval usefulness
- embedding generation success rate
- retrieval document coverage

Future launch metrics should prioritize:

- successful retrieval rate
- time to retrieval success
- retrieval confidence success
- semantic retrieval quality
- AI retrieval satisfaction

---

# 13. Non-Goals For Current Phase

- polished final UI
- public launch branding
- social or creator features
- manual organization workflows
- bookmark-manager feature parity as a primary goal
- AI chat without retrieval grounding

---

# 14. Final Product Statement

Stashly is a Universal AI Memory OS.

The current application is a validation environment for Memory, retrieval, synchronization, and embedding architecture.

The long-term product promise is not “save links.”

It is:

> remember by intent, not by storage location.
