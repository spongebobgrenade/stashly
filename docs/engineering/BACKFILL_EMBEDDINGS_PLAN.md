# Embedding Backfill Plan

Version: 1.0

Status: Planned

Owner: Stashly Engineering

Last Updated: 2026-06-01

---

# Objective

Create embeddings for all historical saves that existed before the semantic retrieval system was introduced.

This backfill will bring semantic search coverage from partial coverage to full coverage for existing user content.

---

# Background

Semantic Retrieval V2 is now operational.

The retrieval pipeline can:

1. Generate embeddings
2. Store embeddings
3. Perform similarity search
4. Return semantic matches through the application

However, semantic retrieval currently only works for saves that were processed after the embedding system was introduced.

Historical saves do not yet have embeddings.

---

# Current State

Example snapshot at time of planning:

Total Saves:
78

Total Embeddings:
3

Missing Embeddings:
75

Semantic Coverage:
3.8%

---

# Desired State

Total Saves:
78

Total Embeddings:
78

Missing Embeddings:
0

Semantic Coverage:
100%

---

# Success Criteria

The backfill is considered complete when:

1. Every eligible save has at least one embedding
2. No duplicate embeddings are created
3. No existing embeddings are overwritten
4. Semantic retrieval works across historical content
5. Save count equals embedding coverage count

Verification Query:

Total Saves == Total Embedded Saves

---

# Design Principles

## Principle 1

Backfill must be idempotent.

Running the worker multiple times should not create duplicate embeddings.

---

## Principle 2

Backfill must be resumable.

If interrupted:

- crash
- deployment restart
- network failure
- API failure

the worker should resume safely.

---

## Principle 3

Backfill must process only missing records.

Existing embeddings must be skipped.

---

## Principle 4

Backfill must support batching.

The system should never attempt to process the entire dataset in one execution cycle.

---

## Principle 5

Backfill progress must be observable.

Engineers must be able to determine:

- total remaining
- total completed
- current record
- failures

without inspecting the database manually.

---

# Execution Strategy

## Step 1

Find saves without embeddings.

Conceptually:

saves
LEFT JOIN memory_embeddings

Return only saves that have no embedding rows.

---

## Step 2

Process records in batches.

Initial configuration:

Batch Size = 10

Future optimization may increase batch size after performance testing.

---

## Step 3

Generate retrieval document.

Input:

Save metadata

Examples:

- title
- description
- creator
- content type
- source metadata

The retrieval document should match the production embedding generation pipeline.

---

## Step 4

Generate embedding.

Use the existing embedding gateway.

Do not create a separate embedding implementation.

Backfill must reuse the production embedding path.

---

## Step 5

Persist embedding.

Store using the existing memory_embeddings schema.

Do not bypass production storage logic.

---

## Step 6

Log result.

Example:

[1/75] Embedded save abc123

[2/75] Embedded save xyz456

---

## Step 7

Continue until no missing saves remain.

---

# Failure Handling

## Embedding Generation Failure

If embedding generation fails:

- log failure
- continue processing remaining saves

The entire batch must not fail because one save failed.

---

## Database Write Failure

If storage fails:

- log save id
- continue processing

---

## Unexpected Worker Crash

Worker should be rerunnable.

Previously completed embeddings should be skipped automatically.

---

# Verification Plan

## Pre-Execution Verification

Measure:

Total Saves

Total Embeddings

Missing Embeddings

Example:

78 saves

3 embeddings

75 missing

---

## During Execution

Track:

Processed

Succeeded

Failed

Remaining

---

## Post-Execution Verification

Verify:

Total Saves

Total Embedded Saves

Missing Saves

Expected:

Missing Saves = 0

---

# Rollback Strategy

No rollback is required.

Backfill only adds embeddings.

No user content is modified.

No saves are deleted.

No metadata is overwritten.

---

# Risks

## Risk 1

Embedding provider rate limits.

Mitigation:

Small batch size

Retry strategy

---

## Risk 2

Unexpected malformed save content.

Mitigation:

Per-record error handling

Continue processing

---

## Risk 3

Long-running execution.

Mitigation:

Batching

Progress logging

Resumable design

---

# Operational Checklist

Before Running

- Retrieval V2 verified
- Embedding pipeline verified
- Database migration applied
- Types generated
- Save count measured
- Embedding count measured

Run

- Execute backfill worker
- Monitor logs
- Record failures

After Completion

- Verify save count equals embedded save count
- Test semantic search against historical saves
- Record completion in engineering notes

---

# Expected Outcome

After successful execution:

- Historical saves become searchable through semantic retrieval
- Semantic search coverage reaches 100%
- Retrieval quality improves significantly
- Future saves continue using the normal embedding pipeline
- No manual intervention required for historical content