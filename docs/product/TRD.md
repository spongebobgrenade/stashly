# Stashly TRD v3.0

> **Product:** Stashly  
> **Type:** Technical Requirements Document  
> **Version:** 3.0  
> **Status:** Active Architecture  
> **Phase:** Retrieval-First MVP  
> **Architecture Style:** AI-Assisted Memory Infrastructure Platform

---

# 1. Technical Vision

## Objective

Stashly is not a traditional bookmarking backend.

The platform is designed as:

> A retrieval-first memory infrastructure system.

The technical architecture exists to:

- reduce remembering burden
- maximize retrieval quality
- minimize retrieval latency
- minimize AI cost
- support scalable memory enrichment
- preserve user trust boundaries
- support long-term memory resurfacing

---

# 2. Core System Philosophy

## Architectural Principles

### Retrieval First

The architecture prioritizes retrieval quality over storage complexity.

---

### AI-Assisted, Not AI-Dependent

The system should avoid unnecessary LLM usage.

Most retrieval operations should rely on:

- embeddings
- vector similarity
- metadata
- OCR
- ranking systems
- cached enrichment

LLMs should be reserved for:

- summarization
- query understanding
- retrieval explanation generation
- contextual synthesis
- fallback refinement

---

### Async by Default

Heavy operations should never block user interaction.

Async systems include:

- metadata extraction
- OCR
- embedding generation
- summarization
- rediscovery generation
- relationship graph enrichment

---

### Backend-Owned Business Logic

All critical logic remains server-side.

Frontend should never own:

- ranking logic
- retrieval orchestration
- trust enforcement
- metadata generation
- AI prompting
- permission boundaries

---

### Trust-Safe Retrieval

The system must never imply knowledge not derived from:

- user-provided content
- approved integrations
- explicit metadata
- retrieval relationships

---

# 3. High-Level Architecture

## System Layers

```text id="r6l3d0"
Client Layer
    ↓

API Layer
    ↓

Retrieval Orchestration Layer
    ↓

Memory Processing Layer
    ↓

Storage + Embedding Layer
    ↓

Async Worker Infrastructure
```

---

# 4. Frontend Architecture

## Homepage Model

Homepage architecture is retrieval-first.

Homepage is:

> Memory Home

not:

> dashboard software

---

## Homepage Hierarchy

### Primary Layer

AI retrieval interaction.

Includes:

- conversational input
- voice support
- suggested prompts
- retrieval history
- contextual suggestions

---

### Secondary Layer

Memory resurfacing.

Includes:

- related bundles
- rediscovery surfaces
- recent memory groups
- contextual collections

---

### Tertiary Layer

Navigation and account systems.

---

# 5. Retrieval Result Architecture

## Retrieval Priority

Results should render in this order:

1. Exact likely memory
2. Original source access
3. Retrieval explanation
4. Related memory bundles
5. Contextual resurfacing

---

## Retrieval Result Structure

Each retrieval result may include:

- title
- description
- thumbnail
- source platform
- save timestamp
- similarity explanation
- optional AI summary
- related memories
- original URL

---

## Retrieval Explanation Rules

Allowed explanation signals:

- shared content
- timestamps
- OCR
- metadata
- similarity
- retrieval relationships
- user-approved integrations

Forbidden explanation behavior:

- inferred life context
- fabricated personalization
- emotional manipulation
- hidden behavioral assumptions

---

# 6. Retrieval Pipeline

## Query Flow

```text id="m7w4e1"
User Query
    ↓

Query Understanding
    ↓

Embedding Generation
    ↓

Vector Search
    ↓

Metadata Ranking
    ↓

Contextual Reranking
    ↓

Result Confidence Evaluation
    ↓

Retrieval Explanation Generation
    ↓

Response Assembly
```

---

## Query Understanding

Purpose:

- normalize vague user memory
- identify retrieval intent
- improve semantic search quality

Example:

```text id="n2v8y5"
"that startup reel"
```

Possible expansion:

- startup
- founder
- entrepreneurship
- business ideas
- Instagram reel

---

# 7. Retrieval Ranking Engine

## Ranking Inputs

Ranking may consider:

- semantic similarity
- OCR relevance
- optional notes
- metadata similarity
- save recency
- retrieval frequency
- relationship graph relevance
- bundle relevance

---

## Confidence Scoring

Each retrieval receives confidence scoring.

Purpose:

- improve reranking
- detect weak matches
- improve explanation quality
- trigger fallback refinement

---

# 8. Embedding Architecture

## Embedding Responsibilities

Embeddings power:

- semantic retrieval
- similarity grouping
- bundle generation
- rediscovery systems
- contextual relationships

---

## Embedding Sources

Embeddings may be generated from:

- URLs
- metadata
- OCR text
- summaries
- notes
- titles
- descriptions

---

## Embedding Storage

Embeddings should remain:

- user-scoped
- permission-scoped
- isolated per account

Cross-user retrieval leakage must be impossible.

---

# 9. Metadata Enrichment Pipeline

## Metadata Worker Responsibilities

Metadata workers enrich saves asynchronously.

---

## Responsibilities

- title extraction
- description extraction
- thumbnail extraction
- source detection
- content classification
- metadata normalization

---

## Processing States

```text id="q8u1k7"
queued
→ processing
→ completed
→ failed
```

---

# 10. OCR Pipeline

## OCR Responsibilities

OCR enables retrieval from screenshots and images.

---

## OCR Pipeline

```text id="t5g4c2"
Image Upload
    ↓

OCR Extraction
    ↓

Text Normalization
    ↓

Embedding Generation
    ↓

Retrieval Indexing
```

---

# 11. Memory Relationship Graph

## Purpose

The system should gradually build contextual relationships between memories.

Purpose:

- related retrieval
- contextual resurfacing
- bundle generation
- rediscovery
- retrieval acceleration

---

## Relationship Signals

Relationships may derive from:

- embedding similarity
- shared source types
- timestamp proximity
- recurring retrieval patterns
- shared entities
- shared themes

---

# 12. Bundle Generation System

## Bundle Purpose

Bundles help users rediscover related memories naturally.

---

## Example Bundles

- startup content
- travel research
- workout references
- AI tools
- recipes
- creator collections

---

## Bundle Generation Sources

Bundles may use:

- embeddings
- retrieval relationships
- recurring themes
- OCR content
- save behavior
- metadata clusters

---

# 13. Rediscovery Engine

## Purpose

Prevent memory graveyards.

---

## Rediscovery Inputs

- forgotten saves
- relationship graph
- bundle relevance
- retrieval inactivity
- seasonal resurfacing
- recent engagement

---

## Rediscovery Outputs

- resurfaced memories
- contextual reminders
- related bundles
- weekly digests

---

# 14. AI Orchestration Layer

## AI Usage Policy

AI should augment retrieval rather than dominate architecture.

---

## AI Responsibilities

- summarization
- query expansion
- retrieval explanation generation
- contextual synthesis
- classification
- relationship enrichment

---

## AI Constraints

Avoid:

- excessive token usage
- unnecessary generation
- conversational filler
- hallucinated context
- fabricated personalization

---

# 15. AI Cost Optimization

## Primary Strategy

Use retrieval-first infrastructure before LLM reasoning.

---

## Cost Optimization Techniques

### Preferred

- vector search
- cached summaries
- metadata ranking
- async enrichment
- partial context retrieval
- reranking before generation

---

### Avoid

- full-context prompts
- repeated summarization
- LLM-first retrieval
- synchronous heavy processing

---

# 16. Caching Architecture

## Cache Candidates

The system may cache:

- summaries
- embeddings
- metadata
- retrieval explanations
- thumbnails
- query interpretations

---

## Cache Goals

- lower latency
- lower token usage
- lower infrastructure cost
- faster retrieval

---

# 17. Async Worker Infrastructure

## Worker Types

### Metadata Worker

Extracts metadata.

---

### OCR Worker

Processes screenshots and images.

---

### Embedding Worker

Generates embeddings.

---

### Relationship Worker

Builds memory graph relationships.

---

### Rediscovery Worker

Generates rediscovery candidates.

---

# 18. Queue Architecture

## Queue Responsibilities

Queues manage:

- retries
- scheduling
- batch processing
- worker isolation
- failure recovery

---

## Queue States

```text id="p3m6a9"
queued
→ processing
→ completed
→ failed
→ retrying
```

---

# 19. Failure Recovery

## Worker Failure Strategy

Failures should:

- retry safely
- preserve user saves
- avoid blocking retrieval
- degrade gracefully

---

## Fallback Behavior

If enrichment fails:

- preserve original save
- preserve source link
- retry later asynchronously

---

# 20. Security Architecture

## Security Priorities

- user isolation
- secure retrieval
- encrypted transport
- safe storage
- access enforcement
- retrieval boundary protection

---

## Security Layers

### Authentication

Supabase Auth.

---

### Authorization

RLS enforcement.

---

### Transport Security

HTTPS everywhere.

---

### Secret Management

Environment variables only.

Never expose secrets client-side.

---

### Vector Isolation

Embeddings must remain user-scoped.

Cross-user vector retrieval is forbidden.

---

# 21. Encryption Strategy

## Required

### Encryption In Transit

HTTPS/TLS.

---

### Encryption At Rest

Database provider encryption.

---

### Sensitive Secret Protection

Environment isolation and secret rotation.

---

# 22. Adaptive Intelligence Layer

## Purpose

Improve retrieval quality over time.

---

## Learning Signals

- successful retrievals
- failed retrievals
- retrieval refinements
- bundle interactions
- resurfacing engagement

---

## Allowed Adaptation

- ranking improvements
- retrieval quality
- resurfacing timing
- relationship relevance
- contextual grouping

---

## Forbidden Adaptation

- manipulative engagement systems
- addictive optimization
- hidden psychological profiling
- trust-breaking personalization

---

# 23. Analytics Architecture

## Analytics Goals

Analytics exist to improve:

- retrieval quality
- onboarding
- latency
- rediscovery
- retention

---

## Analytics Constraints

Analytics must remain:

- privacy-safe
- transparent
- consent-compliant

---

# 24. Deployment Architecture

## Deployment Goals

- reliability
- rollback safety
- fast iteration
- low operational burden

---

## MVP Deployment Stack

Recommended:

- Vercel
- Supabase
- Background workers
- Managed Postgres
- Managed storage

---

# 25. Testing Strategy

## Required Testing Layers

- unit testing
- API testing
- retrieval testing
- auth testing
- worker testing
- regression testing

---

## Future Testing

- load testing
- security audits
- retrieval quality evaluation
- AI evaluation pipelines

---

# 26. Monitoring and Observability

## Monitor

- worker failures
- retrieval latency
- API latency
- queue health
- embedding generation
- AI cost
- failed retrievals

---

## Observability Goals

- fast debugging
- retrieval quality visibility
- infrastructure reliability
- cost visibility

---

# 27. Billing Architecture Direction

## Status

Billing strategy is exploratory.

---

## Likely Future Billing Stack

- Stripe
- subscriptions
- usage tracking
- feature gating
- webhook handling

---

## Monetization Principle

Monetization must not reduce memory trust or retrieval quality.

---

# 28. Scalability Assumptions

## MVP Philosophy

Build lean while preserving scalability paths.

---

## Scalability Goals

The architecture should eventually support:

- millions of saves
- large embedding indexes
- async scaling
- worker horizontal scaling
- distributed retrieval systems

---

# 29. Infrastructure Philosophy

The platform should prioritize:

- low operational complexity
- low latency
- low AI cost
- modular evolution
- backend reliability
- retrieval quality

---

# 30. Technical Non-Goals

The system is not intended to become:

- a file storage platform
- a media scraping engine
- a productivity suite
- an engagement-maximization platform
- an autonomous AGI system

---

# 31. Future Architecture Directions

Potential future systems:

- native mobile apps
- browser extension
- multimodal retrieval
- voice retrieval
- collaborative memory spaces
- API ecosystem
- local-first memory caching
- advanced personalization

---

# 32. TRD Status

| Field | Value |
|---|---|
| Version | 3.0 |
| Status | ACTIVE |
| Architecture State | Retrieval-First Infrastructure |

This TRD may evolve through implementation learning and infrastructure scaling requirements.