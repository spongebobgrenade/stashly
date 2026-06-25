# Stashly Active Engineering Debt Register

**Status**: ACTIVE  
**Version**: 5.0  
**Authority**: Active Implementation Gap Monitor  
**Last Updated**: 2026-06-25  

---

## 1. Executive Summary

Engineering debt is defined as an intentional or temporary deviation between the current codebase implementation and target architectural specifications. It is **not** a general bug tracker or a generic product feature backlog. An engineering debt item exists only when there is a documented architectural target that the implementation has not yet fully realized.

Engineering Debt is a living operational register. Items are removed when retired, not marked as completed. Historical reasoning belongs in [architecture-decisions.md](file:///Users/sahilkishor/stashly/docs/engineering/architecture-decisions.md).

### Active Debt Dashboard
* **Total Open Debt Items**: 6
* **Critical Priorities (P1)**: 2
* **High Priorities (P2)**: 2
* **Medium/Low Priorities (P3)**: 2
* **Overall Engineering Health**: **Good**. Core ingestion, serialization, and retrieval models are functional and type-safe, but scaling requires transitioning application-level scoring loops to database-level indexes.

---

## 2. Engineering Principles & Governance

Stashly engineers adhere to these strict rules when introducing or managing engineering debt:
* **Intentionality**: Debt must be introduced consciously to validate capabilities and must be documented immediately in this register.
* **Traceable Targets**: Every debt item must cite a target architecture doc specifying the final realization state.
* **No Stale Records**: Resolved items must be removed from the active log immediately upon code completion.
* **Sovereignty**: Architecture status and system requirements documents remain the authoritative sources of truth.
* **Governing Rule**: Engineering Debt records intentional technical compromises between the target architecture and the current implementation. It does not track product ideas, planned features, architectural decisions, documentation quality, or historical context.

> [!IMPORTANT]
> **Documentation Reality Rule**
> No documentation may describe planned behavior as implemented behavior, and no documentation may describe implemented behavior as planned behavior. Documentation must always reflect reality.

---

## 3. Active Debt Items

### Retrieval Subsystem

#### ED-001: Application-Memory Lexical Scorer
* **ID**: ED-001
* **Status**: Open
* **Priority**: Critical (P1)
* **Area**: Retrieval / Search Engine
* **Current Reality**: Lexical TF-IDF keyword match scoring is calculated dynamically inside Node.js runtime memory within Next.js API route handlers. It retrieves all user saves from the database on every query.
* **Target Architecture**: [Search-Architecture.md](file:///Users/sahilkishor/stashly/docs/product/Search-Architecture.md#L156-L163) (Target Retrieval Architecture) specifies moving lexical scoring to database-level full-text search indexes (`tsvector` and GIN indices).
* **Why Debt Exists**: Prioritized fast implementation of hybrid score fusion algorithms over writing Postgres migration scripts.
* **User/System Impact**: High memory utilization and slow query responses as user saves scale beyond validation sizes.
* **Proposed Resolution**: Write SQL migrations to construct `tsvector` columns, and rewrite `keywordRetrievalStrategy()` to query database-level indexes.
* **Exit Criteria**: In-memory tokenization code is deleted, and lexical match queries resolve via SQL queries in $<100\text{ms}$.

---

### AI & Grounding Subsystem

#### ED-002: Hardcoded Grounding Citation Heuristics
* **ID**: ED-002
* **Status**: Open
* **Priority**: Critical (P1)
* **Area**: AI Chat / Grounding
* **Current Reality**: Programmatic regular expression matching intercepts specific query keywords (e.g. `"kinde"`, `"jeff nippard"`) in `/api/chat/route.ts` to bypass model logic and force citations.
* **Target Architecture**: [Search-Architecture.md](file:///Users/sahilkishor/stashly/docs/product/Search-Architecture.md#L214-L217) (Evolution Roadmap) specifies replacing hardcoded routing overrides with robust LLM prompt constraints and context-anchored retrieval matching.
* **Why Debt Exists**: Required immediate developer test overrides to pass test compliance loops during early retrieval validation.
* **User/System Impact**: Brittle grounding logic that does not adapt to synonyms or unmapped search strings.
* **Proposed Resolution**: Remove regex intercept routines from `/api/chat/route.ts` and harden LLM system prompt context rules.
* **Exit Criteria**: Programmatic overrides are removed and AI responses rely entirely on search similarity grounding context.

---

### Memory Representation Subsystem

#### ED-003: Unimplemented User Annotation Operations
* **ID**: ED-003
* **Status**: Open
* **Priority**: High (P2)
* **Area**: Memory Representation
* **Current Reality**: The `MemoryV1` schema supports `user_notes` and custom topic/entity tagging arrays, but no API routes or user interfaces exist to write or update these annotations.
* **Target Architecture**: [Memory-Architecture-V1.md](file:///Users/sahilkishor/stashly/docs/product/Memory-Architecture-V1.md) defines annotations as canonical properties.
* **Why Debt Exists**: Prioritized automating asynchronous scraping and video transcript vector generation over user configuration panels.
* **User/System Impact**: Inability for users to manually edit keywords or save personal thoughts alongside references, limiting retrieval accuracy.
* **Proposed Resolution**: Implement `/api/memories/update` and build edit toggles on the dashboard layout.
* **Exit Criteria**: User annotations are successfully merged into database representation columns and update search vectors.

---

#### ED-004: Ingestion Pipeline Limitations (URL-Only Capture)
* **ID**: ED-004
* **Status**: Open
* **Priority**: High (P2)
* **Area**: Ingestion
* **Current Reality**: Ingestion and scraper adapters are limited to web URLs. File uploads (PDF, text, images) are not implemented.
* **Target Architecture**: [PRD.md](file:///Users/sahilkishor/stashly/docs/product/PRD.md#L214-L230) (Universal Capture Roadmap) specifies screenshot, file, and PDF text indexing.
* **Why Debt Exists**: URL parsing was chosen as the minimum necessary surface area to validate background processor loops.
* **User/System Impact**: Users cannot upload files or documents directly into their memory database.
* **Proposed Resolution**: Implement file-upload route handlers and integrate OCR scrapers enqueuing to background workers.
* **Exit Criteria**: Users can upload files via the dashboard and retrieve parsed text representations.

---

### Infrastructure Subsystem

#### ED-005: Unstructured Logging inside Workers
* **ID**: ED-005
* **Status**: Open
* **Priority**: Medium (P3)
* **Area**: Infrastructure / Observability
* **Current Reality**: Background metadata and embedding workers output simple, unstructured text logs using default `console.log` / `console.error` calls.
* **Target Architecture**: [TRD.md](file:///Users/sahilkishor/stashly/docs/product/TRD.md#L226-L231) (Configuration and Logging) specifies unified structured JSON logging for all workers.
* **Why Debt Exists**: Operational console streaming was sufficient for early local debugging.
* **User/System Impact**: Difficult to parse logs, query errors, or monitor operational trends in cloud log aggregates.
* **Proposed Resolution**: Implement a structured logging module (e.g. Pino, Winston) across API routes and worker nodes.
* **Exit Criteria**: Standard console logs are replaced with parsed JSON log messages containing execution job contexts.

---

#### ED-006: Missing Queue Analytics Dashboard
* **ID**: ED-006
* **Status**: Open
* **Priority**: Medium (P3)
* **Area**: Infrastructure
* **Current Reality**: Processing queue visibility (BullMQ job lists) is log-only, requiring manual command queries to monitor stalled jobs.
* **Target Architecture**: [TRD.md](file:///Users/sahilkishor/stashly/docs/product/TRD.md#L197-L203) (Queue Architecture) specifies real-time queue health monitoring dashboards.
* **Why Debt Exists**: Priority was locked on pipeline execution success rather than management dashboards.
* **User/System Impact**: Engineers cannot visually inspect failed, active, or delayed jobs, slowing operational incident resolution.
* **Proposed Resolution**: Integrate a lightweight, secure queue monitoring dashboard (e.g. Bull Board) behind authenticated paths.
* **Exit Criteria**: Visual queue diagnostic metrics are accessible at `/admin/queues`.