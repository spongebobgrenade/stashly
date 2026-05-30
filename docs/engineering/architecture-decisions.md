# Stashly Engineering Decision Log

Purpose:

Record important product and engineering decisions.

Future contributors should understand:

- What was decided
- Why it was decided
- Alternatives considered
- Consequences

This document records accepted architectural decisions.

Resolved incidents may be retained if they materially shaped the architecture.

---

# 2026-05-24

## Decision

Use Asynchronous Metadata Enrichment

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

Use BullMQ + Redis

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

Use Supabase As Primary Backend

Status:

Accepted

Reason:

Provides:

- PostgreSQL
- Authentication
- Realtime
- Storage

Reduces MVP complexity.

---

# 2026-05-24

## Decision

Use Zustand For Client State

Status:

Accepted

Alternatives Considered:

- Redux
- MobX
- Context Only

Reason:

Lower complexity.

Fast iteration.

Small bundle size.

Suitable for MVP and future growth.

---

# 2026-05-25

## Decision

Optimistic Memory Creation

Status:

Accepted

Reason:

Users should receive immediate feedback.

Behavior:

Placeholder memory appears instantly.

Metadata arrives asynchronously.

---

# 2026-05-25

## Decision

Database Is Source Of Truth

Status:

Accepted

Reason:

Frontend state can be lost.

Realtime can disconnect.

Workers can restart.

The database remains authoritative.

---

# 2026-05-25

## Decision

Realtime As Primary Update Transport

Status:

Accepted

Alternatives Considered:

- Polling
- Manual refresh

Reason:

Lower latency.

Better user experience.

Reduced database load.

---

# 2026-05-25

## Decision

Reconciliation Safety Layer

Status:

Accepted

Reason:

Realtime delivery is not guaranteed.

Missed events must not leave UI stale.

Result:

Synchronization Layer includes:

- Realtime
- Reconciliation

---

# 2026-05-28

## Incident

Realtime Subscription Failure

Symptoms:

- CHANNEL_ERROR
- Infinite reconnect loops
- Optimistic memories never updated

Root Cause:

Realtime subscription lacked authenticated context.

RLS required:

```text
auth.uid() = user_id
```

Resolution:

Authenticate channel using active session.

Scope subscriptions by:

```text
user_id = current user
```

Status:

Resolved

---

# 2026-05-28

## Incident

Infinite Realtime Re-subscriptions

Symptoms:

- Continuous channel recreation
- Console spam
- Memory duplication

Root Cause:

Multiple mounts created multiple channels.

No singleton ownership existed.

Resolution:

Singleton channel pattern.

Explicit teardown.

Status:

Resolved

---

# 2026-05-28

## Incident

Optimistic Memory Not Replaced

Symptoms:

Placeholder memory persisted indefinitely.

Realtime updates arrived successfully.

Root Cause:

URL mismatch prevented optimistic replacement.

Resolution:

URL normalization.

Improved store reconciliation.

Status:

Resolved

---

# 2026-05-29

## Decision

Canonical Memory Foundation Locked

Status:

Accepted

Reason:

Memory semantics had begun drifting between:

- Documentation
- Database
- Runtime
- Types

Decision:

Memory Architecture becomes authoritative.

Ownership chain:

Memory Architecture
↓
Database Schema
↓
Generated Types
↓
Runtime Alignment
↓
Implementation

Consequence:

All future systems derive from Memory.

No subsystem may redefine Memory semantics.

---

# ADR-001

## Title

Memory Type Source Of Truth

## Status

Accepted

## Date

2026-05-30

## Decision

Memory derives from generated Supabase types.

```ts
export type Memory = Tables<"saves">;
```

## Reason

Avoid:

- duplicate interfaces
- schema drift
- manual synchronization

## Consequence

Schema changes require:

1. Migration
2. Type regeneration
3. Validation

---

# ADR-002

## Title

Worker Runtime Separation

## Status

Accepted

## Date

2026-05-30

## Decision

Metadata processing runs in a dedicated BullMQ worker.

Worker is independent from Next.js.

Required development processes:

```bash
npm run dev
```

```bash
npm run worker
```

## Reason

Metadata extraction is asynchronous work.

Keeping it outside request-response improves:

- reliability
- scalability
- responsiveness

## Consequence

Worker outages can leave memories queued.

Future observability is required.

---

# ADR-003

## Title

Optimistic Save Architecture

## Status

Accepted

## Date

2026-05-30

## Decision

Users receive immediate feedback before enrichment completes.

Flow:

User Save
↓
Optimistic Memory
↓
Queue Job
↓
Worker
↓
Database Update
↓
Synchronization
↓
Final Memory

## Reason

Perceived performance matters more than enrichment latency.

## Consequence

Queued and processing states are first-class concepts.

---

# ADR-004

## Title

Provider-Agnostic AI Strategy

## Status

Accepted

## Date

2026-05-30

## Decision

AI systems must remain provider agnostic.

Future architecture:

Application
↓
AI Gateway
↓
Provider Layer

Initial provider:

OpenRouter

Future providers:

- OpenAI
- Anthropic
- Gemini
- DeepSeek
- Qwen
- Kimi
- Local Models

## Consequence

Application code requests capabilities, not models.

---

# ADR-005

## Title

Synchronization Layer Architecture

## Status

Accepted

## Date

2026-05-30

## Decision

Memory delivery is owned by a dedicated Synchronization Layer.

Current transports:

- Realtime Transport
- Reconciliation Transport

Both transports must update state through:

```ts
upsertMemory()
```

## Reason

Memory delivery should not depend on a single transport.

Future transports must integrate without changing UI logic.

Examples:

- Mobile Sync
- Extension Sync
- Offline Recovery
- Multi-Device Sync

## Consequence

Transports become replaceable.

State updates remain consistent.

Synchronization owns delivery.

Database remains authoritative.

---

# ADR-006

## Title

Resolver Owns Classification

## Status

Accepted

## Date

2026-05-30

## Decision

Classification ownership belongs exclusively to the Resolver.

Resolver owns:

- platform
- contentType
- normalizedUrl
- identifier

Extractors own:

- title
- description
- thumbnail
- attribution
- canonical URL
- raw metadata

Extractors must not redefine classification.

## Reason

Classification and enrichment are different responsibilities.

Mixing them caused:

- GitHub classification drift
- platform ownership confusion
- metadata ownership ambiguity

## Consequence

Worker persists:

```text
resolved.platform
resolved.contentType
```

directly.

Classification becomes deterministic.

---

# ADR-007

## Title

Extractor Registry Architecture

## Status

Accepted

## Date

2026-05-30

## Decision

Platform-specific extractor selection is owned by an Extractor Registry.

Current registry entries:

- youtube
- github
- website
- unknown

## Reason

Avoid switch-statement growth.

Allow platform expansion without worker modification.

## Consequence

Future platforms register extractors rather than modifying processing logic.

Examples:

- Instagram
- TikTok
- Spotify
- LinkedIn
- Notion

---

# Future Decisions Pending

- Platform Expansion Strategy
- Embedding Architecture
- Semantic Retrieval Architecture
- Knowledge Graph Architecture
- Collections Model
- Rediscovery Engine
- Relationship Engine
- Agent Framework Selection
- AI Retrieval Architecture
- Cross-Memory Reasoning

---

# Decision Process

All major decisions should include:

- Date
- Decision
- Reason
- Alternatives
- Consequences
- Status

This document serves as institutional memory for Stashly engineering.

---

# Last Updated

After:

- Search Architecture V1
- Synchronization Layer V1
- Resolver Ownership Refactor
- Extractor Registry Introduction

Status:

Active