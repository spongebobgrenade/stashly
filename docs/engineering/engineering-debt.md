# Stashly Engineering Debt Register

Status: Active

Purpose:

Track known engineering debt, accepted shortcuts, deferred scalability work, and implementation compromises.

Engineering debt is not a bug.

Engineering debt is a conscious decision to accept future cleanup cost in exchange for current execution speed.

This document only tracks active debt.

Resolved debt should be removed rather than retained.

---

# Debt Classification

## P0

Must fix before scale.

## P1

Fix before public launch.

## P2

Fix before major feature expansion.

## P3

Cleanup opportunity.

---

# Active Engineering Debt

---

## ED-001

Title:

Metadata Retry Strategy Missing

Priority:

P1

Status:

Open

Current State:

Metadata extraction attempts exactly once.

Failure path:

queued
↓
processing
↓
failed

Problem:

Temporary network failures become permanent failures.

Future Solution:

BullMQ retry policies.

Example:

- 3 retries
- exponential backoff
- retryable error classification

Expected Benefit:

Higher enrichment success rates.

---

## ED-002

Title:

Raw Metadata Stored Unbounded

Priority:

P1

Status:

Open

Current State:

raw_metadata is stored without size controls.

Problem:

Large platform payloads may significantly increase:

- storage cost
- backup size
- replication cost

Future Solution:

Store:

- required fields only

or

- archive raw payloads into object storage

Expected Benefit:

Controlled storage growth.

---

## ED-003

Title:

Reconciliation Polling Is Always Active

Priority:

P2

Status:

Open

Current State:

Synchronization Layer polls:

```text
/api/memories/pending
```

every 15 seconds.

Problem:

Polling continues even when no pending memories exist.

Impact:

Unnecessary API traffic.

Future Solution:

State-aware synchronization.

Example:

Pending Memories Exist
↓
Polling Enabled

No Pending Memories
↓
Polling Disabled

Expected Benefit:

Reduced infrastructure load.

---

## ED-004

Title:

Realtime Lifecycle Exists Only In Browser Memory

Priority:

P2

Status:

Open

Current State:

Realtime channel lifecycle is managed in browser runtime.

Problem:

Subscriptions are recreated on refresh.

Current Impact:

Acceptable.

Future Impact:

May complicate:

- multi-tab coordination
- future synchronization transports

Future Solution:

Dedicated synchronization manager.

---

## ED-005

Title:

Worker Logging Uses Console Statements

Priority:

P2

Status:

Open

Current State:

Worker logging uses:

```ts
console.log()
console.error()
```

Problem:

Logs are not structured.

Logs are difficult to query.

Future Solution:

Structured logging.

Potential Tools:

- Pino
- Axiom
- OpenTelemetry
- Datadog

Expected Benefit:

Better debugging and observability.

---

## ED-006

Title:

No Queue Monitoring Dashboard

Priority:

P2

Status:

Open

Current State:

Queue visibility exists only through logs.

Missing:

- queue health visibility
- failure visibility
- processing metrics

Future Solution:

Bull Board

or

Custom Operations Dashboard

Metrics:

- queued jobs
- processing jobs
- failed jobs
- retry count
- processing latency

Expected Benefit:

Operational visibility.

---

## ED-007

Title:

Loose Metadata Typing

Priority:

P2

Status:

Open

Current State:

Metadata contracts are improving but extractor outputs are still not enforced through a fully canonical extraction interface.

Problem:

Future platform growth may introduce contract drift.

Future Solution:

Formal extractor contract hierarchy.

Example:

```ts
MetadataEnrichment
ExtractedMetadata
```

become mandatory interfaces across all extractors.

Expected Benefit:

Compile-time enforcement.

---

## ED-008

Title:

Distributed Worker Architecture Deferred

Priority:

P3

Status:

Deferred

Current State:

Single metadata worker.

Future Requirement:

Multiple workers sharing:

- Redis
- BullMQ queues

Future Solution:

Horizontal worker scaling.

Expected Benefit:

Higher throughput.

---

## ED-009

Title:

Metadata Extraction Latency

Priority:

P1

Status:

Accepted

Current State:

Typical enrichment:

~2–5 seconds

Impact:

Users wait several seconds before full enrichment appears.

Current Decision:

Acceptable for MVP.

Future Solution:

- caching
- platform-specific optimizations
- parallel enrichment
- extractor performance tuning

Expected Benefit:

Faster enrichment.

---

## ED-010

Title:

Synchronization Layer Transport Consolidation

Priority:

P2

Status:

Deferred

Current State:

Realtime Transport and Reconciliation Transport independently deliver updates.

Problem:

Future transports will increase synchronization complexity.

Future Requirement:

Unified synchronization manager.

Future Transports:

- Realtime
- Reconciliation
- Mobile Sync
- Extension Sync
- Offline Recovery

Future Solution:

Dedicated Sync Manager abstraction.

Expected Benefit:

Single synchronization ownership model.

---

# Resolved Debt

The following debt has been repaid and is no longer considered active:

✓ Platform Resolver

✓ Extractor Registry

✓ GitHub Classification Ownership

✓ Resolver-Owned Classification

✓ MemoryFeed Type Safety

✓ Search Architecture V1

✓ MemoryBootstrap Extraction

✓ Synchronization Layer V1 Foundation

✓ User-Scoped Reconciliation Endpoint

These items should not be reintroduced into future debt registers.

---

# Debt Accepted For MVP

The following debt is intentionally accepted:

✓ Reconciliation Polling

✓ Console Logging

✓ Single Worker

✓ No Queue Dashboard

✓ Metadata Extraction Latency

Reason:

Current priority is expanding Memory capabilities rather than operational optimization.

---

# Debt Review Process

Review every sprint.

Questions:

1. Is this slowing development?

2. Is this causing production issues?

3. Is this increasing operational cost?

4. Is this blocking platform expansion?

5. Is this blocking semantic retrieval?

If YES:

Schedule repayment.

Otherwise:

Continue shipping.

---

# Last Updated

After:

- Metadata Architecture V1
- Search Architecture V1
- Synchronization Layer V1
- Extractor Registry Refactor

Status:

Active