# Semantic Retrieval V2 Postmortem

Date:
2026-06-01

Status:
Resolved

Severity:
High

Affected System:
Semantic Retrieval

---

## Problem

Semantic search returned empty results through the application even though embeddings existed and similarity search appeared to work from SQL.

---

## Symptoms

- Embeddings existed
- SQL similarity search returned matches
- Semantic retrieval API returned zero results
- No obvious RPC errors
- Authenticated users could not retrieve embedding matches

---

## Initial Assumptions

Possible causes considered:

- Broken embeddings
- Incorrect vector dimensions
- Similarity threshold issues
- Retrieval strategy bugs
- Missing database types
- RLS policies
- RPC parameter mismatch

---

## Investigation Timeline

### Phase 1

Verified:

- embeddings stored correctly
- vectors generated correctly
- similarity search returned results in SQL editor

Result:

Embedding generation not the issue.

---

### Phase 2

Created diagnostics:

- diagnostic migration
- semantic RLS diagnostic route
- admin visibility checks
- authenticated visibility checks

Result:

Discovered discrepancy between admin execution and authenticated execution.

---

### Phase 3

Confirmed:

Admin RPC:

3 matches

Authenticated RPC:

0 matches

Result:

Issue isolated to execution context.

---

## Root Cause

match_memory_embeddings() executed under authenticated user RLS context.

SQL editor testing used elevated privileges and therefore produced different results.

The RPC was not executing with the visibility assumptions used during development.

---

## Fix

Replaced public RPC with:

SECURITY DEFINER

Removed:

target_user_id

Added:

auth.uid() internal scoping

New behavior:

Function executes with elevated permissions but only returns rows owned by the authenticated user.

---

## Verification

Verified:

- API returns results
- Semantic search works through application path
- Results scoped correctly
- Cross-user isolation preserved

---

## Lessons Learned

### Lesson 1

Never trust SQL editor verification alone.

Always verify:

SQL
→ RPC
→ API
→ Frontend

---

### Lesson 2

Create diagnostics before changing architecture.

Diagnostics produced the answer faster than code modifications.

---

### Lesson 3

For retrieval systems always compare:

Admin Context

vs

Authenticated Context

before changing embeddings or retrieval logic.

---

### Lesson 4

Every major debugging effort should end with a postmortem.

---

## Preventive Actions

- Engineering Playbook created
- Standard Debugging Protocol created
- Retrieval Verification Protocol created
- Future retrieval work must verify authenticated execution path before implementation changes