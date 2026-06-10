# Architecture Status

Last Updated: 2026-06-01

Current Runtime Memory Architecture:
Memory-Architecture.md

Target Architecture:
Memory Representation Architecture V1

## ACTIVE

### Stashly Search Architecture
Status: ACTIVE
Notes:
- Active retrieval architecture for the current product.
- Defines current and future retrieval evolution.

---

## LOCKED

### Memory Representation Architecture (V1)
Status: LOCKED
Notes:
- Canonical memory structure finalized as the source of truth.
- Five-layer memory architecture established.

### Metadata Pipeline
Status: LOCKED
Notes:
- Queue based processing
- Background enrichment
- Automatic completion updates

### Embedding Architecture (V1 Implementation)
Status: LOCKED
Current Representation:
- title
- description
- creator_name
*Note: Implementation requires an update to align with the complete Memory Representation V1 fields.*
Embedding Provider:
- Ollama
- nomic-embed-text

### PRD
Status: ACTIVE
Reason:
Product direction remains valid.

---

## SUPERSEDED

### Stashly Memory Architecture
Status: SUPERSEDED
Purpose:
- Current Runtime Memory Architecture
Notes:
- Documents the current `saves`-table-backed runtime Memory model.
- Remains useful as runtime documentation and is not archived.

---

## OPERATIONAL

### Retrieval V2
Status: OPERATIONAL
Notes:
- Semantic retrieval operational
- Embedding worker operational
- Historical memories successfully backfilled
- Current implementation uses:
  - title
  - description
  - creator_name
- Retrieval alignment with Memory Architecture V1 remains pending

---

## IN PROGRESS

### Retrieval Alignment Project
Status: IN PROGRESS

Purpose:
Align retrieval representation with the locked Memory Architecture V1.

Current Runtime State:
- title
- description
- creator_name

Target State:
- title
- summary
- topics
- entities
- key_insights
- creator_name
- user_notes

Dependencies:
- Understanding Layer implementation
- Re-embedding pipeline
- Backfill regeneration

### TRD
Status: IN PROGRESS (PARTIALLY OUTDATED)
Reason:
Requires updates to align with the locked Memory Representation V1.

### Experience Architecture
Status: IN PROGRESS (DRAFT)
Notes:
- Unblocked. Now actively adapting to Memory Representation Architecture V1.

---

## PLANNED

### AI Recall
Status: PLANNED
Notes:
- Unblocked. Awaiting implementation based on Memory Representation Architecture V1.

### Hybrid Retrieval
Status: PLANNED
Notes:
- Unblocked. Awaiting implementation based on Memory Representation Architecture V1.
# Stashly Experience Architecture V1

**Version:** 1.1  
**Status:** Exploratory but Structured  
**Layer:** Experience Architecture  
**Purpose:** Defines how Stashly should feel emotionally, spatially, visually, and behaviorally during interaction.

---

# Experience Vision

Stashly should feel like:

- entering a memory universe
- interacting with living memories
- recalling thoughts naturally
- rediscovering forgotten value
- exploring contextual connections
- offloading mental burden

The experience should not feel like:

- file management
- enterprise software
- productivity dashboards
- cloud storage
- manual organization systems
- database search

The experience is not a bookmark manager.

---

# Core Experiential Principle

Users should feel:

> “My memories are alive and retrievable.”

not:

> “My files are stored somewhere.”

---

# Experience Pillars

## 1. Retrieval Feels Magical

The primary emotional experience is successful memory recovery.

The system should create the feeling that:

- forgotten information can reappear naturally
- memories remain connected
- retrieval is intuitive
- users do not need perfect recall

The experience should reward:

- vague memory queries
- incomplete recollection
- exploratory retrieval
- rediscovery behavior

---

## 2. Interaction Feels Conversational

Users should interact with Stashly naturally.

The system should feel closer to:

- conversation
- remembering
- rediscovery
- assisted recall

The system should feel less like:

- search engines
- folders
- archives
- admin panels

---

## 3. Memories Feel Dynamic

Saved memories should feel active rather than statically stored.

The experience may include:

- motion
- depth
- layering
- resurfacing
- relationship discovery
- immersive transitions

The interface should imply:

> memories moving through a living system

rather than:

> files sitting in storage.

---

## 4. Discovery Feels Organic

Rediscovery should feel naturally emergent.

Users should encounter:

- related memories
- connected themes
- contextual bundles
- forgotten saves
- resurfaced interests

Discovery should feel:

- fluid
- contextual
- lightweight
- emotionally rewarding

not algorithmically aggressive.

---

# Spatial Experience Philosophy

The product should feel spatially immersive rather than structurally administrative.

Avoid interaction patterns dominated by:

- dense tables
- rigid grids
- enterprise dashboards
- folder trees
- spreadsheet behavior

Prefer interaction patterns that emphasize:

- focus
- depth
- motion
- layering
- contextual proximity
- fluid exploration

---

# Homepage Experience Philosophy

The homepage should function as:

> a Memory Home

not:

> a dashboard.

The homepage should emotionally communicate:

- calmness
- curiosity
- intelligence
- retrieval readiness
- low friction
- memory accessibility

The primary interaction should center around retrieval and rediscovery.

The primary retrieval experience should feel like intent-based retrieval rather than query-mechanical search.

---

# AI Presence Philosophy

AI should feel present but not intrusive.

The AI system should feel:

- calm
- intelligent
- assistive
- responsive
- emotionally aware
- contextually adaptive

AI should not feel:

- robotic
- corporate
- mechanical
- transactional
- overly verbose
- surveillance-oriented

---

# Thinking State Experience

During retrieval or processing, the system may enter an immersive thinking state.

The purpose is to create:

- anticipation
- perceived intelligence
- emotional engagement
- retrieval confidence

Possible experiential patterns:

- pulsing visuals
- contextual motion
- memory connection animations
- node-like relationship activity
- immersive transitions

Thinking states should remain:

- lightweight
- fast
- emotionally supportive
- non-blocking

The system should never feel slow purely for theatrical effect.

---

# Motion Philosophy

Motion should communicate:

- connection
- continuity
- resurfacing
- memory flow
- relationship movement

Motion should avoid:

- distraction
- excessive spectacle
- chaotic animation
- visual overload

Good motion should feel:

- cinematic
- calm
- fluid
- intelligent
- emotionally coherent

---

# Discovery System Experience

Memory exploration should feel immersive.

The discovery experience may evolve toward:

- film-roll inspired movement
- floating memory stacks
- layered cards
- invisible boundaries
- contextual grouping
- flowing navigation

The goal is not visual novelty.

The goal is:

> making memories feel alive and explorable.

---

# Mobile Experience Philosophy

Mobile interaction should prioritize:

- immediacy
- simplicity
- one-handed interaction
- low friction
- quick retrieval
- rapid capture

The experience should feel:

- lightweight
- fluid
- personal
- always accessible

---

# Desktop Experience Philosophy

Desktop interaction should emphasize:

- immersion
- exploration
- depth
- memory relationships
- contextual discovery

Desktop should feel expansive rather than dense.

The experience should encourage:

- wandering
- rediscovery
- contextual exploration
- memory navigation

---

# Emotional Design Goals

Users should feel:

- relief
- trust
- curiosity
- rediscovery delight
- ownership
- wonder
- calmness
- reduced cognitive load

Users should not feel:

- pressure to organize
- fear of forgetting
- productivity guilt
- information anxiety
- surveillance discomfort
- administrative fatigue

---

# Trust Experience Philosophy

Trust should be emotionally reinforced through transparency.

The system should clearly communicate:

- why something was retrieved
- what signals were used
- how memories are connected
- what information is user-provided

The experience should never imply:

- hidden surveillance
- real-world inference
- emotional manipulation
- fabricated personalization

Trust should feel:

- calm
- transparent
- explainable
- respectful

---

# Sound and Sensory Direction

Optional sensory elements may reinforce immersion.

Possible directions include:

- soft startup tones
- ambient interaction feedback
- subtle retrieval audio cues
- lightweight haptic reinforcement

Sensory feedback should remain:

- minimal
- elegant
- non-disruptive
- optional

---

# Personalization Philosophy

Users should feel ownership over their memory environment.

Personalization may include:

- color themes
- gradients
- motion preferences
- ambient settings
- accessibility preferences

Customization should increase:

- emotional attachment
- comfort
- identity
- familiarity

without increasing setup burden.

---

# Onboarding Experience Philosophy

Onboarding should feel like:

> entering a memory universe

rather than:

> configuring software.

The onboarding experience should communicate:

- simplicity
- intelligence
- emotional safety
- low effort
- retrieval potential

The system should quickly establish:

- trust
- emotional connection
- behavioral clarity
- capture simplicity

---

# Experience Constraints

The experience layer should never:

- introduce organizational burden
- prioritize aesthetics over retrieval
- slow down core interactions excessively
- become visually overwhelming
- obscure transparency
- create addictive dark patterns

Experience quality must support:

- retrieval speed
- trust
- clarity
- emotional comfort
- long-term usability

---

# Final Experience Principle

Stashly should feel like:

> a living memory layer for a user's digital life.

not:

> software used to manage files.
# Memory Architecture V1

Status: LOCKED  
Version: 1.0  
Last Updated: 2026-06-01
Purpose: Target Memory Representation Architecture

---

# Purpose

This document defines the canonical structure of a Memory inside Stashly.

The goal is not to store links.

The goal is to create durable, searchable, platform-independent knowledge representations that remain useful even when source platforms change.

This architecture serves as the foundation for:

- Semantic Retrieval
- Hybrid Retrieval
- AI Recall
- Memory Chat
- Cross-Memory Synthesis
- Future Intelligence Features

---

# Core Principle

A Memory is not the original content.

A Memory is a structured representation of knowledge extracted from content.

The original content remains the source of truth.

The representation becomes the retrieval and intelligence layer.

---

# Memory Layers

Every memory consists of five logical layers.

```text
Memory
│
├── Raw Source Layer
├── Extracted Content Layer
├── Understanding Layer
├── User Layer
└── Retrieval Layer
```

---

# Layer 1: Raw Source Layer

Purpose:

Preserve the original source information exactly as received.

This layer is never modified.

## Example Fields

```json
{
  "original_input": "",
  "canonical_url": "",
  "source_platform": "",
  "saved_at": "",
  "creator_name": ""
}
```

## Responsibilities

- Maintain source provenance
- Preserve original URLs
- Support future re-processing
- Enable debugging and recovery

---

# Layer 2: Extracted Content Layer

Purpose:

Capture as much information as possible from the source.

This layer is platform-specific.

## Examples

### YouTube

```json
{
  "title": "",
  "description": "",
  "transcript": "",
  "creator_name": ""
}
```

### Instagram Reel

```json
{
  "caption": "",
  "transcript": "",
  "ocr_text": "",
  "creator_name": ""
}
```

### Article

```json
{
  "title": "",
  "article_text": "",
  "author": ""
}
```

### PDF

```json
{
  "document_text": "",
  "page_count": 0
}
```

## Responsibilities

- Preserve maximum information
- Support future AI processing
- Enable future re-indexing
- Avoid information loss

---

# Layer 3: Understanding Layer

Purpose:

Convert extracted content into platform-independent knowledge.

This layer becomes one of Stashly's primary long-term moats.

Even if platform extraction breaks later, stored understanding remains usable.

## Example Fields

```json
{
  "summary": "",
  "topics": [],
  "entities": [],
  "key_insights": [],
  "intent": "",
  "content_type": ""
}
```

## Example

Raw Content:

```text
3 mistakes beginners make while investing
```

Understanding:

```json
{
  "summary": "Common beginner investing mistakes involving emotional decisions, lack of diversification, and poor risk management.",
  "topics": [
    "investing",
    "finance",
    "risk management"
  ],
  "entities": [
    "diversification",
    "index funds",
    "asset allocation"
  ],
  "key_insights": [
    "Emotional investing often reduces long-term returns",
    "Diversification lowers concentration risk",
    "Risk management matters more than stock picking"
  ]
}
```

## Responsibilities

- Platform-independent representation
- Knowledge extraction
- Search optimization
- Future AI Recall support
- Cross-platform memory durability

---

# Layer 4: User Layer

Purpose:

Store knowledge added by the user.

User-generated information is treated as highly valuable.

## Example Fields

```json
{
  "notes": "",
  "tags": [],
  "collections": []
}
```

## Responsibilities

- User annotations
- Personal context
- Organization
- Collection membership

## Rule

AI systems must never overwrite user-created information.

User-created notes are considered part of the memory representation and participate in retrieval.

---

# Layer 5: Retrieval Layer

Purpose:

Generate embeddings and retrieval representations.

This layer is derived from all previous layers.

It is not manually authored.

## Generation Flow

```text
Raw Layer
+
Extracted Content Layer
+
Understanding Layer
+
User Layer

↓

Retrieval Document

↓

Embedding Generation

↓

Semantic Retrieval
```

---

# Retrieval Document V1

The retrieval document is the canonical text used for semantic embeddings.

## Structure

```text
TITLE

SUMMARY

TOPICS

ENTITIES

KEY INSIGHTS

CREATOR

USER NOTES
```

## Example

```text
How To Lose Fat Without Losing Muscle

Summary:
Explains maintaining muscle during calorie deficit through protein intake and resistance training.

Topics:
fitness
nutrition
fat loss

Entities:
protein
hypertrophy
calorie deficit

Key Insights:
Protein preserves muscle during calorie deficits.
Resistance training reduces muscle loss.

Creator:
Jeff Nippard

User Notes:
Use during cutting phase.
```

---

# What Gets Embedded

## Included

- Title
- Summary
- Topics
- Entities
- Key Insights
- Creator
- User Notes

---

# What Does Not Get Embedded

## Stored But Not Embedded

- Full transcripts
- OCR text
- Raw metadata
- Full descriptions
- Raw extraction payloads

Reason:

These fields are often noisy, excessively large, and reduce retrieval quality.

They remain available for future retrieval systems and AI Recall.

---

# Retrieval Philosophy

Stashly optimizes for both:

## Content Discovery

Example:

```text
Find the recipe video I saved last month.
```

## Knowledge Recall

Example:

```text
Show me everything I saved about muscle growth.
```

Both goals are first-class requirements.

However:

```text
Discovery > Precision
```

When conflicts occur, the system should favor discovery.

## Rationale

The primary goal of Stashly is not simply to retrieve saved content.

The primary goal is to surface valuable knowledge the user may have forgotten exists.

Discovery-first retrieval better supports:

- Long-term memory augmentation
- AI Recall
- Cross-memory synthesis
- Future intelligence systems

---

# Future Versions

## V2

Transcript-aware retrieval.

## V3

OCR-aware retrieval.

## V4

Visual understanding.

Example:

```text
Person cooking homemade pasta.
Kitchen.
Tomatoes.
Parmesan.
```

## V5

AI Recall.

Example:

```text
Show me everything I saved related to homemade cooking.
```

Across:

- YouTube
- Instagram
- Articles
- PDFs
- User Notes

---

# Known Weaknesses of V1

These limitations are accepted intentionally to maximize execution speed and reduce complexity.

## Transcript Blindness

V1 ignores transcripts during embedding generation.

Some valuable information will not be discoverable semantically.

Mitigation:

Transcripts remain stored for future re-indexing.

---

## OCR Blindness

Text present inside images is not included in retrieval.

Mitigation:

OCR storage remains available for future retrieval upgrades.

---

## No Visual Understanding

Images and videos are represented through extracted text only.

Mitigation:

Visual understanding is planned for future architecture versions.

---

## Single Memory Representation

Memories are retrieved independently.

Relationships between memories are not yet modeled.

Mitigation:

Knowledge graph architecture remains a future initiative.

---

# Architectural Decisions

## Locked

- Five-layer memory architecture
- Retrieval document abstraction
- Platform-independent understanding layer
- User-owned knowledge layer
- Discovery-first retrieval philosophy
- Key insights as a retrieval primitive
- User notes participate in retrieval
- Retrieval layer is derived, not authored

## Not Yet Locked

- Transcript processing strategy
- OCR processing strategy
- Visual understanding strategy
- Knowledge graph architecture
- Multimodal embedding strategy
- AI-generated memory synthesis architecture

---

# Guiding Principle

The goal is not to build a better bookmark manager.

The goal is to build a Memory Operating System.

Every future architecture decision should be evaluated against that objective.
# Stashly Memory Architecture

> Version: 2.0
> Status: SUPERSEDED
> Layer: Product Architecture
> Hierarchy: Philosophy -> PRD -> Memory Architecture -> TRD -> Implementation
> Purpose: Current Runtime Memory Architecture

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
Stashly Philosophy

Version: 2.0
Status: Active
Layer: Foundational Truth System

---

Core Identity

Stashly is not a bookmark manager.

Stashly is a Universal AI Memory OS.

The system exists to reduce the user’s remembering burden.

Bookmark management is only a small subset of the long-term product.

---

Mission

Users should be able to:

Save → Forget → Retrieve

without needing to manually organize information.

The product exists so users do not have to remember:

- where something was saved
- what platform it came from
- how it was organized
- what category it belonged to

Explicit principle:

> Users should not need to remember where they saved something. Users should only need to remember intent.

---

Product Promise

Primary promise:

“Save once. Recover later.”

Expanded promise:

“Your digital life should remember itself.”

---

Retrieval Philosophy

Retrieval is the core product value.

The system should optimize for:

- recognition
- confidence
- low cognitive effort
- intent-based recovery
- trust

The system should not optimize for:

- folder maintenance
- manual organization
- bookmark administration
- database-style browsing as the primary interaction

---

AI Philosophy

AI should feel like memory recovery.

AI should not feel like a generic search box pasted on top of saved items.

AI may:

- interpret intent
- improve retrieval
- explain why something was surfaced
- recover forgotten information more naturally

AI may not:

- invent memories
- imply hidden knowledge
- replace grounded Memory truth
- break user trust for the sake of seeming smart

---

Memory Principle

Memory remains canonical.

Derived systems may evolve aggressively:

- search
- semantic retrieval
- hybrid retrieval
- AI retrieval
- rediscovery
- embeddings

But none of those systems may become the source of truth for what the user saved.

---

Organizational Burden Principle

Users should not be required to:

- create folders
- add tags
- maintain collections
- classify every item
- remember storage locations

Manual organization may exist later as an optional enhancement.

It must not become the primary interaction model.

---

Trust Principle

Stashly must never imply knowledge it did not derive from:

- user-provided information
- observable metadata
- approved integrations
- explicit system processing

Retrieval explanations must remain transparent and grounded.

Bad:

“You saved this during exam season.”

Good:

“Saved on March 14. Similar to other startup-related items you saved.”

---

Current Product Philosophy

The current application is a validation environment.

The UI exists primarily to validate:

- Memory architecture
- asynchronous enrichment
- synchronization
- Retrieval V1
- embedding architecture foundations

The current UI is not the final product experience.

Final product expression should arrive with AI-powered retrieval, not before.

---

Launch Principle

Stashly should not be publicly launched until AI-powered retrieval exists.

Keyword search alone is not the product promise.

It is only a validation milestone on the path to intent-based recovery.

---

Emotional Outcome

Users should feel:

- relief
- trust
- confidence
- reduced cognitive load
- rediscovery delight

Users should not feel:

- organizational anxiety
- dashboard fatigue
- productivity guilt
- fear of losing information

Desired user thought:

“Stashly will remember this for me.”

---

Product Boundary

Stashly is not:

- a traditional bookmark manager
- a read-later tool
- a productivity workspace
- a folder system
- a cloud storage replacement

Stashly is:

> a Universal AI Memory OS that helps users recover remembered value by intent.

---

Governance Rule

Philosophy remains the highest product truth.

Implementation may move quickly.

Architecture may deepen.

But no lower layer may redefine these principles:

- Memory is canonical
- retrieval is the core value
- AI must remain trust-safe
- users should not bear organizational burden
- intent matters more than storage location

---

Final Principle

Stashly exists to reduce remembering burden, not create a better bookmark dashboard.
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
# Stashly TRD

> Version: 4.0
> Status: Active
> Phase: Retrieval Foundation
> Layer: Technical Design

---

# 1. Technical Objective

Build the technical foundation for a Universal AI Memory OS.

The repository is currently validating:

- canonical Memory persistence
- asynchronous enrichment
- synchronization correctness
- Retrieval V1 keyword search
- embedding infrastructure for semantic retrieval

The repository is not yet validating final public product experience.

Public launch requires AI-powered retrieval.

---

# 2. System Principles

- Memory remains canonical.
- Retrieval derives from Memory.
- Embeddings are derived artifacts.
- Retrieval documents are generated views of Memory.
- Heavy processing remains asynchronous.
- Capture must never block on enrichment or embedding generation.
- UI can evolve quickly while architecture remains stable.

---

# 3. Current Runtime Stack

- Next.js 16
- Supabase
- PostgreSQL
- Supabase Realtime
- Redis
- BullMQ
- Zustand
- Dedicated metadata worker
- Dedicated embedding worker
- Ollama embedding provider

---

# 4. Canonical Entities

## Memory

Current canonical table:

- `saves`

Purpose:

- authoritative user Memory record

## Memory Embedding

Current derived table:

- `memory_embeddings`

Purpose:

- persist semantic retrieval artifacts derived from Memory

Embedding records are not canonical Memory truth.

---

# 5. Current Capture and Processing Flow

```text
User URL
→ Save API
→ saves row created (queued)
→ memory-processing queue
→ metadata worker
→ resolver classification
→ extractor enrichment
→ saves row updated (completed)
→ embedding-processing queue
→ embedding worker
→ retrieval document generation
→ embedding gateway
→ Ollama provider
→ memory_embeddings row created
→ synchronization layer updates UI
```

---

# 6. Memory Processing Architecture

## Capture Layer

Current responsibilities:

- validate input
- create `saves` row
- assign authenticated owner
- initialize `processing_status = queued`
- enqueue metadata processing

## Metadata Processing Layer

Current responsibilities:

- transition `queued -> processing`
- resolve platform and content type
- enrich metadata
- persist canonical Memory fields
- transition `processing -> completed` or `failed`
- enqueue embedding generation

## Synchronization Layer

Current transports:

- realtime updates
- reconciliation polling

Shared contract:

- all state delivery writes through `upsertMemory()`

---

# 7. Retrieval Architecture

## Retrieval Philosophy

- Primary Goal: Discovery
- Secondary Goal: Precision
- Supports:
  - Content Discovery
  - Knowledge Recall
- User Notes participate in retrieval.
- Key Insights participate in retrieval.

## Retrieval V1

Status:

Implemented

Strategy:

- keyword retrieval

Current fields queried:

- `title`
- `description`
- `creator_name`
- `source_platform`
- `original_input`

Implementation:

- `retrieveMemories()`
- `keywordRetrievalStrategy()`

## Retrieval V2

Status:

Foundation implemented

Strategy:

- semantic retrieval using vectors derived from retrieval documents

Current implementation foundation:

- retrieval document builder
- embedding queue
- embedding worker
- embedding gateway
- Ollama provider
- `memory_embeddings`

## Retrieval V3

Status:

Planned

Strategy:

- hybrid keyword + semantic retrieval

## Retrieval V4

Status:

Planned

Strategy:

- AI retrieval
- query understanding
- retrieval planning
- grounded explanation generation

---

# 8. Embedding Architecture V1

## Purpose

Generate semantic retrieval artifacts from canonical Memory without polluting Memory truth.

## Current Components

- `buildRetrievalDocument(memory)`
- `generateEmbedding(text, options?)`
- Ollama provider implementation
- `embedding-processing` queue
- embedding worker
- `memory_embeddings` persistence

## Retrieval Document

### Current Runtime State

The currently implemented retrieval document contains:

- `title`
- `description`
- `creator_name`

This is the active production representation used by the embedding pipeline today.

### Target Architecture State

The locked Memory Architecture V1 defines the future retrieval document as:

- `title`
- `summary`
- `topics`
- `entities`
- `key_insights`
- `creator_name`
- `user_notes`

Status:

- Planned
- Not Yet Implemented

Retrieval alignment, understanding-layer generation, and embedding regeneration are required before this architecture becomes active.

## Current Embedding Provider

Default provider:

- `ollama`

Default model:

- `nomic-embed-text`

## Gateway Rule

Application code calls the embedding gateway, not the provider directly.

This keeps provider selection replaceable over time.

---

# 9. Embedding Storage Rules

Embeddings are stored outside `saves`.

Current embedding row fields include:

- `memory_id`
- `chunk_index`
- `chunk_text`
- `embedding`
- `provider`
- `model`

Implications:

- embeddings may be regenerated
- embeddings may be replaced when models change
- multiple embeddings may exist over time if architecture later supports versioning or chunking

---

# 10. Search and Retrieval UI

Current dashboard validates:

- save flow
- Memory feed
- keyword search
- search empty states
- synchronization behavior

The dashboard is not the final AI retrieval interface.

It is a validation surface for architecture and functionality.

---

# 11. Worker Architecture

## Metadata Worker

Queue:

- `memory-processing`

Responsibilities:

- metadata enrichment
- lifecycle persistence
- embedding job enqueue

## Embedding Worker

Queue:

- `embedding-processing`

Responsibilities:

- fetch completed Memory
- build retrieval document
- generate embedding
- persist to `memory_embeddings`

---

# 12. Security and Isolation

All current retrieval and embedding behavior must remain user-scoped.

Critical rule:

- cross-user retrieval leakage is forbidden
- cross-user vector leakage is forbidden

Embeddings inherit Memory ownership boundaries.

---

# 13. Current Gaps

Not yet implemented:

- vector query path
- semantic retrieval API
- hybrid retrieval fusion
- AI retrieval orchestration
- retrieval explanations
- embedding refresh and invalidation strategy
- embedding deduplication/versioning policy

---

# 14. Launch Readiness Rule

The repository is not launch-ready while retrieval remains keyword-first.

Launch requirement:

```text
AI-powered retrieval must exist before public launch.
```

---

# 15. Summary

Current repository state is:

- Retrieval V1 implemented
- Embedding Architecture V1 implemented
- Semantic retrieval foundation implemented
- Public product experience intentionally deferred until AI retrieval exists
