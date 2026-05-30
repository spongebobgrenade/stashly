# Stashly Engineering Architecture

## Purpose

This document describes the current technical architecture of Stashly, system responsibilities, ownership boundaries, runtime data flow, synchronization architecture, worker architecture, and future scaling strategy.

This document reflects the actual implementation currently running in the repository.

---

# System Overview

Stashly is an AI Memory Operating System.

The system transforms captured content into structured memories that can later power retrieval, rediscovery, recommendations, semantic search, relationships, and AI reasoning.

The architecture is intentionally asynchronous.

Users should never wait for enrichment before receiving feedback.

Current stack:

- Next.js 16
- Supabase
- PostgreSQL
- Supabase Realtime
- Redis
- BullMQ
- Dedicated Metadata Worker
- Zustand

---

# Architectural Principles

## 1. Immediate User Feedback

The user should always receive feedback immediately after capture.

Capture success must not depend on enrichment completion.

Users receive:

- optimistic memory card
- queued state
- realtime enrichment updates

---

## 2. Asynchronous Processing

Capture and enrichment are independent systems.

Capture path:

User
↓
Save API
↓
Database
↓
Response

Processing path:

Queue
↓
Worker
↓
Metadata Extraction
↓
Database Update

These paths remain intentionally decoupled.

---

## 3. Transport Independence

Memory updates should not depend on a single delivery mechanism.

Current transports:

- Realtime Transport
- Reconciliation Transport

Future transports:

- Extension Sync
- Mobile Sync
- Offline Recovery
- Multi-Device Synchronization

All transports ultimately update Memory state through a shared store contract.

---

## 4. Database Authority

The database is the canonical source of truth.

Client state is a temporary projection.

Realtime events are delivery mechanisms, not sources of truth.

---

# High-Level Architecture

User
↓
Next.js Frontend
↓
Save API
↓
Supabase (saves)
↓
BullMQ Queue
↓
Metadata Worker
↓
Metadata Extraction
↓
Supabase Update
↓
Synchronization Layer
↓
Zustand Store
↓
UI

---

# Runtime Layers

## Capture Layer

Responsibilities:

- receive user input
- validate input
- create memory record
- enqueue processing

Current implementation:

src/app/api/memories/save/route.ts

Capture does not perform enrichment.

---

## Processing Layer

Responsibilities:

- lifecycle transitions
- metadata extraction
- enrichment persistence

Current lifecycle:

queued
→ processing
→ completed

queued
→ processing
→ failed

Current implementation:

workers/metadata-worker/

---

## Synchronization Layer

Responsibilities:

- deliver database changes to clients
- recover missed updates
- maintain client consistency

Current transports:

### Realtime Transport

Provider:

Supabase Realtime

Purpose:

Primary update mechanism.

Flow:

Database Update
↓
Postgres Change
↓
Realtime Event
↓
upsertMemory()
↓
UI Update

### Reconciliation Transport

Purpose:

Recover missed realtime events.

Flow:

15-second interval
↓
/api/memories/pending
↓
Memory[]
↓
upsertMemory()
↓
UI Update

Both transports share the same store update path.

---

## Retrieval Layer

Responsibilities:

- memory feed
- keyword search
- future semantic retrieval

Current implementation:

Memory Feed
Search API
Search Results

Current search:

Keyword search using ILIKE matching across:

- title
- description
- creator_name
- source_platform
- original_input

---

# Frontend Architecture

## Framework

Next.js App Router

Current routes:

/
/login
/dashboard

API routes:

/api/memories/save
/api/memories/pending
/api/search

Authentication:

/auth/callback

---

# State Management

Library:

Zustand

Location:

src/lib/memories/store.ts

Responsibilities:

- memory cache
- optimistic memory insertion
- realtime updates
- reconciliation updates

Core actions:

initializeMemories()

addOptimisticMemory()

upsertMemory()

All transports use:

upsertMemory()

as the canonical state update path.

---

# Memory Bootstrap Architecture

Location:

src/components/memory/memory-bootstrap.tsx

Responsibilities:

- initialize store
- initialize realtime
- initialize reconciliation

Flow:

initializeMemories()
↓
initializeMemoryRealtime()
↓
startMemoryReconciliation()

Cleanup:

teardownMemoryRealtime()
↓
stopMemoryReconciliation()

MemoryBootstrap owns infrastructure startup.

---

# Memory Feed Architecture

Location:

src/components/memory-feed.tsx

Responsibilities:

- render memories
- render empty state

MemoryFeed contains no infrastructure logic.

MemoryFeed is a presentation component only.

---

# Search Architecture V1

Components:

SearchBar
↓
useSearch()
↓
/api/search
↓
SearchResults

Behavior:

Empty Query
↓
Memory Feed

Query Present
↓
Search Results

No Results
↓
Search Empty State

---

# Database Architecture

Provider:

Supabase PostgreSQL

Primary Table:

saves

Canonical columns:

- id
- user_id
- original_input
- content_type
- source_platform
- canonical_url
- title
- description
- thumbnail_url
- creator_name
- raw_metadata
- processing_status
- created_at
- updated_at

Database remains the canonical Memory store.

---

# Queue Architecture

Provider:

BullMQ

Broker:

Redis

Queue:

memory-processing

Purpose:

Execute enrichment outside request-response cycles.

Current job payload:

memoryId
url
userId

---

# Metadata Architecture

## Resolver Ownership

Resolver owns:

- platform
- contentType
- normalizedUrl
- identifier

Implementation:

platform-resolver.ts

---

## Extractor Registry

Implementation:

extractor-registry.ts

Current registry:

youtube
github
website
unknown

The registry selects extractors without requiring switch-statement growth.

Future platforms register new extractors.

---

## Extractor Ownership

Extractors own:

- title
- description
- thumbnailUrl
- creatorName
- canonicalUrl
- rawMetadata

Extractors do not own classification.

---

## Current Platform Support

Supported:

- YouTube Videos
- YouTube Shorts
- GitHub Repositories
- Generic Websites

Partially Supported:

- YouTube Playlists

Unsupported:

- Instagram
- TikTok
- X
- LinkedIn
- Spotify
- Notion

---

# Realtime Architecture

Provider:

Supabase Realtime

Subscription Scope:

user_id = current authenticated user

Purpose:

Push worker updates to active clients.

Realtime updates flow through:

upsertMemory()

and never directly manipulate UI.

---

# Authentication Architecture

Provider:

Supabase Auth

Current model:

Authenticated users only.

Isolation model:

User-scoped memory ownership.

Realtime subscriptions:

Scoped by user_id.

Pending-memory reconciliation:

Scoped by authenticated user.

---

# Optimistic Save Architecture

User Saves URL
↓
Optimistic Memory Inserted
↓
Database Record Created
↓
Queue Job Created
↓
Worker Processes
↓
Realtime/Reconciliation Update
↓
Optimistic Memory Replaced

Purpose:

Perceived instant performance.

---

# Current Performance Characteristics

Observed:

Optimistic Save:
~0–100 ms

Search:
~300–1000 ms

Metadata Enrichment:
~2–5 seconds

Realtime Updates:
Near-instant after worker completion

These values are acceptable for current MVP scope.

---

# Scaling Strategy

## Phase 1

Current

- Single Worker
- BullMQ
- Supabase
- Realtime
- Reconciliation

Expected Capacity:

Thousands of memories per day

---

## Phase 2

- Multiple Workers
- Queue Concurrency
- Queue Monitoring
- Structured Logging

Expected Capacity:

Hundreds of thousands per day

---

## Phase 3

- Dedicated Metadata Services
- Platform-Specific Processing Pipelines
- Embeddings
- Semantic Retrieval
- Knowledge Graph

Expected Capacity:

Millions of memories per day

---

# Future Architecture

Planned systems:

- Embeddings
- Semantic Search
- Knowledge Graph
- Relationship Engine
- Collections
- Rediscovery Engine
- Recommendation Engine
- AI Retrieval
- Agentic Memory Retrieval
- Cross-Memory Reasoning

These systems must build on the canonical Memory foundation rather than redefine it.

---

# Architectural Non-Goals

Current V1 intentionally excludes:

- Real-time collaboration
- Shared workspaces
- Offline-first operation
- Distributed workers
- Microservices
- Multi-region deployment

These may be introduced later if justified by scale.

---

# Current Status

Architecture Status:

Stable

Capture Layer:
Operational

Processing Layer:
Operational

Synchronization Layer:
Operational

Search Architecture V1:
Operational

Metadata Architecture V1:
Operational

Optimistic Save Architecture:
Operational

Ready for Platform Expansion V1.