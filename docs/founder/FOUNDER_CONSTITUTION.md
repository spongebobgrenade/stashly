# STASHLY DECISION LOG

## Purpose

This document records the active decisions that currently govern Stashly.

It is not a timeline.

It is not a retrospective.

It is the living operating contract for product, architecture, engineering, and execution.

Historical decisions that were later abandoned belong in TIMELINE.md and EXECUTION_RETROSPECTIVE.md.

Only decisions that continue to shape Stashly today are recorded here.

---

# SECTION 1: PRODUCT IDENTITY DECISIONS

## D-001 — Stashly Is A Universal AI Memory OS

### Decision

Stashly is a Universal AI Memory OS.

It is not:

- a bookmark manager
- a read-later app
- a knowledge management tool
- a note-taking app
- a social platform

### Why

People do not struggle to save information.

People struggle to remember and recover information later.

The fundamental problem is memory retrieval, not storage.

### Implications

All product decisions must improve:

- recall
- retrieval
- resurfacing
- memory reconstruction

rather than organization.

### Status

ACTIVE

---

## D-002 — Retrieval Is The Product

### Decision

Retrieval quality is the primary value creation mechanism.

Saving is merely input collection.

### Why

A perfect save with failed retrieval creates zero user value.

A successful retrieval creates immediate value.

### Implications

When prioritization conflicts occur:

Retrieval wins.

### Status

ACTIVE

---

## D-003 — Universal Intake

### Decision

Every saved item enters the system as a future memory.

Not as:

- URL
- PDF
- Screenshot
- Video
- Audio file

### Why

Users think in memories and intent.

They do not think in file formats.

### Implications

All ingestion systems must normalize content into memory representations.

### Status

ACTIVE

---

## D-004 — Sharing Is Distribution, Not Product

### Decision

Social functionality exists only to support distribution.

### Why

Feeds, followers, creator systems, and engagement loops distract from retrieval validation.

### Implications

Social features remain secondary to memory retrieval.

### Status

ACTIVE

---

# SECTION 2: PRODUCT STRATEGY DECISIONS

## D-005 — No Public Launch Without AI Retrieval

### Decision

Stashly will not publicly launch as a retrieval product until AI Retrieval is operational.

### Why

Keyword search creates bookmark-manager behavior.

The product promise requires memory reconstruction.

### Implications

Current retrieval systems are validation environments.

Not final product experiences.

### Status

ACTIVE

---

## D-006 — Discovery Over Precision

### Decision

Retrieval optimization favors discovery and recall over strict keyword precision.

### Why

Users often remember fragments, feelings, concepts, and outcomes.

Not exact titles.

### Implications

Retrieval systems must maximize resurfacing of useful knowledge.

### Status

ACTIVE

---

## D-007 — Share Sheet Is The Front Door

### Decision

The primary entry point is OS-level sharing.

### Why

Copy → Open App → Paste creates friction.

Behavioral adoption requires minimal effort.

### Implications

Share flows receive priority over manual capture flows.

### Status

ACTIVE

---

# SECTION 3: MEMORY ARCHITECTURE DECISIONS

## D-008 — Memory Representation Is The Core Asset

### Decision

The core asset of Stashly is Memory Representation.

Not embeddings.

Not vectors.

Not retrieval indexes.

### Why

Models change.

Embedding strategies evolve.

Memory understanding must remain durable.

### Implications

Understanding must be persisted.

Not regenerated repeatedly.

### Status

ACTIVE

---

## D-009 — Five-Layer Memory Architecture

### Decision

Every memory follows:

1. Raw Source
2. Extracted Content
3. Understanding
4. User Layer
5. Retrieval Layer

### Why

Separates immutable truth from derived understanding.

Allows future regeneration.

### Status

LOCKED

---

## D-010 — Canonical Memory First

### Decision

Original memory truth must never be overwritten by AI interpretation.

### Why

AI understanding changes.

Original evidence should not.

### Implications

AI outputs remain derived layers.

### Status

ACTIVE

---

## D-011 — Memory Representation Persistence

### Decision

Understanding is generated once and stored.

### Why

Repeated generation creates:

- inconsistent outputs
- duplicate costs
- retrieval instability

### Implications

Workers consume persisted understanding.

### Status

ACTIVE

---

# SECTION 4: RETRIEVAL DECISIONS

## D-012 — Understanding Over Metadata

### Decision

Retrieval should operate on understanding.

Not raw metadata.

### Why

Most internet metadata is weak, incomplete, or misleading.

### Implications

Knowledge extraction becomes mandatory.

### Status

ACTIVE

---

## D-013 — Coverage Is Not The Moat

### Decision

Retrieval quality matters more than platform coverage.

### Why

Adding more extractors does not improve recall quality.

### Implications

Understanding work takes priority over extractor expansion.

### Status

ACTIVE

---

## D-014 — Exact Memory Before Summary

### Decision

Users see exact memories before generated summaries.

### Why

Users should not need to search twice.

### Status

ACTIVE

---

## D-015 — Retrieval Must Explain Itself

### Decision

Every retrieval result should have transparent reasoning.

### Why

Trust is essential for memory products.

### Status

ACTIVE

---

# SECTION 5: AI ARCHITECTURE DECISIONS

## D-016 — AI Is Infrastructure

### Decision

AI remains primarily behind the scenes.

### Why

Users want outcomes.

Not AI interfaces.

### Implications

AI powers:

- enrichment
- retrieval
- understanding

rather than chat experiences.

### Status

ACTIVE

---

## D-017 — Provider-Agnostic AI Stack

### Decision

No AI vendor becomes foundational infrastructure.

### Why

Models change rapidly.

Vendor lock-in creates risk.

### Implications

All AI systems route through abstractions.

### Status

ACTIVE

---

## D-018 — Knowledge Extraction Before Embeddings

### Decision

Raw transcripts and OCR should not directly drive semantic retrieval.

### Why

Noise degrades retrieval quality.

### Implications

Extract:

- topics
- entities
- insights
- summaries

before embedding.

### Status

ACTIVE

---

# SECTION 6: ENGINEERING DECISIONS

## D-019 — Modular Monolith

### Decision

Stashly remains a modular monolith.

### Why

Complexity must match stage.

### Implications

No microservices without demonstrated need.

### Status

ACTIVE

---

## D-020 — Async Everything

### Decision

Capture never waits for enrichment.

### Why

Fast saves beat perfect saves.

### Implications

Save → Queue → Process Later.

### Status

LOCKED

---

## D-021 — Dedicated Worker Runtime

### Decision

Background processing runs independently from application requests.

### Why

Heavy enrichment work should never block user interactions.

### Status

ACTIVE

---

## D-022 — Universal Platform Resolver

### Decision

Platform handling occurs through resolvers.

### Why

Avoid extractor-specific sprawl.

### Status

ACTIVE

---

## D-023 — Platform-Agnostic Extraction

### Decision

Default to metadata normalization.

Not platform-specific scraping.

### Why

Scrapers create maintenance debt.

### Status

ACTIVE

---

## D-024 — Database Is Canonical Type Source

### Decision

Generated database types are authoritative.

### Why

Multiple type definitions drift.

### Status

LOCKED

---

# SECTION 7: TRUST & EXPERIENCE DECISIONS

## D-025 — Memory Trust Principle

### Decision

The system never pretends to know more than it actually knows.

### Why

False personalization destroys trust.

### Implications

Only grounded explanations are allowed.

### Status

ACTIVE

---

## D-026 — Living Memory Experience

### Decision

The interface should feel like memory exploration.

Not file management.

### Why

Administrative experiences increase cognitive load.

### Status

ACTIVE

---

## D-027 — Memory Home Over Dashboard

### Decision

Homepage becomes a memory surface.

Not an analytics dashboard.

### Why

Discovery should feel natural.

### Status

ACTIVE

---

# SECTION 8: GOVERNANCE DECISIONS

## D-028 — Documentation Is Infrastructure

### Decision

Documentation is part of the system architecture.

### Why

Context loss repeatedly caused rework.

### Status

LOCKED

---

## D-029 — Architecture Decisions Require ADRs

### Decision

Major architecture changes require explicit decision records.

### Why

Future teams must understand why decisions exist.

### Status

ACTIVE

---

## D-030 — Runtime Alignment Is Mandatory

### Decision

Architecture, documentation, and implementation must remain synchronized.

### Why

Drift creates hidden failures.

### Status

ACTIVE

---

## D-031 — Repository Audits Are Part Of Development

### Decision

Audits are a standard execution activity.

### Why

Problems are cheaper to detect than repair.

### Status

ACTIVE

---

## D-032 — Explicit Technical Debt Tracking

### Decision

Every intentional compromise must be recorded.

### Why

Untracked debt becomes architecture.

### Status

ACTIVE

---

# SECTION 9: FOUNDER OPERATING PRINCIPLES

## D-033 — Architecture Before Scale

Build systems in their final shape before expanding scope.

Status: ACTIVE

---

## D-034 — Freeze Tooling Early

Good enough tooling beats perfect tooling.

Status: ACTIVE

---

## D-035 — Founder Leverage Is The Constraint

The founder's time is the scarcest resource.

Systems must protect leverage.

Status: ACTIVE

---

## D-036 — Institutional Memory Beats Chat Memory

Critical decisions must live inside the repository.

Not inside conversations.

Status: ACTIVE

---

## D-037 — Build The Machine That Builds The Startup

Execution systems, governance systems, and memory systems are strategic assets.

Status: ACTIVE

---

# SECTION 10: REJECTED PATHS

The following directions are currently rejected:

- Folder-first organization
- Manual tagging dependency
- Social-first product strategy
- Feed-centric experience
- AI chatbot as primary interface
- Platform-specific scraper expansion as a moat
- Embeddings as source of truth
- Synchronous enrichment
- Microservices-first architecture
- Vendor-locked AI infrastructure
- Hidden personalization
- Launch before AI retrieval
- Documentation-light execution

These paths may be reconsidered in the future, but they are not part of the current operating model.

---

# Decision Log Maintenance Rules

A decision belongs in this document only if it changes:

- Product identity
- Product strategy
- Retrieval philosophy
- Memory architecture
- AI architecture
- Engineering architecture
- Governance
- Founder operating principles

Temporary implementation details belong elsewhere.

This document should remain stable and intentionally difficult to change.