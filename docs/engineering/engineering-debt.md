# Stashly Engineering Debt Register

Status: Active

---

# Purpose

This document tracks active engineering debt only.

Completed items are removed from active debt and listed separately as resolved.

---

# Priority Levels

- `P0`: Must fix before scale or correctness depends on it
- `P1`: Must fix before public launch
- `P2`: Fix before major feature expansion
- `P3`: Deferred cleanup opportunity

---

# Active Debt

## ED-001

Title:

Metadata Retry Strategy Missing

Priority:

P1

Current State:

Metadata extraction still attempts once and then writes `failed`.

Debt:

- transient platform failures become permanent failures

---

## ED-002

Title:

Raw Metadata Stored Unbounded

Priority:

P1

Current State:

`raw_metadata` has no size control strategy.

Debt:

- storage growth risk
- backup cost growth

---

## ED-003

Title:

Always-On Reconciliation Polling

Priority:

P2

Current State:

- polling every 15 seconds regardless of pending-state presence

Debt:

- unnecessary API traffic

---

## ED-004

Title:

Unstructured Worker Logging

Priority:

P2

Current State:

- metadata and embedding workers log with `console.log()` / `console.error()`

Debt:

- poor queryability
- weak observability

---

## ED-005

Title:

No Queue Monitoring Dashboard

Priority:

P2

Current State:

- queue visibility is log-only

Debt:

- no queue health view
- no failed job dashboard

---

## ED-006

Title:

Embedding Storage Lifecycle Undefined

Priority:

P1

Current State:

- embedding worker inserts into `memory_embeddings`
- no documented replacement, invalidation, or regeneration strategy exists

Debt:

- repeated embedding runs can create duplicate or stale derived artifacts
- provider/model upgrades lack cleanup strategy

---

## ED-007

Title:

Semantic Retrieval Serving Path Missing

Priority:

P1

Current State:

- embedding infrastructure exists
- retrieval remains keyword-only

Debt:

- V2 retrieval foundation is present but not query-serving
- launch-critical retrieval value is still missing

---

## ED-008

Title:

Local Embedding Provider Dependency

Priority:

P1

Current State:

- default embedding provider is local Ollama at `http://localhost:11434`

Debt:

- no fallback provider
- no production provider strategy implemented in runtime
- local environment dependency can block semantic pipeline validation

---

## ED-09

Title:

Unsafe Embedding Persistence Casting

Priority:

P2

Current State:

- embedding worker persists vectors with `as never`

Debt:

- type safety boundary is weak in derived retrieval persistence

---

## ED-010

Title:

Unused Chunking Foundation

Priority:

P3

Current State:

- `chunk-builder.ts` exists
- embedding pipeline currently uses `buildRetrievalDocument()` directly

Debt:

- chunking abstraction is not integrated
- chunk strategy remains undefined for longer retrieval documents

---

## ED-011

Title:

Distributed Worker Scaling Deferred

Priority:

P3

Current State:

- single metadata worker
- single embedding worker

Debt:

- horizontal scaling architecture is not yet implemented

---

## ED-012

Title:

JSON Architecture Parity Drift

Priority:

P3

Status:

Accepted

Current State:

- Markdown architecture documents have been updated
- JSON companion documents remain out of sync

Affected Files:

- PRD.json
- Memory-Architecture.json
- Philosophy.json
- TRD.json

Debt:

- documentation drift
- future architecture automation may consume stale JSON definitions
- markdown and JSON sources no longer represent the same architecture state

Current Decision:

Accepted temporarily.

Markdown documents remain authoritative until parity is restored.

Future Solution:

Perform a repository-wide JSON parity alignment pass.

Update all JSON architecture documents to match their Markdown counterparts.

Review Trigger:

- Codex budget becomes available
OR
- architecture automation begins consuming JSON documents
OR
- next major architecture review

---

# Resolved Debt

The following are no longer active debt:

- platform resolver introduction
- extractor registry introduction
- resolver-owned classification
- Search V1 wiring
- Memory bootstrap extraction
- Synchronization V1 foundation
- memory_embeddings migration alignment

---

# Debt Accepted For Current Phase

Currently accepted:

- reconciliation polling
- console logging
- single-worker-per-pipeline model
- no queue dashboard
- local Ollama dependency for embedding generation

Reason:

The current phase prioritizes retrieval architecture validation over operational polish.

---

# Review Questions

Review active debt whenever asking:

1. Is this blocking public launch?
2. Is this blocking semantic retrieval?
3. Is this causing environment drift?
4. Is this increasing operational risk?
5. Is this weakening Memory or retrieval correctness?

---

# Last Updated

After:

- Retrieval V1
- Synchronization V1
- Embedding Architecture V1

## Architecture Drift Audit V2

Priority: Medium

Current Limitation:
- TRD.md dependency validation uses normalized text matching.

Desired State:
- Section-aware dependency validation.
- Dependency hierarchy validation.
- Cross-document dependency graph verification.

Reason:
- Reduce false positives.
- Increase trust in audit output.

# Architecture Drift Audit

## V1 Status

Status: COMPLETE

Purpose:
Detect drift between canonical architecture documents.

Coverage:
- Memory Architecture V1
- Memory Architecture JSON
- TRD
- TRD JSON
- Architecture Status

Result:
- 41 PASS
- 0 WARNING
- 0 FAIL

Implemented:
- File existence validation
- Architecture hierarchy validation
- Version consistency validation
- Status validation
- Retrieval architecture validation

---

## V2 Backlog

Priority: Medium

### Section-Aware Dependency Validation

Current:
- Dependency checks rely partially on normalized text presence.

Target:
- Validate dedicated dependency sections structurally.

Reason:
- Reduce false positives.

### Cross-Document Dependency Graph Validation

Current:
- Documents are validated individually.

Target:
- Verify dependency chains across architecture documents.

Example:
- Memory Architecture → TRD → Architecture Status

Reason:
- Detect architectural drift across documents.

### Architecture Hierarchy Validation

Current:
- Basic hierarchy checks exist.

Target:
- Enforce the complete architecture dependency graph automatically.

Reason:
- Prevent future synchronization drift.

# Schema Audit V2

Status: DESIGN APPROVED

## Future Improvements:

- RLS policy validation
- Function validation
- Trigger validation
- Extraneous table detection
- Auto-remediation suggestions
- CI enforcement

## SECURITY-001: Missing Security Audit Layer

Status: Open
Severity: Medium
Discovered: 2026-06-11

Context:
Supabase Security Advisor flagged `memory_representations` because RLS was not enabled.

Root Cause:
The governance system evolved around:
- Architecture Audits
- Runtime Alignment
- Schema Alignment
- Technical Debt Tracking

but did not include a dedicated Security Audit layer.

Impact:
No active vulnerability was present because:
- Retrieval is not live
- memory_representations is empty

However, future Memory V1 data (topics, entities, insights, summaries) is sensitive user data and must be protected by ownership policies.

Resolution:
- Enable RLS on memory_representations
- Enable RLS on memory_embeddings
- Add Security Audit checklist to repository governance

Lesson:
Architecture drift is not the only drift category. Security drift must also be monitored.

### DEBT-014: Missing RLS on Memory Tables

Status: Resolved

Date Resolved: 2026-06-11

Issue

The Memory Architecture introduced two new canonical tables:

- memory_representations
- memory_embeddings

Both tables were created successfully and functioned correctly.

However, Row Level Security (RLS) was never enabled on either table.

As a result, the implementation drifted from the project's documented security architecture.

Discovery

The issue was discovered during founder documentation consolidation while reviewing Supabase Security Advisor warnings.

The repository audit process did not detect the issue because existing audits focused on:

- architecture alignment
- schema alignment
- runtime alignment

but did not include a security advisor review step.

Impact

No user-facing failures occurred.

However:

- database security posture diverged from architecture expectations
- future environments recreated from incomplete migrations would inherit the issue
- the architecture repository no longer fully represented production reality

Resolution

Created Migration 008:

008_enable_rls_on_memory_tables.sql

The migration:

- enabled RLS on memory_representations
- enabled RLS on memory_embeddings
- added ownership-based SELECT policies

The migration was applied successfully to production and committed to source control.

Lessons

1. Repository audits alone are insufficient.
2. Security Advisor reviews must be included in audit procedures.
3. Production fixes must always be backported into migrations.
4. New tables should never be considered complete until:
   - RLS is enabled
   - policies exist
   - Security Advisor passes review

Preventive Action

Add Security Advisor verification to future repository audit checklists.