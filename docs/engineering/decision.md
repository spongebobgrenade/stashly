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