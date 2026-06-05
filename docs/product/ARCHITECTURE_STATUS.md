# Architecture Status

Last Updated: 2026-06-01

Current Runtime Memory Architecture:
Memory-Architecture.md

Target Architecture:
Memory Representation Architecture V1

## ACTIVE

### Stashly Search Architecture
Status: ACTIVE
Notes:
- Active retrieval architecture for the current product.
- Defines current and future retrieval evolution.

---

## LOCKED

### Memory Representation Architecture (V1)
Status: LOCKED
Notes:
- Canonical memory structure finalized as the source of truth.
- Five-layer memory architecture established.

### Metadata Pipeline
Status: LOCKED
Notes:
- Queue based processing
- Background enrichment
- Automatic completion updates

### Embedding Architecture (V1 Implementation)
Status: LOCKED
Current Representation:
- title
- description
- creator_name
*Note: Implementation requires an update to align with the complete Memory Representation V1 fields.*
Embedding Provider:
- Ollama
- nomic-embed-text

### PRD
Status: ACTIVE
Reason:
Product direction remains valid.

---

## SUPERSEDED

### Stashly Memory Architecture
Status: SUPERSEDED
Purpose:
- Current Runtime Memory Architecture
Notes:
- Documents the current `saves`-table-backed runtime Memory model.
- Remains useful as runtime documentation and is not archived.

---

## OPERATIONAL

### Retrieval V2
Status: OPERATIONAL
Notes:
- Semantic retrieval operational
- Embedding worker operational
- Historical memories successfully backfilled
- Current implementation uses:
  - title
  - description
  - creator_name
- Retrieval alignment with Memory Architecture V1 remains pending

---

## IN PROGRESS

### Retrieval Alignment Project
Status: IN PROGRESS

Purpose:
Align retrieval representation with the locked Memory Architecture V1.

Current Runtime State:
- title
- description
- creator_name

Target State:
- title
- summary
- topics
- entities
- key_insights
- creator_name
- user_notes

Dependencies:
- Understanding Layer implementation
- Re-embedding pipeline
- Backfill regeneration

### TRD
Status: IN PROGRESS (PARTIALLY OUTDATED)
Reason:
Requires updates to align with the locked Memory Representation V1.

### Experience Architecture
Status: IN PROGRESS (DRAFT)
Notes:
- Unblocked. Now actively adapting to Memory Representation Architecture V1.

---

## PLANNED

### AI Recall
Status: PLANNED
Notes:
- Unblocked. Awaiting implementation based on Memory Representation Architecture V1.

### Hybrid Retrieval
Status: PLANNED
Notes:
- Unblocked. Awaiting implementation based on Memory Representation Architecture V1.
