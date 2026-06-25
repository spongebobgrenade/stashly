# Stashly Architecture Decision Log

**Status**: LOCKED  
**Authority**: Historical Record of Accepted Engineering Decisions  
**Last Updated**: 2026-06-25  

---

## Purpose

This document records the major architectural decisions that have shaped the design and codebase of Stashly. It is maintained as an append-only chronological log to preserve the context, alternatives considered, and consequences of design choices over time. 

Future architectural decisions must be appended to this log as new sequential records, leaving existing entries frozen to preserve historical integrity.

---

## Decision Records

### ADR-001: Documentation Governance and Alignment Hierarchy
* **Date**: 2026-05-24
* **Status**: Accepted
* **Context**: Rapid code development and multi-layered specifications are highly prone to architectural drift, where code implementations silently diverge from product intent.
* **Decision**: Adopt a strict top-down documentation governance stack where higher-level documents (Philosophy, Experience Architecture) dictate system constraints for lower-level documents (PRD, TRD), and implementation code must remain faithful to these boundaries.
* **Alternatives Considered**: Ad-hoc development workflows governed by inline wiki edits and informal chat alignments. Rejected because ad-hoc guidelines do not guarantee structural alignment.
* **Consequences**: Changes to product or engineering direction must cascade systematically down the documentation layers before code changes are made.

---

### ADR-002: Memory as the System Boundary
* **Date**: 2026-05-24
* **Status**: Accepted
* **Context**: Stashly must ingest data from various platforms (e.g. video transcripts, issues, PDFs). Letting downstream modules (search, AI chat) access platform-specific parsers directly couples features to external platform volatility.
* **Decision**: Define the normalized Memory entity as a strict system boundary. All platform-specific scraping and extraction logic must terminate before building the memory representation.
* **Alternatives Considered**: Passing raw scraped site data down to search engines and letting downstream features resolve formatting dynamically. Rejected because it duplicates parsing logic and breaks downstream subsystems when external sites change.
* **Consequences**: Downstream search, indexing, and chat components operate on a single platform-agnostic interface, isolating them from scraper changes.

---

### ADR-003: MemoryV1 as the Canonical Representation
* **Date**: 2026-05-25
* **Status**: Accepted
* **Context**: Normalizing different platforms into a unified memory entity requires a standardized schema that supports search, summary, and metadata queries without schema fragmentation.
* **Decision**: Implement a standardized, platform-independent JSONB schema named `MemoryV1` containing core fields (title, summary, topics, entities, insights, creator).
* **Alternatives Considered**: Storing different platform data in separate relational tables (e.g. `youtube_saves`, `github_saves`). Rejected because it creates circular SQL joins and prevents unified querying.
* **Consequences**: All platform extractors must map their output to the `MemoryV1` JSONB representation during processing.

---

### ADR-004: Separation of Canonical vs Derived Data
* **Date**: 2026-05-25
* **Status**: Accepted
* **Context**: Vector embeddings, TF-IDF lexical indices, and token caches are highly volatile. Upgrading AI models or changing search indices must not risk corrupting or deleting primary user saves.
* **Decision**: Separate database storage into a Canonical Store (`saves` and `memory_representations`) and an Ephemeral derived store (`memory_embeddings`).
* **Alternatives Considered**: Storing high-dimensional vector arrays and search indexes directly inside the saves table columns. Rejected because vector schema migrations would lock the primary saves table, risking downtime and data loss.
* **Consequences**: Search indices and vectors are ephemeral. If vector columns are corrupted or embedding models are upgraded, indices can be destroyed without affecting canonical data.

---

### ADR-005: Provider-Agnostic Gateway Strategy
* **Date**: 2026-05-26
* **Status**: Accepted
* **Context**: Stashly utilizes external APIs for authentication, vector embeddings, and language model reasoning. Directly referencing specific vendor SDKs throughout the code couples the project to specific providers.
* **Decision**: Abstract all external provider interactions (Auth, LLMs, Embeddings) behind generic gateway interfaces inside the application logic.
* **Alternatives Considered**: Importing vendor-specific SDKs (e.g. OpenAI, Supabase Auth) directly into routes and workers. Rejected because it locks the application to vendor pricing and API changes.
* **Consequences**: Third-party vendors are treated as implementation details. Switching providers requires only creating a new adapter class satisfying the gateway interface.

---

### ADR-006: Asynchronous Ingestion and Processing Pipeline
* **Date**: 2026-05-27
* **Status**: Accepted
* **Context**: Scraping websites, compiling transcripts, and generating vectors are slow, network-bound tasks. Executing these operations inside synchronous request-response loops causes HTTP timeouts and degrades user experience.
* **Decision**: Implement an event-driven, queue-based background enrichment pipeline where saves are queued, immediately acknowledged, and processed asynchronously.
* **Alternatives Considered**: Running inline scraping loops inside serverless API routes. Rejected because serverless execution bounds (e.g. 10-30s limits) interrupt media processing.
* **Consequences**: Ingestion latency is decoupled from the web request. Failed background jobs can be retried independently without affecting user access.

---

### ADR-007: Worker Runtime Separation
* **Date**: 2026-05-27
* **Status**: Accepted
* **Context**: High-frequency queue consumption and embedding generation require significant CPU and memory. Running these inside the main web server process risks starving API route threads.
* **Decision**: Run background enrichment workers (metadata parsing and embedding generation) in dedicated runtime processes separate from the API server.
* **Alternatives Considered**: Running background event loops within the main Next.js web application process. Rejected because heavy CPU usage (e.g. chunk tokenization) degrades API route response latencies.
* **Consequences**: Scaling requires deploying separate compute clusters for workers, and local development requires launching multiple parallel processes.

---

### ADR-008: Optimistic Save Ingestion
* **Date**: 2026-05-28
* **Status**: Accepted
* **Context**: Asynchronous background workers introduce processing delays, meaning saves do not appear in the user's dashboard immediately if the system waits for enrichment to complete.
* **Decision**: Save a placeholder record in the database immediately upon receiving the save request, return an instant confirmation, and transition the UI state dynamically.
* **Alternatives Considered**: Keeping saves invisible to the user until background enrichment and embedding generation are completely finished. Rejected because users assume the save failed if there is no immediate visual confirmation.
* **Consequences**: Dashboard feeds must support partial states (`queued`, `processing`) and client components must reactively re-render as states update.

---

### ADR-009: Synchronization Layer Architecture
* **Date**: 2026-05-28
* **Status**: Accepted
* **Context**: The client UI must reactively update when background processing changes states. However, relying solely on socket-based push messages risks state mismatches if connections drop.
* **Decision**: Build a synchronization layer combining real-time push events for instant UI hydration, backed by a reconciliation polling endpoint that syncs pending state items.
* **Alternatives Considered**: Short-polling the API continuously or relying strictly on sockets without fallbacks. Rejected because polling degrades database performance, and socket-only systems drop messages during network switching.
* **Consequences**: Guarantees visual updates occur in near real-time while ensuring absolute state consistency.

---

### ADR-010: Resolver and Extractor Registry Separation
* **Date**: 2026-05-29
* **Status**: Accepted
* **Context**: Adding support for new URL domains requires custom scraping logic. Placing all platform scraping logic directly inside worker threads creates monolithic files that are difficult to test.
* **Decision**: Separate classification (Resolvers) from content enrichment (Extractors) using a centralized Extractor Registry that routes classified domains to dedicated platform classes.
* **Alternatives Considered**: Large, nested conditional blocks inside the main worker process. Rejected because it violates the single-responsibility principle.
* **Consequences**: Adding support for new platform sources requires only creating a new extractor class and registering it, leaving worker logic unchanged.

---

### ADR-011: Memory Type Source of Truth
* **Date**: 2026-05-30
* **Status**: Accepted
* **Context**: Database schema structures and application type definitions must stay in sync to prevent runtime errors during database interactions.
* **Decision**: Derive core application types directly from database generator schemas, using generated types as the single source of truth for entity types.
* **Alternatives Considered**: Manually authoring duplicate TypeScript interfaces. Rejected because manual interfaces drift from database columns during schema migrations.
* **Consequences**: Any database migration requires running type-generation commands to update the codebase type references.

---

### ADR-012: Hybrid Retrieval Fusion
* **Date**: 2026-06-22
* **Status**: Accepted
* **Context**: Vector similarity search captures conceptual intent but misses specific keywords (like URLs, code symbols, or names). Lexical search captures exact keywords but fails on conceptual themes.
* **Decision**: Implement a hybrid search strategy that queries vector databases and runs lexical scans concurrently, fusing the results using a linear score combination.
* **Alternatives Considered**: Relying exclusively on vector similarity search and using LLM query rewriting. Rejected because query rewriting does not solve exact term matching.
* **Consequences**: Search query coordination must execute both retrieval strategies and apply fusion calculations before returning candidates.

---

### ADR-013: Pipeline Versioning and Recoverability
* **Date**: 2026-06-23
* **Status**: Accepted
* **Context**: As enrichment schemas change, existing database items must be version-tracked to allow target migrations. If vectors are corrupted, they must be rebuildable without re-scraping.
* **Decision**: Stamp save records with a `pipeline_version` column and implement CLI recovery tools to regenerate vector arrays by reading from canonical JSONB representation blocks.
* **Alternatives Considered**: Storing no pipeline version metadata and estimating version states based on database update timestamps. Rejected because it prevents precise record filtering.
* **Consequences**: Index vector migrations can be run locally using cached canonical representations, ensuring complete recoverability without network dependencies.

---

### ADR-014: Grounded AI over Retrieved Memories
* **Date**: 2026-06-25
* **Status**: Accepted
* **Context**: General language models hallucinate responses when queried about personal data without grounding constraints.
* **Decision**: Limit AI chat responses by querying the hybrid search engine, assembling top matches into structured context blocks, and enforcing system prompts that reject queries lacking retrieved matching context.
* **Alternatives Considered**: Letting the LLM run open-domain searches or generate responses without strict context boundaries. Rejected because it compromises accuracy and user trust.
* **Consequences**: Ensures model answers are bounded by stored knowledge, returning empty states when similarity thresholds are not met.
