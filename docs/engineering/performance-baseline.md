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

Worker Starts

↓

Metadata Extraction

↓

Database Update

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

3–4 seconds

Status:

Acceptable

---

# Worker Metrics

Measured Job:

YouTube Metadata Extraction

---

## Metadata Extraction

Measured:

2760 ms

Status:

Largest bottleneck

Contribution:

~89%

---

## Database Update

Measured:

324 ms

Status:

Healthy

Contribution:

~11%

---

## Total Worker Time

Measured:

3103 ms

Status:

Acceptable

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

1

Current Queue:

memory-processing

Observed Throughput:

Single-job execution

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

Single Worker

Expected:

Several thousand memories/day

without issue.

---

Future Architecture

Multiple Workers

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

Overall System:

MVP Ready

---

# Last Updated

2026-05-28