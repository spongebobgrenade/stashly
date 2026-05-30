# Stashly Search Architecture

> Version: 2.0
> Status: Active Source of Truth
> Layer: Product Architecture

---

# 1. Purpose

This document defines how Search and Retrieval evolve in Stashly.

It establishes:

- what Search is
- what Retrieval is
- how current retrieval works
- how future retrieval layers build on the current foundation
- what Retrieval may derive from Memory

---

# 2. Search Is Not Memory

Memory stores truth.

Search helps users recover remembered truth.

Search derives from Memory.

Search does not own:

- Memory persistence
- Memory lifecycle
- Memory semantics

---

# 3. Search Is Not The Whole Retrieval Stack

Search is the user-facing capability.

Retrieval is the system capability underneath it.

Relationship:

```text
User Intent
→ Search Experience
→ Retrieval Strategy
→ Memory-Derived Artifacts
→ Memory Results
```

---

# 4. Core Search Principle

Users should not need to remember where they saved something.

Users should only need to remember intent.

This means retrieval must evolve away from exact-match query behavior over time.

---

# 5. Current Retrieval Roadmap

Stashly retrieval is staged explicitly.

## Retrieval V1

Status:

Implemented

Definition:

- keyword retrieval
- lexical matching
- dashboard search UI
- results sourced from canonical Memory

Current query fields:

- title
- description
- creator_name
- source_platform
- original_input

## Retrieval V2

Status:

Foundation implemented, not yet serving user queries

Definition:

- semantic retrieval
- retrieval document generation
- embeddings
- vector-backed similarity matching

## Retrieval V3

Status:

Planned

Definition:

- hybrid retrieval
- keyword retrieval plus semantic retrieval
- fusion and ranking layer

## Retrieval V4

Status:

Planned

Definition:

- AI retrieval
- query understanding
- retrieval planning
- explanation generation
- recovery by intent

---

# 6. Retrieval V1 Architecture

Current flow:

```text
SearchBar
→ useSearch()
→ /api/search
→ retrieveMemories()
→ keywordRetrievalStrategy()
→ Supabase query on saves
→ SearchResults
```

Characteristics:

- user-scoped
- keyword-only
- metadata-backed
- no semantic understanding

---

# 7. Retrieval V2 Foundation

Current repository already contains the foundation for semantic retrieval:

- `memory_embeddings` table
- retrieval document builder
- embedding queue
- embedding worker
- embedding gateway abstraction
- Ollama embedding provider
- pgvector-backed storage contract

Current semantic foundation flow:

```text
Memory completed
→ Retrieval Document
→ Embedding Queue
→ Embedding Worker
→ Embedding Gateway
→ Ollama Provider
→ memory_embeddings
```

This is infrastructure, not yet a query-serving retrieval path.

---

# 8. Search Ownership Boundaries

Search owns:

- user query input
- result ordering
- result presentation
- retrieval orchestration

Search does not own:

- Memory truth
- Memory lifecycle
- base Memory persistence
- embedding truth

---

# 9. Retrieval Artifact Rules

Retrieval systems may produce:

- lexical matches
- semantic matches
- rankings
- confidence scores
- explanations
- fusion outputs

These are retrieval artifacts.

They are not Memory fields.

They must not redefine canonical Memory.

---

# 10. Embeddings and Search

Embeddings are retrieval artifacts derived from Memory.

They support semantic retrieval.

They do not replace Memory and may be regenerated.

Retrieval documents are generated views used to create embeddings.

They are not authoritative user records.

---

# 11. Trust Rules

Search may:

- rank
- match
- explain
- combine retrieval strategies

Search may not:

- fabricate Memories
- invent source attribution
- imply hidden knowledge
- weaken user isolation

All retrieval must remain grounded in stored Memory and approved derived artifacts.

---

# 12. Isolation Rules

Search and Retrieval remain user-scoped.

This applies to:

- keyword search
- semantic retrieval
- hybrid retrieval
- AI retrieval
- embeddings

Cross-user retrieval leakage is forbidden.

---

# 13. Product Readiness Rule

Retrieval V1 proves basic usability.

Public launch requires Retrieval V4 characteristics:

- AI-powered retrieval
- intent-level recovery
- retrieval explanations
- more than keyword lookup

Until then, the current UI remains a validation environment.

---

# 14. Final Boundary Definition

Search is:

> the user-facing experience for recovering remembered information.

Retrieval is:

> the layered system that turns intent into grounded Memory results.

Memory remains authoritative across all retrieval versions.
