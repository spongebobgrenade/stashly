# Stashly Memory Architecture

Status: ARCHIVED
Superseded By:
docs/product/Memory-Architecture-V1.md

Do not edit.
Retained for historical reference only.
---

# 1. Purpose

This document defines the current runtime canonical Memory entity for Stashly.

It establishes:

- what Memory is
- what belongs in Memory
- what must remain outside Memory
- how downstream systems derive from Memory
- why Memory remains canonical even as retrieval systems grow more capable

---

# 2. Core Definition

Stashly is a Universal AI Memory OS.

Memory is the authoritative record of something a user wants Stashly to remember.

Memory is:

- user-owned
- trust-safe
- asynchronously enrichable
- retrieval-compatible
- durable

Memory is not:

- a vector index
- a retrieval result
- a ranking artifact
- an embedding store
- a queue artifact

---

# 3. Canonical Principle

Memory remains canonical.

All downstream systems derive from Memory, including:

- lexical retrieval
- semantic retrieval
- hybrid retrieval
- AI retrieval
- rediscovery
- relationships
- embeddings
- retrieval documents

No downstream system may become the source of truth for Memory.

---

# 4. Canonical Memory Fields

The current canonical Memory fields are:

```text
id
user_id
original_input
content_type
source_platform
canonical_url
title
description
thumbnail_url
creator_name
raw_metadata
processing_status
created_at
updated_at
```

Current persisted implementation:

- table: `saves`

---

# 5. Canonical Memory Semantics

## Identity

- `id` uniquely identifies the Memory
- `user_id` defines ownership

## Input Truth

- `original_input` preserves the user-provided source

## Classification

- `content_type` describes remembered content shape
- `source_platform` describes platform/source context

## Enrichment

- `canonical_url`
- `title`
- `description`
- `thumbnail_url`
- `creator_name`
- `raw_metadata`

## Lifecycle

- `processing_status`

## Audit

- `created_at`
- `updated_at`

---

# 6. Lifecycle

Canonical lifecycle:

```text
queued
→ processing
→ completed

queued
→ processing
→ failed
```

Rules:

- a Memory is valid at creation time
- enrichment success is not required for Memory validity
- failure does not invalidate capture

---

# 7. Ownership Boundaries

## Capture Layer Owns

- creation
- `original_input`
- `user_id`
- initial `processing_status = queued`

## Resolver Owns

- `source_platform`
- `content_type`
- URL normalization inputs used for classification

## Extractors Own

- `title`
- `description`
- `thumbnail_url`
- `creator_name`
- `canonical_url`
- `raw_metadata`

## Processing Layer Owns

- lifecycle transitions
- persistence of resolver classification and extractor enrichment

## Retrieval Layer Owns

- scoring
- ranking
- matching
- explanations
- confidence

## Embedding Layer Owns

- retrieval documents
- chunks
- vectors
- provider metadata

None of those derived layers may redefine Memory semantics.

---

# 8. What Belongs In Memory

A field belongs in Memory if it is:

- part of user truth
- part of stable source truth
- part of canonical lifecycle truth
- broadly reusable across future retrieval systems
- durable enough to deserve first-class persistence

Examples:

- original source
- normalized source metadata
- title and description
- creator attribution
- lifecycle status
- ownership
- timestamps

---

# 9. What Does Not Belong In Memory

The base Memory entity must not absorb downstream artifacts.

The following do not belong in the base Memory entity:

- embeddings
- vector indexes
- retrieval documents
- chunk text artifacts
- ranking scores
- semantic similarity values
- retrieval explanations
- recommendation outputs
- relationship edges
- queue state internals
- worker execution metadata
- speculative AI interpretations

Those systems may derive from Memory.

They are not Memory itself.

---

# 10. Embedding Architecture Boundary

Embeddings are derived artifacts.

Embeddings must never become the source of truth.

The current embedding layer derives from Memory through a retrieval document generation step.

Conceptual flow:

```text
Memory
→ Retrieval Document
→ Embedding Generation
→ memory_embeddings
```

Implications:

- embeddings are replaceable
- embeddings may be regenerated
- embeddings may change providers or models
- Memory truth must remain stable even if embeddings are deleted or rebuilt

---

# 11. Retrieval Document Boundary

Retrieval documents are generated views of Memory.

They exist to support retrieval systems.

They are not canonical user records.

Current retrieval document generation is built from Memory fields such as:

- title
- description
- creator_name

This generated view may evolve over time without changing canonical Memory semantics.

---

# 12. Retrieval Boundary Rule

Retrieval derives from Memory.

Memory does not derive from retrieval.

Retrieval systems may produce:

- search scores
- ranking outputs
- confidence scores
- vector distances
- retrieval explanations

These are retrieval artifacts.

They must not be persisted inside the base Memory entity.

---

# 13. Compatibility Requirements

The Memory model must remain compatible with:

- Retrieval V1 keyword search
- Retrieval V2 semantic retrieval
- Retrieval V3 hybrid retrieval
- Retrieval V4 AI retrieval
- rediscovery systems
- relationship systems
- future multimodal capture

This means Memory must preserve enough durable information to support:

- lexical matching
- semantic document generation
- source recognition
- trust-safe retrieval explanation
- user-scoped indexing

---

# 14. Trust Rules

Memory must never imply knowledge not grounded in:

- user-provided input
- observable source metadata
- approved integrations
- explicit processing state

Memory may evolve through enrichment.

Memory truth must not be silently replaced by downstream inference.

---

# 15. Security and Isolation

Every Memory belongs to one user.

All derived systems built from Memory must remain user-scoped by default, including:

- search
- embeddings
- vector retrieval
- AI retrieval

Cross-user retrieval leakage is forbidden.

---

# 16. Schema Governance Rules

Every proposed Memory field change must answer:

1. Is this Memory truth or subsystem output?
2. Is this durable enough to be first-class?
3. Does this belong to all Memories or only one subsystem?
4. Can this be modeled more cleanly as a derived entity?
5. Does it improve retrieval compatibility without corrupting Memory truth?

If a field is mainly a retrieval or embedding artifact, it should be modeled outside base Memory.

---

# 17. Current Repository Alignment

Current implementation aligns with this document in the following ways:

- `saves` is the canonical Memory table
- metadata enrichment updates Memory fields directly
- embeddings are stored outside `saves`
- retrieval documents are generated from Memory rather than persisted inside Memory
- keyword retrieval reads canonical Memory

---

# 18. Final Boundary Definition

Memory is:

> the authoritative, user-owned, asynchronously enrichable core record of what Stashly is responsible for remembering.

Memory is not:

> a container for every retrieval, embedding, queue, ranking, or AI artifact created downstream.
