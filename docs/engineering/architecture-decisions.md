# Stashly Engineering Decision Log

Purpose:

Record important product and engineering decisions.

Future developers should understand:

- What was decided
- Why it was decided
- Alternatives considered
- Consequences

---

# 2026-05-24

## Decision

Use asynchronous metadata enrichment.

Status:

Accepted

Reason:

Metadata extraction can take several seconds.

Blocking users would create poor UX.

Result:

Save instantly.

Enrich later.

---

# 2026-05-24

## Decision

Use BullMQ + Redis.

Status:

Accepted

Alternatives Considered:

- Cron Jobs
- Database Polling
- Background API Calls

Reason:

Reliable job processing.

Scalable architecture.

Industry standard.

---

# 2026-05-24

## Decision

Use Supabase as primary backend.

Status:

Accepted

Reason:

Provides:

- PostgreSQL
- Auth
- Realtime
- Storage

Reduces MVP complexity.

---

# 2026-05-24

## Decision

Use Zustand instead of Redux.

Status:

Accepted

Reason:

Smaller codebase.

Lower complexity.

Faster iteration.

Suitable for MVP.

---

# 2026-05-25

## Decision

Optimistic UI for Memory Creation.

Status:

Accepted

Reason:

Users should never wonder if Save worked.

Behavior:

Placeholder appears instantly.

Final data arrives later.

---

# 2026-05-25

## Decision

Database Is Source of Truth.

Status:

Accepted

Reason:

Frontend state can be lost.

Realtime can disconnect.

Database remains authoritative.

---

# 2026-05-25

## Decision

Realtime Updates Instead of Polling.

Status:

Accepted

Alternatives:

Polling every few seconds.

Reason:

Less latency.

Less server load.

Better UX.

---

# 2026-05-25

## Decision

Reconciliation Safety Layer.

Status:

Accepted

Reason:

Realtime systems are not perfect.

Occasional missed events must not leave UI stale.

---

# 2026-05-28

## Incident

Realtime Subscription Failure.

Symptoms:

CHANNEL_ERROR

Infinite reconnect loops.

Optimistic cards never enriched.

---

## Root Cause

Realtime channel lacked authenticated context.

RLS required:

auth.uid() = user_id

Realtime subscription could not access rows.

---

## Resolution

Authenticate realtime channel using session.

Apply filter:

user_id=eq.${session.user.id}

Result:

Realtime events successfully delivered.

Status:

Resolved

---

# 2026-05-28

## Incident

Infinite Realtime Re-subscriptions.

Symptoms:

Continuous channel recreation.

Console spam.

Memory duplication.

---

## Root Cause

Hot reload and component remounts created multiple channels.

No cleanup existed.

---

## Resolution

Singleton channel pattern.

Channel teardown.

Explicit removeChannel().

Status:

Resolved

---

# 2026-05-28

## Incident

Optimistic Card Not Replaced.

Symptoms:

Placeholder card remained forever.

Realtime event arrived successfully.

---

## Root Cause

URL mismatch between optimistic and database records.

Store could not match records.

---

## Resolution

URL normalization.

Improved upsert logic.

Status:

Resolved

---

# 2026-05-28

## Decision

Keep Processing Asynchronous.

Status:

Accepted

Reason:

Current worker time:

~3 seconds

User sees feedback immediately.

System remains scalable.

---

# 2026-05-28

## Decision

Track Performance Baselines.

Status:

Accepted

Reason:

Future optimization requires historical benchmarks.

Current Baseline:

Metadata extraction:
2760 ms

Database update:
324 ms

Total:
3103 ms

---

# Future Decisions Pending

Semantic Search

Embedding Provider

Knowledge Graph Design

Collection Model

Recommendation Engine

AI Assistant Architecture

Multi-Platform Extraction Strategy

Vector Database Selection

Agent Framework Selection

Cross-Memory Reasoning Architecture

---

# Decision Process

All major decisions should include:

Date

Decision

Reason

Alternatives

Consequences

Status

This document becomes the institutional memory of Stashly engineering.

## Decision: Canonical Memory Foundation Locked

Date: 2026-05-29

Status: Accepted

### Context

Memory Architecture, database schema, generated types, worker contracts, and application memory types had drifted apart.

Runtime behavior, documentation, and persistence models were no longer fully aligned.

This created a risk of future architectural divergence and inconsistent Memory semantics.

### Decision

Memory Architecture is the authoritative definition of Memory.

Implementation ownership chain:

Memory Architecture
→ Database Schema
→ Generated Types
→ Runtime Alignment
→ Implementation

Implementation must derive from Memory Architecture.

Schema drift must be corrected rather than accommodated.

Generated database types are the canonical runtime representation of persisted Memory.

Application Memory types derive from generated database types.

### Related Documents

- docs/product/Memory-Architecture.md
- docs/engineering/runtime-alignment.md

### Consequences

Future retrieval systems must derive from Memory.

Future AI systems must derive from Memory.

Future relationship systems must derive from Memory.

Future rediscovery systems must derive from Memory.

No subsystem may independently redefine Memory semantics.

Memory Foundation is considered locked unless a formal architecture review approves a change.

# ADR-001: Memory Type Source of Truth

## Status

Accepted

## Date

2026-05-30

## Decision

Memory types are derived from generated Supabase database types.

```ts
export type Memory = Tables<"saves">;
```

## Reason

The database schema is the canonical source of truth.

Avoids:

- Duplicate interfaces
- Schema drift
- Manual synchronization
- Runtime alignment issues

## Consequence

Changes to the saves table must be followed by:

1. Database migration
2. Type regeneration
3. TypeScript validation

Application code should consume:

```ts
Memory
```

and should not redefine Memory interfaces locally.

# ADR-002: Worker Runtime Separation

## Status

Accepted

## Date

2026-05-30

## Decision

Metadata processing runs in a dedicated BullMQ worker process.

The worker is not part of the Next.js runtime.

Development requires:

```bash
npm run dev
```

and

```bash
npm run worker
```

running simultaneously.

## Reason

Metadata extraction is asynchronous work.

Running extraction inside API routes would:

- Increase response latency
- Create request timeouts
- Prevent future scaling
- Couple user experience to external services

## Consequence

A worker outage can result in:

- Memories remaining queued
- Missing enrichment
- Delayed processing

Future versions should include:

- Worker heartbeat monitoring
- Queue monitoring
- Failed job inspection

# ADR-003: Optimistic Save Architecture

## Status

Accepted

## Date

2026-05-30

## Decision

Users receive immediate visual feedback when saving a memory.

The system creates a placeholder memory card before metadata enrichment completes.

Flow:

User Save
→ Placeholder Record
→ Queue Job
→ Worker Processing
→ Database Update
→ Realtime Update
→ Enriched Card

## Reason

Perceived performance matters more than actual enrichment time.

Metadata extraction may take several seconds depending on platform.

Users should never wait for enrichment before seeing confirmation.

## Consequence

The UI must support:

- Queued state
- Processing state
- Completed state
- Failed state

Placeholder memories are considered a first-class part of the system.

# ADR-004: Long-Term AI Provider Strategy

## Status

Accepted

## Date

2026-05-30

## Decision

Stashly will use a provider-agnostic AI architecture.

The application will not be tightly coupled to a single AI provider.

An internal AI Gateway layer will sit between Stashly and external model providers.

Initial provider:

- OpenRouter

Future providers:

- OpenAI
- Anthropic
- Google Gemini
- DeepSeek
- Qwen
- Kimi
- Local Models

## Reason

Stashly is intended to become a long-term AI Memory Operating System.

Direct integration with a single provider would create:

- Vendor lock-in
- Reduced flexibility
- Higher costs
- Lower reliability

OpenRouter provides access to multiple providers through a single interface and enables rapid experimentation during early development.

## Core Architectural Principles

### Provider Agnostic

The application should never depend on a specific model provider.

### Model Routed

The application requests capabilities, not models.

### Fault Tolerant

Model failures should trigger automatic failover whenever possible.

### Cost Aware

The routing layer should optimize for capability, reliability, and cost.

### Replaceable

Providers and models should be replaceable without requiring application-level changes.

## Free-Tier Development Strategy

During development, the system should prioritize:

1. Free models
2. High-context models
3. Lowest-cost models
4. Premium models only when required

The goal is to maximize development velocity while maintaining a near-zero infrastructure budget.

## Future Routing Strategy

Requests should eventually be routed based on task type.

Examples:

### Metadata Understanding

Use:

- Fast low-cost models

### Classification

Use:

- Fast structured-output models

### Summarization

Use:

- Mid-tier reasoning models

### Deep Memory Retrieval

Use:

- Strong reasoning models

### Complex Agent Work

Use:

- Highest capability models

## Future Failover Strategy

The system should support automatic fallback.

Example:

Primary Model
↓
Rate Limited
↓
Fallback A
↓
Fallback B
↓
Fallback C

Users should not be aware that failover occurred.

## Long-Term Vision

Stashly should eventually operate through an internal Model Router.

The application should request capabilities rather than specific models.

Example:

"Summarize Memory"

instead of

"Use Gemini"

The router determines the optimal model based on:

- Cost
- Availability
- Latency
- Context Window
- Quality Requirements

This allows models to change over time without requiring application-level changes.