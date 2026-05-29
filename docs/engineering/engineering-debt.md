# Stashly Engineering Debt Register

Purpose:

Track all known shortcuts, temporary implementations, architectural compromises, and future refactors.

Engineering debt is not a bug.

Engineering debt is a conscious decision to move faster now while accepting future cleanup cost.

---

# Debt Classification

P0 = Must Fix Before Scale

P1 = Fix Before Public Launch

P2 = Fix Before Major Feature Expansion

P3 = Cleanup Opportunity

---

# Current Engineering Debt

---

## ED-001

Title:

Inline Platform Detection

Priority:

P2

Status:

Open

Location:

processMemoryJob()

Current Implementation:

```ts
if (
  url.includes("youtube.com") ||
  url.includes("youtu.be")
)
```

Problem:

Platform logic is embedded inside worker code.

As more platforms are added:

Instagram
TikTok
Twitter
GitHub
Notion
Spotify

worker complexity will increase rapidly.

Future Solution:

Create:

platform-resolver.ts

Example:

```ts
const platform =
  resolvePlatform(url);
```

Benefit:

Single source of platform detection.

---

## ED-002

Title:

YouTube Only Metadata Support

Priority:

P1

Status:

Open

Problem:

Current extraction supports only YouTube.

Future Requirement:

Support:

Instagram
TikTok
Twitter/X
LinkedIn
GitHub
Notion
Spotify
Articles
PDFs

Future Solution:

Extractor Registry

```ts
extractMetadata(
  platform,
  url
)
```

Benefit:

Open/Closed architecture.

---

## ED-003

Title:

Loose Metadata Typing

Priority:

P2

Status:

Open

Current:

```ts
let metadata = {
 ...
}
```

Problem:

Weak compile-time guarantees.

Future Solution:

```ts
type MetadataResult
```

Shared contract across extractors.

---

## ED-004

Title:

Raw Metadata Stored Unbounded

Priority:

P1

Status:

Open

Problem:

Large platform payloads may significantly increase database size.

Potential Impact:

Storage costs

Slower queries

Larger backups

Future Solution:

Store:

Required Fields Only

OR

Move raw payloads to object storage.

---

## ED-005

Title:

Memory Feed Uses Any[]

Priority:

P2

Status:

Open

Current:

```ts
initialMemories: any[]
```

Problem:

Loss of type safety.

Future Solution:

```ts
Memory[]
```

Benefit:

Safer refactors.

---

## ED-006

Title:

Reconciliation Polling

Priority:

P2

Status:

Open

Purpose:

Recover from missed realtime events.

Problem:

Extra API calls.

Not ideal at scale.

Future Solution:

Improve realtime reliability.

Reduce polling frequency.

Eventually eliminate reconciliation.

---

## ED-007

Title:

Realtime Singleton Exists Only In Browser Memory

Priority:

P2

Status:

Open

Problem:

Channel state resets on refresh.

Current Impact:

Acceptable.

Future Impact:

Potential subscription management complexity.

Future Solution:

Dedicated Realtime Manager.

---

## ED-008

Title:

Memory Card Uses Native img Tag

Priority:

P3

Status:

Open

Current:

```tsx
<img />
```

Problem:

No image optimization.

Future Solution:

Next.js Image component.

Benefit:

Lazy loading.

Compression.

Responsive sizing.

---

## ED-009

Title:

No Retry Strategy For Metadata Extraction

Priority:

P1

Status:

Open

Current Behavior:

Single extraction attempt.

Failure = failed status.

Future Solution:

BullMQ retries.

Example:

3 retries

Exponential backoff

Benefit:

Improved reliability.

---

## ED-010

Title:

Worker Logging Uses Console Statements

Priority:

P2

Status:

Open

Current:

```ts
console.log()
```

Problem:

Not searchable.

Not structured.

Future Solution:

Structured logging.

Potential tools:

Pino

Axiom

Datadog

OpenTelemetry

---

## ED-011

Title:

No Distributed Worker Support

Priority:

P3

Status:

Deferred

Current:

Single worker.

Future:

Multiple workers.

Shared Redis.

Horizontal scaling.

---

## ED-012

Title:

No Queue Monitoring Dashboard

Priority:

P2

Status:

Open

Future Solution:

Bull Board

or

Custom Admin Panel

Metrics:

Jobs queued

Jobs processing

Jobs failed

Average processing time

---

## ED-013

Title:

Metadata Extraction Latency

Priority:

P1

Status:

Accepted

Current:

~2.7 seconds

Impact:

Users wait 3–4 seconds for enrichment.

Current Decision:

Acceptable for MVP.

Future Solution:

Parallel extraction.

Platform-specific optimizations.

Caching.

---

# Debt Accepted For MVP

The following debts are intentionally accepted:

✓ Single Worker

✓ YouTube-only extraction

✓ Reconciliation polling

✓ Console logging

✓ Native image rendering

✓ Manual platform detection

Reason:

Speed of execution is currently more valuable than architectural perfection.

---

# Debt Review Process

Review every sprint.

Questions:

1. Is this debt slowing development?

2. Is this debt creating bugs?

3. Is this debt increasing costs?

4. Is this debt blocking scale?

If YES:

Schedule repayment.

Otherwise:

Keep shipping.

---

# Last Updated

2026-05-28

Status:

Active