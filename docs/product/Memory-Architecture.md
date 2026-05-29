```md
# Stashly Memory Architecture

> **Product:** Stashly  
> **Type:** Memory Architecture Document  
> **Version:** 1.0  
> **Status:** Locked Source of Truth  
> **Layer:** Product Architecture  
> **Hierarchy:** Philosophy -> PRD -> Memory Architecture -> TRD -> Implementation

---

# 1. Purpose

This document defines the canonical architecture of the Memory entity in Stashly.

Its purpose is to establish:

- memory as the core system entity
- the authoritative Memory schema
- what information belongs in Memory
- what information must remain outside Memory
- the rules governing Memory evolution over time

This document exists to prevent architectural drift between product intent, technical design, and implementation.

The Memory Architecture layer translates product truth into a stable entity contract before lower-level system design begins.

This document is authoritative for:

- Memory structure
- Memory field semantics
- Memory lifecycle
- Memory ownership
- Memory trust boundaries
- Memory schema governance

This document is not responsible for:

- queue implementation
- worker implementation
- UI implementation
- retrieval algorithm implementation
- migration details
- code-level workarounds

---

# 2. Document Authority Rules

Memory Architecture is authoritative for all Memory semantics.

If implementation conflicts with Memory Architecture, implementation must change.

If the TRD conflicts with Memory Architecture, Memory Architecture wins.

If generated types conflict with Memory Architecture, types must be regenerated.

If schema conflicts with Memory Architecture, schema must be aligned.

Workers, APIs, UI, retrieval systems, and AI systems derive Memory meaning from this document.

No subsystem may redefine Memory semantics independently.

---

# 3. Why Memory Is The Core Entity

Stashly is an AI Memory Layer.

The system is not fundamentally organized around:

- files
- bookmarks
- feeds
- conversations
- database rows
- saved URLs alone

The system is organized around Memories.

A Memory is the canonical unit of retained value in Stashly.

A Memory represents something a user wants Stashly to remember on their behalf.

This means Memory must be designed to support:

- low-friction capture
- trust-safe preservation
- asynchronous enrichment
- future retrieval systems
- future AI systems
- future rediscovery systems
- future relationship systems

All future retrieval quality depends on the long-term stability of the Memory entity.

If Memory is unstable, retrieval becomes unstable.

If Memory is inconsistent, trust becomes inconsistent.

Therefore:

> Memory is the foundational entity from which all retrieval architecture must derive.

---

# 4. Core Architectural Principles

## 4.1 Memory Is User-Owned

Every Memory belongs to exactly one user.

Memory ownership is never ambiguous.

All retrieval, enrichment, indexing, relationships, rediscovery, and AI behavior must respect user ownership.

---

## 4.2 Memory Preserves User Intent

Memory must preserve what the user actually gave the system.

The system may enrich, normalize, summarize, classify, or derive from a Memory later.

It must never replace the original user-provided input as the base truth.

---

## 4.3 Memory Supports Async Evolution

Memory creation and Memory enrichment are separate concerns.

A Memory may exist before enrichment is complete.

The Memory model must therefore represent both:

- the initial act of remembering
- the later process of enrichment

---

## 4.4 Memory Must Be Retrieval-Compatible

Memory is not modeled only for storage.

Memory exists to support future:

- retrieval
- resurfacing
- rediscovery
- contextual grouping
- relationship formation
- trust-safe AI assistance

---

## 4.5 Memory Must Remain Trust-Safe

Memory may contain:

- user-provided input
- normalized source information
- extracted metadata
- system processing state

Memory must not contain fabricated meaning, hidden inference, or speculative personalization.

---

## 4.6 Memory Evolution Principle

Memories may be created with minimal information.

Memories are expected to evolve through enrichment over time.

Future systems may:

- classify Memories
- summarize Memories
- relate Memories
- enrich Memories

These operations evolve a Memory.

They must never replace the original Memory truth.

The original Memory truth remains grounded in:

- user-provided input
- stable source information
- explicit canonical Memory fields

Memory evolution is allowed.

Memory truth replacement is not.

---

# 5. Canonical Memory Model

The Canonical Memory Model defines the authoritative Memory entity for Stashly.

This model is the source of truth for:

- database shape
- generated database types
- application domain types
- worker write contracts
- retrieval system dependencies

---

## 5.1 Canonical TypeScript Definition

```ts
type MemoryContentType =
  | "link"
  | "note"
  | "image"
  | "screenshot"
  | "pdf"
  | "file"
  | "text"
  | "audio"
  | "video";

type MemoryProcessingStatus =
  | "queued"
  | "processing"
  | "completed"
  | "failed";

type CanonicalMemory = {
  id: string;
  user_id: string;

  original_input: string;
  content_type: MemoryContentType;

  source_platform: string | null;
  canonical_url: string | null;

  title: string | null;
  description: string | null;
  thumbnail_url: string | null;
  creator_name: string | null;

  raw_metadata: Json | null;

  processing_status: MemoryProcessingStatus;

  created_at: string;
  updated_at: string;
};
```

---

## 5.2 Canonical Database Representation

The canonical persisted Memory record must include:

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

This is the authoritative Memory representation for long-term architecture.

Implementation layers may project or adapt this shape for transport or display.

They may not redefine the underlying entity semantics.

---

# 6. Canonical Identity Fields

These fields are foundational parts of the canonical Memory entity.

Some may be nullable at creation time because Stashly uses asynchronous enrichment.

Canonical identity means:

- they belong in the canonical Memory entity
- all future systems must treat them as first-class Memory fields

---

## 6.1 `id`

Purpose:

- stable Memory identity
- reference target for future systems
- immutable pointer for retrieval, relationships, and enrichment

Rationale:

Memory must have a durable identity independent of source URL, UI state, or processing stage.

---

## 6.2 `user_id`

Purpose:

- defines Memory ownership
- enforces isolation
- anchors trust boundaries

Rationale:

Memory is always user-scoped.

No Memory may exist without an owner.

---

## 6.3 `original_input`

Purpose:

- preserves the user’s original submitted content
- serves as the trust-safe source record
- supports future reprocessing

Rationale:

The system may enrich a Memory later, but must always retain what the user actually gave it.

This is the base truth of the Memory.

---

## 6.4 `content_type`

Purpose:

- identifies the top-level kind of Memory
- supports future routing, retrieval, and UX behavior

Rationale:

Stashly is a universal memory layer, not a URL-only system.

The Memory entity must be type-aware from the beginning.

`content_type` is part of the Memory identity model, not incidental metadata.

Because it is foundational, it should be governed as a bounded canonical set rather than arbitrary free text.

---

## 6.5 `processing_status`

Purpose:

- represents the lifecycle state of Memory enrichment
- allows the system to distinguish created, processing, ready, and failed Memories

Rationale:

Stashly is async by default.

Processing state is not external to Memory.

It is part of Memory truth because retrieval systems, interfaces, and trust behavior must know whether the Memory is ready.

Because this is a closed lifecycle, it should be governed as a bounded canonical set rather than free text.

---

## 6.6 `created_at`

Purpose:

- records when the Memory entered Stashly
- supports recency, ordering, and future explanations

Rationale:

Time is a first-class retrieval and trust signal.

---

## 6.7 `updated_at`

Purpose:

- records the last authoritative state change to the Memory
- supports synchronization and future re-indexing logic

Rationale:

Memories evolve asynchronously.

The system must preserve when the canonical record was last changed.

---

# 7. Canonical Metadata Fields

These fields are part of the canonical Memory model and may be null because they are populated through enrichment.

---

## 7.1 `source_platform`

Purpose:

- describes the source environment of the Memory
- supports source-aware retrieval and recognition

Rationale:

Platform information matters for user understanding and future retrieval quality.

Examples may include:

- youtube
- github
- website
- instagram
- tiktok

This field belongs in Memory because it is stable source context.

It should remain flexible text with normalized canonical values, because supported platforms will expand over time.

### Source Platform Governance

- `source_platform` remains flexible text at the schema level
- all `source_platform` values must originate from a centrally governed platform registry
- applications, workers, and UI layers may not invent platform values ad hoc
- source platform normalization rules belong to platform architecture, not individual features

---

## 7.2 `canonical_url`

Purpose:

- stores the normalized source URL for URL-based Memories
- supports stable source identity
- supports deduplication strategy and future retrieval consistency

Rationale:

The user’s original input may be noisy or unnormalized.

The canonical URL is the system’s normalized source representation.

This field belongs in Memory because source normalization is part of Memory stability.

---

## 7.3 `title`

Purpose:

- provides the primary human-readable label for the Memory
- supports future retrieval, recognition, and display

Rationale:

Title is one of the highest-value enrichment outputs for recognition-based remembering.

---

## 7.4 `description`

Purpose:

- preserves meaningful descriptive context
- supports lexical retrieval and future ranking

Rationale:

Description improves recoverability and recognition without requiring AI generation.

---

## 7.5 `thumbnail_url`

Purpose:

- preserves a visual recognition surface for the Memory

Rationale:

Recognition is a core retrieval principle in Stashly.

Visual source cues often help memory recovery.

---

## 7.6 `creator_name`

Purpose:

- preserves source attribution when available
- supports trust, recognition, and future retrieval quality

Rationale:

For many saved memories, creator identity is part of what the user remembers.

---

## 7.7 `raw_metadata`

Purpose:

- preserves source-derived metadata in its original extracted form
- provides a durable enrichment artifact for future processing systems

Rationale:

Stashly must preserve useful extracted source information without forcing immediate full normalization of every field.

`raw_metadata` belongs in Memory because it is part of the source-derived Memory record.

It is not the primary Memory representation.

It is a preservation layer.

At this stage, it should remain attached to Memory rather than moved into a separate metadata entity.

---

# 8. Future Extension Fields

These fields are justified by the product documents but are not required parts of Memory v1.

They may be added in future phases when the corresponding product capability becomes real.

---

## 8.1 `note`

Purpose:

- preserves user-authored reinforcement context

Rationale:

The product documents allow optional reinforcement notes and note attachment.

---

## 8.2 `summary`

Purpose:

- stores an AI-generated or system-generated summary of the Memory

Rationale:

The TRD explicitly allows summarization as an AI-assisted layer.

This should remain optional and additive.

---

## 8.3 `captured_at`

Purpose:

- records the source event or media timestamp when distinct from save time

Rationale:

Future capture systems may need to distinguish source time from Memory creation time.

---

## 8.4 `processing_error`

Purpose:

- stores canonical failure context when processing fails

Rationale:

This becomes justified once failure reporting is promoted into the product experience.

---

# 9. What Belongs In The Memory Entity

The Memory entity should contain information that is:

- foundational to Memory identity
- necessary to preserve user intent
- necessary to preserve source truth
- necessary to describe readiness and enrichment state
- broadly useful across future retrieval systems

This includes:

- stable identity
- ownership
- original captured input
- top-level Memory type
- canonical source normalization
- stable enriched metadata
- processing lifecycle state
- timestamps
- preserved extracted metadata

---

# 10. What Does Not Belong In The Memory Entity

The Memory entity must not become a dumping ground for every future system output.

The following do not belong in the base Memory entity unless product architecture explicitly promotes them into first-class Memory truth:

- embeddings
- vector indexes
- relationship edges
- graph traversal data
- bundle membership state
- rediscovery schedules
- recommendation outputs
- retrieval explanations
- ranking scores
- experimental AI interpretations
- temporary worker execution state
- queue internals
- analytics event logs
- hidden behavioral inferences
- speculative personalization

These systems may derive from Memory.

They are not Memory itself.

---

# 11. Memory Ownership Rules

## 11.1 Single Owner Rule

Every Memory belongs to exactly one user.

No shared ownership is assumed in the canonical model.

---

## 11.2 User Scope Rule

All retrieval, enrichment, indexing, relationships, rediscovery, and AI operations must remain scoped to the Memory’s owner unless a future product architecture explicitly introduces shared permissions.

---

## 11.3 Ownership Persistence Rule

Ownership may not change implicitly through enrichment, platform normalization, or downstream processing.

---

# 12. Processing Lifecycle

Memory creation and Memory enrichment are separate phases of the same entity lifecycle.

A Memory becomes valid at creation time, even before enrichment is complete.

---

## 12.1 Canonical Lifecycle States

`queued`  
`processing`  
`completed`  
`failed`

These are the canonical processing states.

They must remain bounded and governed centrally.

---

## 12.2 State Meanings

### `queued`

The Memory has been accepted by Stashly and is awaiting enrichment work.

### `processing`

The Memory is currently undergoing asynchronous enrichment.

### `completed`

The Memory has completed its current required enrichment lifecycle.

### `failed`

The Memory could not complete enrichment successfully.

The Memory still exists and remains valid as a captured Memory.

---

# 13. State Transitions

The canonical allowed transitions are:

`queued -> processing -> completed`

`queued -> processing -> failed`

Future retries may re-enter processing from failed if product architecture later permits it.

The canonical Memory model must preserve the principle that:

- capture validity does not depend on enrichment success
- failure does not delete the Memory

---

# 14. Lifecycle Ownership Rules

Memory lifecycle semantics must remain centrally governed.

Different system layers may interact with lifecycle state.

They do not share ownership equally.

---

## 14.1 Capture Layer Ownership

The Capture Layer owns:

- Memory creation

The Capture Layer may create a valid Memory with minimal information.

It does not own enrichment completion semantics.

---

## 14.2 Processing Layer Ownership

The Processing Layer owns lifecycle transitions for:

- `queued`
- `processing`
- `completed`
- `failed`

The Processing Layer defines how a Memory advances through enrichment state.

No other layer may redefine the meaning of these transitions.

---

## 14.3 Retrieval Layer Access

The Retrieval Layer has read-only access to lifecycle state.

It may use lifecycle state to:

- filter Memories
- avoid incomplete retrieval paths
- explain readiness

It may not define lifecycle semantics.

---

## 14.4 UI Layer Access

The UI Layer may display lifecycle state.

The UI Layer may not define lifecycle semantics.

It may present state.

It may not redefine what state means.

---

# 15. Trust Boundaries

Memory must never imply knowledge not grounded in:

- user-provided input
- observable source information
- approved integrations
- explicit system processing state

Memory may preserve:

- original input
- normalized source information
- extracted metadata
- timestamps
- processing state

Memory must not preserve:

- fabricated emotional interpretation
- hidden life-context inference
- speculative personalization
- unsupported claims about user intent

---

# 16. Canonical URL Rules

## 16.1 Purpose

`canonical_url` exists to represent the normalized source identity of URL-based Memories.

---

## 16.2 Rules

- `original_input` remains the source-of-truth capture record
- `canonical_url` is the normalized system representation
- `canonical_url` may differ from `original_input`
- `canonical_url` is optional because not all Memory types are URL-based
- `canonical_url` must never overwrite or replace `original_input`

---

## 16.3 Integrity Principle

Canonical normalization improves consistency.

It must not destroy provenance.

---

# 17. Metadata Preservation Rules

## 17.1 Preservation Principle

If Stashly extracts source metadata, the canonical Memory model should preserve the durable, source-derived result.

---

## 17.2 Stable Metadata Rule

Stable normalized metadata belongs in first-class Memory fields:

- title
- description
- thumbnail_url
- creator_name
- source_platform
- canonical_url

---

## 17.3 Raw Metadata Rule

`raw_metadata` may preserve extracted source payloads when useful for:

- auditability
- future extraction refinement
- retrieval compatibility

It must remain clearly subordinate to first-class normalized fields.

---

## 17.4 Boundedness Principle

Raw metadata preservation is allowed.

Unbounded schema sprawl inside raw metadata should not become a substitute for architectural modeling.

---

# 18. Type Ownership Rules

## 18.1 Schema Owns Persistence Truth

The canonical persisted Memory shape is owned by the canonical database schema.

---

## 18.2 Generated Types Mirror Schema

Generated database types must reflect the canonical Memory schema exactly.

They do not define Memory truth independently.

They mirror it.

---

## 18.3 Application Types Derive From Canonical Memory

All application-level Memory representations must derive from the canonical Memory model.

No handwritten domain type may silently redefine persisted Memory semantics.

---

## 18.4 Transport Types May Adapt, Not Redefine

Transport, UI, and workflow types may project Memory for specific use cases.

They may not redefine what Memory means.

---

# 19. Database Ownership Rules

The canonical database representation of Memory is the authoritative persisted form of the Memory entity.

The database layer owns:

- column existence
- nullability rules
- integrity rules
- identity rules
- ownership rules
- lifecycle representation

Workers, APIs, and clients may read or write Memory.

They do not own Memory semantics.

---

# 20. Schema Governance Rules

All future schema changes to Memory must satisfy the following tests.

A proposed field belongs in Memory only if it is:

- foundational to the Memory itself
- broadly reusable across future systems
- part of user truth, source truth, or Memory state
- durable enough to deserve first-class persistence

A field should not be added to Memory if it is:

- a temporary processing artifact
- a system-specific ranking output
- a downstream derived index artifact
- a speculative product experiment
- better modeled as a related entity

Every Memory schema change must answer:

1. Is this Memory truth or derived system output?
2. Does this belong to all future Memories or only one subsystem?
3. Is this durable enough to be first-class?
4. Does this improve retrieval trust and compatibility?
5. Can this be modeled outside Memory more cleanly?

If the answer suggests subsystem-specific behavior, the field should not enter the base Memory entity.

---

# 21. Backward Compatibility Rules

Memory evolution must preserve long-term stability.

Therefore:

- existing Memories must remain valid after schema expansion
- new optional fields must default safely
- schema changes must not reinterpret existing fields silently
- original_input semantics must never change retroactively
- ownership semantics must never weaken retroactively

Breaking changes to base Memory semantics require a formal architecture review, not an implementation-only decision.

---

# 22. Future Extension Rules

Memory is designed to support future systems without absorbing their entire internal state.

Future extension is allowed when:

- the new field is durable
- the new field is broadly useful
- the new field strengthens the canonical Memory entity itself

Future extension should prefer:

- additive nullable fields for true Memory facts
- separate related entities for subsystem outputs

---

# 23. Retrieval Boundary Rule

Memory and Retrieval are separate architectural layers.

Retrieval systems derive from Memory.

They do not redefine Memory.

---

## 23.1 Memory Owns

Memory owns:

- memory facts
- source truth
- ownership
- metadata
- lifecycle state

---

## 23.2 Retrieval Systems Own

Retrieval systems own:

- search scores
- ranking outputs
- confidence scores
- reranking outputs
- vector distances
- retrieval explanations

---

## 23.3 Boundary Rule

Retrieval systems derive from Memory.

Memory must not persist retrieval artifacts as part of the base entity.

If retrieval requires durable subsystem outputs in the future, they must be modeled outside the base Memory entity unless architecture governance explicitly promotes them into first-class Memory truth.

---

# 24. Retrieval Compatibility Requirements

The Memory model must remain compatible with future retrieval systems.

At minimum, Memory must preserve enough information to support:

- lexical retrieval
- source recognition
- recency-aware retrieval
- trust-safe explanation
- future semantic indexing from Memory-derived data

Therefore Memory must retain:

- original_input
- content_type
- source_platform
- canonical_url when applicable
- title
- description
- creator_name when available
- timestamps

Retrieval systems may derive richer indexes from Memory.

They must not require Memory to store retrieval outputs directly in the base entity.

---

# 25. AI Compatibility Requirements

The Memory model must support AI-assisted systems without becoming AI-dependent.

This means:

- Memory must preserve grounded source truth
- AI outputs must remain additive, not substitutive
- AI must not overwrite original_input
- AI must not redefine ownership or source attribution
- AI-derived summaries or interpretations should remain optional fields or external derived artifacts

Memory must remain useful even if no AI processing occurs.

---

# 26. Relationship Graph Compatibility Requirements

Future relationship systems may derive connections between Memories.

The base Memory entity must support this by preserving:

- stable identity
- ownership
- type
- timestamps
- source information
- durable descriptive metadata

Relationship edges, graph weights, traversal structures, and graph-specific outputs do not belong in the base Memory entity.

They belong in future relationship architecture derived from Memory.

---

# 27. Rediscovery Compatibility Requirements

Rediscovery systems may later resurface forgotten or contextually useful Memories.

The base Memory entity must support rediscovery by preserving:

- stable identity
- user ownership
- timestamps
- source context
- descriptive metadata
- readiness state

Rediscovery schedules, campaign logic, and resurfacing decisions do not belong in the base Memory entity.

---

# 28. Security And Isolation Requirements

## 28.1 User Isolation

Every Memory must remain isolated to its owner by default.

No cross-user access may be assumed.

---

## 28.2 Retrieval Isolation

All future retrieval systems built on Memory must remain user-scoped unless future permission architecture explicitly defines otherwise.

---

## 28.3 Metadata Isolation

Raw metadata, normalized metadata, and future derived systems must inherit Memory ownership boundaries.

---

## 28.4 Trust Preservation

Security is not only technical isolation.

It also includes semantic trust.

The Memory entity must never preserve hidden inference or fabricated interpretation as if it were source truth.

---

# 29. Recommended Canonical Constraints

The canonical Memory architecture requires the following integrity principles:

- `id` is unique and stable
- `user_id` is required
- `original_input` is required
- `content_type` is required
- `processing_status` is required
- `created_at` is required
- `updated_at` is required
- `content_type` is governed by a bounded canonical set
- `processing_status` is governed by a bounded canonical set
- `source_platform` remains flexible text with normalized canonical values
- `canonical_url` is optional
- `raw_metadata` is optional

These are architectural requirements.

Implementation may choose the concrete enforcement mechanism.

---

# 30. Final Boundary Definition

The Memory entity is:

> the authoritative, user-owned, trust-safe, asynchronously enrichable core record of something Stashly is responsible for remembering.

The Memory entity is not:

> a container for every downstream retrieval, AI, analytics, graph, queue, or recommendation artifact.

All future Stashly systems must build from Memory.

They must not redefine it casually.

---

# 31. Governance Rule For Future Changes

Any future proposal to change the Memory schema must be reviewed against this document before implementation.

Changes must preserve:

- Memory identity
- user ownership
- original input truth
- source normalization integrity
- retrieval compatibility
- trust safety
- long-term extensibility

If a proposed field or behavior weakens those principles, it does not belong in the canonical Memory model.
```