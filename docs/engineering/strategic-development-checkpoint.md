# STASHLY DEVELOPMENT CHECKPOINT
Version: Post-Retrieval V2 Planning
Date: May 2026

## PURPOSE

This document exists to prevent architecture drift and loss of context during development.

Before starting any major new feature, review this document and verify that the items listed below have been completed in order.

---

# CURRENT STATUS

## COMPLETED

### Foundation
- Next.js application deployed on Vercel
- Supabase database configured
- Supabase authentication working
- BullMQ queues working
- Redis working
- Metadata worker operational
- Embedding worker operational
- Ollama embeddings operational
- Nomic Embed Text operational
- Memory enrichment pipeline operational

### Memory Pipeline

Current flow:

User Save
→ Save Record
→ Queue Job
→ Metadata Extraction
→ Retrieval Document Generation
→ Embedding Generation
→ Vector Storage

### User Experience

Implemented:
- Instant memory card creation
- Processing state
- Background enrichment
- Automatic completion updates

This already functions as a lightweight optimistic-update system.

### Search

Implemented:
- Keyword Retrieval (V1)

In Progress:
- Semantic Retrieval (V2)

---

# IMPORTANT ARCHITECTURAL DECISION

DO NOT PROCEED TO HYBRID RETRIEVAL OR AI RECALL UNTIL MEMORY REPRESENTATION ARCHITECTURE IS LOCKED.

Reason:

Retrieval quality depends more on memory representation quality than retrieval algorithm quality.

Bad representations will produce poor results even with advanced retrieval systems.

---

# REQUIRED NEXT MILESTONE

## COMPLETE RETRIEVAL V2

Goal:

Replace keyword-only retrieval with embedding-based semantic retrieval using pgvector.

Expected outcome:

User can find memories using semantic meaning rather than exact keywords.

Example:

Query:
"homemade cooking"

Should retrieve:

"Easy Pasta Recipe"

even if the phrase "homemade cooking" does not appear anywhere.

---

# AFTER RETRIEVAL V2

## LOCK MEMORY REPRESENTATION ARCHITECTURE

This becomes the next highest priority.

Goal:

Define exactly what information should exist inside a memory before embedding.

Current representation:

- title
- description
- creator
- metadata

Future representation candidates:

- transcript
- OCR text
- visual understanding
- AI summary
- user notes
- entities
- topics
- creator information
- source metadata

Output:

One canonical memory representation document used by embeddings.

This architecture must be finalized before Hybrid Retrieval development begins.

---

# FUTURE MEMORY OS VISION

A saved memory should eventually contain:

## Metadata Layer

Platform information

## Transcript Layer

Speech and audio understanding

## OCR Layer

Text appearing inside images or video frames

## Visual Layer

Scene understanding

Example:

"Person cooking homemade pasta in kitchen"

## Knowledge Layer

AI-generated summary

Example:

"Homemade pasta recipe using tomatoes and parmesan."

## User Layer

Notes
Tags
Collections
Annotations

## Retrieval Layer

Embeddings
Vector Search
Hybrid Search
AI Recall

---

# MULTI-AGENT DEVELOPMENT PLAN

NOT YET IMPLEMENTED.

Reason:

Architecture is still evolving rapidly.

Multi-agent development should begin only after:

- Retrieval V2 completed
- Memory Representation Architecture locked
- Documentation stabilized

Target future agents:

### Documentation Agent

Maintains:
- PRD
- TRD
- Architecture Docs
- Changelog

### Backend Agent

Infrastructure and APIs

### Frontend Agent

UI and UX

### QA Agent

Testing and validation

### Architecture Agent

Reviews design decisions

---

# AI-OS ROADMAP

Future objective:

Create an AI-assisted development operating system around Stashly.

Potential integrations:

- ChatGPT
- Codex
- Gemini CLI
- OpenCode
- Aider
- OpenHands
- Claude-compatible tooling
- Perplexity

Before adoption:

Every repository must be audited for:

- Security
- Maintenance
- Community support
- Architecture quality

No tool should be integrated without review.

---

# EMBEDDING STRATEGY DECISION

Current:

Ollama
+
Nomic Embed Text

Status:

Approved for MVP.

Future upgrades may include:

- Better local embedding models
- Multi-modal embeddings
- Transcript embeddings
- Visual embeddings

However:

Improving memory representation remains higher priority than changing embedding models.

---

# PERFORMANCE ROADMAP

Already Implemented:

- Background processing
- Queue-based architecture
- Optimistic memory creation

Not Yet Implemented:

- React Query/SWR cache layer
- Infinite scroll
- Virtualized lists
- Advanced lazy loading
- Search result caching

---

# MONETIZATION PRINCIPLE

DO NOT BUILD PAYWALLS YET.

However:

Premium boundaries must be identified early.

Likely Free:

- Basic saves
- Basic search
- Dashboard

Likely Premium:

- AI Recall
- Memory Chat
- Cross-memory synthesis
- Advanced intelligence features
- Unlimited storage

Architecture should anticipate future subscription tiers even before billing is implemented.

---

# DEVELOPMENT ORDER (LOCKED)

1. Finish Retrieval V2

2. Lock Memory Representation Architecture

3. Update Architecture Documents

4. Build Documentation Agent

5. Introduce Multi-Agent Development Workflow

6. Build Hybrid Retrieval

7. Build AI Recall

8. Build Premium Intelligence Features

Do not reorder without strong justification.

---

# REMINDER TO FUTURE SELF

The goal is NOT to build a better bookmark manager.

The goal is to build a Memory Operating System.

Every major decision should be evaluated against that vision.