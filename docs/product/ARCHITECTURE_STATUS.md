# Stashly Architecture Status Dashboard

**Status**: ACTIVE  
**Last Updated**: 2026-06-25  
**Version**: 4.0  
**Authority**: System Implementation and Documentation Health Monitor  

---

## 1. Purpose & Operational Governance

The Architecture Status Dashboard is a live index tracking the health, implementation completeness, and alignment of Stashly's software components. It serves as the single source of truth for the active engineering state of the project, highlighting risks and listing active priorities.

Documentation alignment and layout are governed by the top-level [Documentation-Governance.md](file:///Users/sahilkishor/stashly/docs/Documentation-Governance.md) specification, which defines the boundaries, constraints, and dependencies of the documentation ecosystem.

> [!IMPORTANT]
> **Documentation Reality Rule:** No documentation may describe planned behavior as implemented behavior, and no documentation may describe implemented behavior as planned behavior. Documentation must always reflect reality.

---

## 2. Overall Project Status

Stashly is currently in the **Pre-Launch Retrieval Validation** phase. The core architecture—spanning asynchronous link ingestion, normalization to `MemoryV1` representations, vector chunk generation, hybrid retrieval fusion, and grounded AI chat—is fully operational in the codebase. Active work centers on shifting performance-limiting runtime scoring components into the database engine.

| Development Layer | Status | Target Phase | Current Reality |
| :--- | :--- | :--- | :--- |
| **Ingestion Pipeline** | Stable | Active Validation | Background ingestion queues and resolvers are fully operational. |
| **Memory Representation** | Locked | V1 Specification | Platform-independent `MemoryV1` schema is frozen and deployed. |
| **Retrieval Engine** | Stable | Hybrid V2/V3 | Vector similarity search and lexical scoring are operational. |
| **AI Reasoning Layer** | Partial | Grounded V4 | Streaming chat is functional but utilizes static regex overrides. |
| **Database Indices** | Living | Dynamic Indexing | Vector indices are stable; lexical keyword database indices are planned. |
| **Observability & Ops** | Stable | Audit & Recovery | Corpus diagnostics and embedding backfill scripts are fully operational. |

---

## 3. System Health

Status of core runtime systems and background processing nodes:

* **Ingestion API**: **Stable**. Captures incoming link payloads, persists initial queue states immediately, and issues background jobs in $<200\text{ms}$.
* **Background Workers**: **Stable**. BullMQ workers handle metadata extraction and embedding generation. Lock durations are set to 5 minutes (`lockDuration = 300000ms`) to protect against long LLM response timeouts.
* **Embedding Queue**: **Stable**. Employs unique `jobId: memoryId` deduplication to prevent processing double-saves.
* **Vector Index**: **Stable**. Vectors exist for all completes saves. Missing vectors are programmatically identified and resolved.
* **Reasoning Stream**: **Stable**. Streamed context blocks construct citations without LLM distractions. Programmatic overrides exist for developer checks.

---

## 4. Active Engineering Priorities

The development team is actively executing the following technical transitions to align code with target architecture specifications:

* **Lexical Database Indexing**: Migrating keyword matching from application runtime memory to database-level full-text search indexes (`tsvector` and GIN indices) to scale query performance.
* **Hardening Grounding Prompt Boundaries**: Replacing programmatic regular expression overrides in the chat endpoint with robust system prompt constraints to control LLM hallucinations.
* **Auto-Reprocessing triggers**: Adding automatic database hooks to queue reprocessing jobs when canonical memories change.

---

## 5. Known Risks & Constraints

* **Local Model Concurrency Limits**: Running Ollama locally for vector generation can stall under concurrent backfill loads. Workers throttle queries using queue limits to protect model performance.
* **In-Memory Scorer Memory Constraints**: Running TF-IDF analysis in Next.js runtime memory limits scaling to large user corpora. Database FTS indexing is required to resolve this bottleneck.
* **Brittle Chat Overrides**: Programmatic regex overrides in `/api/chat` restrict model flexibility and are prone to evasion.

---

## 6. Documentation Status

Stashly's documentation ecosystem consists of the following authoritative files, organized according to the repository layouts defined below:

### Documentation Registry

| Document | Type | Target Status | Alignment State |
| :--- | :--- | :--- | :--- |
| **Philosophy** ([Philosophy.md](file:///Users/sahilkishor/stashly/docs/product/Philosophy.md)) | Locked | Stable | Fully Aligned. Core product constitution. |
| **Documentation Governance** ([Documentation-Governance.md](file:///Users/sahilkishor/stashly/docs/Documentation-Governance.md)) | Locked | Stable | Fully Aligned. Enforces design boundaries. |
| **Memory Architecture** ([Memory-Architecture-V1.md](file:///Users/sahilkishor/stashly/docs/product/Memory-Architecture-V1.md)) | Locked | Stable | Fully Aligned with current codebase types and database schemas. |
| **Search Architecture** ([Search-Architecture.md](file:///Users/sahilkishor/stashly/docs/product/Search-Architecture.md)) | Locked | Stable | Fully Aligned. Identifies gateways and hybrid retrieval algorithms. |
| **PRD** ([PRD.md](file:///Users/sahilkishor/stashly/docs/product/PRD.md)) | Living | Active | Fully Aligned. Distinguishes implemented features from planned. |
| **TRD** ([TRD.md](file:///Users/sahilkishor/stashly/docs/product/TRD.md)) | Living | Active | Fully Aligned. Mapped to current background workers and API routes. |
| **Architecture Status** ([ARCHITECTURE_STATUS.md](file:///Users/sahilkishor/stashly/docs/product/ARCHITECTURE_STATUS.md)) | Living | Active | Fully Aligned. Serves as active system monitor. |
| **Architecture Decisions** ([architecture-decisions.md](file:///Users/sahilkishor/stashly/docs/engineering/architecture-decisions.md)) | Living | Active | Fully Aligned. Chronological decision log. |
| **Engineering Debt** ([engineering-debt.md](file:///Users/sahilkishor/stashly/docs/engineering/engineering-debt.md)) | Living | Active | Fully Aligned. Active engineering debt register. |
| **Experience Architecture** ([Experience-Architecture.md](file:///Users/sahilkishor/stashly/docs/product/Experience-Architecture.md)) | Living | **Draft / Deferred** | Deferred. Interaction flows require final definition. |

### Repository Structure Layout

* `docs/product/`: Holds locked system specification architectures and active product definitions.
* `docs/engineering/`: Contains living implementation details, runbooks, decision logs, and debt trackers.
* `docs/audits/`: Holds completed database, system, and schema audit logs.
* `docs/founder/conversation_history/`: Archives historical dialogue transcripts.
* `docs/founder/archive/`: Houses deprecated documentation.

---

## 7. Immediate Next Milestone

The immediate milestone is **Milestone: Database-Level Lexical Retrieval**:
1. Implement database migration script introducing `tsvector` columns and GIN indices to `saves` metadata.
2. Update `keywordRetrievalStrategy()` to execute search queries directly against database indexes, replacing the runtime Node.js scoring engine.
3. Validate query execution times under simulated concurrent searches.
