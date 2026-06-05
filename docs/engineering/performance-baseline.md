# Stashly Performance Baseline

Purpose:

Maintain a historical record of system performance.

Future optimizations should always be compared against recorded baselines.

Without baselines, performance improvements cannot be measured objectively.

---

# Measurement Environment

Date:

2026-05-28

Environment:

Local Development

Machine:

MacBook Air M2

RAM:

8 GB

Frontend:

Next.js 16

Database:

Supabase PostgreSQL

Queue:

BullMQ

Broker:

Redis

Realtime:

Supabase Realtime

Metadata Source:

YouTube

Embedding Provider:

Ollama (Nomic Embed Text)

---

# Current Save Flow

User Clicks Save

↓

API Validation

↓

Database Insert

↓

Queue Job Creation

↓

Immediate Response

↓

Optimistic Card Appears

↓

Metadata Worker Starts

↓

Metadata Extraction

↓

Database Update

↓

Embedding Worker Starts

↓

Retrieval Document Generation

↓

Embedding Generation

↓

Vector Storage

↓

Realtime Event

↓

Card Enriched

---

# User Experience Metrics

---

## Time To Feedback

Definition:

Time from Save click until placeholder appears.

Measured:

<100 ms

Status:

Excellent

---

## Time To Visible Memory

Definition:

Time until placeholder card appears.

Measured:

Immediate

Status:

Excellent

---

## Time To Enriched Memory

Definition:

Time until final card displays metadata.

Measured:

Measurement Required (Previously 3-4 seconds)

Status:

Measurement Required

---

# Worker Metrics

Measured Job:

YouTube Metadata Extraction & Embedding

---

## Metadata Extraction

Measured:

2760 ms

Status:

Largest bottleneck

---

## Database Update

Measured:

324 ms

Status:

Healthy

---

## Retrieval Document Generation

Measured:

Measurement Required

Status:

Measurement Required

---

## Embedding Generation

Measured:

Measurement Required

Status:

Measurement Required

---

## Vector Storage

Measured:

Measurement Required

Status:

Measurement Required

---

## Total Worker Time

Measured:

Measurement Required (Previously 3103 ms without embeddings)

Status:

Measurement Required

---

# Retrieval Metrics

## Keyword Search Latency

Measured:

Measurement Required

Status:

Measurement Required

## Semantic Retrieval V2 Latency

Measured:

Measurement Required

Status:

Measurement Required

---

# Realtime Metrics

Subscription Status:

Operational

Authentication:

Operational

RLS:

Operational

Observed Delivery:

Near Instant

Estimated:

<200 ms

Status:

Healthy

---

# Queue Metrics

Current Worker Count:

Multiple Workers (Metadata, Embedding)

Current Queue:

memory-processing, embedding-processing

Observed Throughput:

Measurement Required

Status:

Healthy

---

# Frontend Metrics

Optimistic Rendering:

Working

Realtime Updates:

Working

Store Synchronization:

Working

Reconciliation Layer:

Working

Status:

Healthy

---

# Bottleneck Analysis

Ranked By Impact

---

## Bottleneck #1

Metadata Extraction

Time:

2760 ms

Impact:

Very High

Priority:

P1

Future Options:

Caching

Parallel extraction

Platform-specific optimization

---

## Bottleneck #2

Database Update

Time:

324 ms

Impact:

Low

Priority:

P3

No action required.

---

## Bottleneck #3

Realtime Propagation

Time:

<200 ms

Impact:

Very Low

Priority:

P4

No action required.

---

# Capacity Estimates

Current Architecture

Multiple Workers

Expected:

Several thousand memories/day

without issue.

---

Future Architecture

Scaling Workers

Shared Redis

Expected:

Hundreds of thousands/day

---

# Performance Targets

## MVP Target

Placeholder:

<200 ms

Enriched Card:

<5 seconds

Status:

PASS

---

## V1 Target

Placeholder:

<100 ms

Enriched Card:

<3 seconds

Status:

NEEDS OPTIMIZATION

---

## Long-Term Target

Placeholder:

Instant

Enriched Card:

<1 second

Status:

Future Goal

---

# Historical Record

## Baseline 2026-05-28

Metadata Extraction:

2760 ms

Database Update:

324 ms

Total Worker:

3103 ms

Enriched Card:

3–4 seconds

Result:

Accepted

---

# Optimization Backlog

1. Metadata cache

2. Extractor registry

3. Parallel extraction

4. Queue concurrency

5. Multiple workers

6. Structured monitoring

7. Performance dashboard

8. Extraction benchmarking suite
9. Embedding generation optimization

---

# Current Assessment

Frontend:

Excellent

Realtime:

Excellent

Queue:

Healthy

Database:

Healthy

Worker:

Healthy

Metadata Speed:

Needs Optimization

Embedding Speed:

Measurement Required

Overall System:

MVP Ready

---

# Last Updated

2026-06-02