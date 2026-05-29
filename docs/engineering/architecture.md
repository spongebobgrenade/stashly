# Stashly Engineering Architecture

## Purpose

This document describes the current technical architecture of Stashly, the responsibilities of each system component, data flow, realtime architecture, worker architecture, and future scaling considerations.

---

# System Overview

Stashly is an AI-powered memory operating system that transforms links, content, and future media types into structured, searchable memories.

The architecture is intentionally designed around asynchronous processing.

Users should never wait for metadata extraction before seeing feedback.

The system uses:

- Next.js
- Supabase
- PostgreSQL
- Supabase Realtime
- Redis
- BullMQ
- Background Workers
- Zustand

---

# High-Level Architecture

User
↓
Next.js Frontend
↓
Save API
↓
Supabase (saves table)
↓
BullMQ Queue
↓
Worker
↓
Metadata Extraction
↓
Supabase Update
↓
Supabase Realtime
↓
Frontend Store Update
↓
UI Re-render

---

# Core Principles

## 1. Immediate Feedback

Users should receive feedback instantly.

Never block the UI while metadata extraction is occurring.

The user should see a placeholder card immediately.

---

## 2. Asynchronous Processing

All enrichment happens outside request-response cycles.

Request path:

User → Save

Processing path:

Worker → Metadata → Database Update

These systems remain independent.

---

## 3. Event Driven Updates

The frontend should not poll for updates.

State changes are delivered through realtime events.

---

## 4. Single Source of Truth

Database is always authoritative.

Frontend state exists only as a temporary cache.

---

# Frontend Architecture

## Framework

Next.js App Router

Current routes:

/
/login
/dashboard
/api/memories/save
/api/memories/pending
/auth/callback

---

# State Management

Library:

Zustand

Location:

src/lib/memories/store.ts

Responsibilities:

- Memory cache
- Optimistic updates
- Realtime updates
- State reconciliation

Core actions:

initializeMemories()

addOptimisticMemory()

upsertMemory()

---

# Memory Feed

Location:

src/components/memory-feed.tsx

Responsibilities:

- Render memory cards
- Bootstrap memory system
- Initialize realtime
- Start reconciliation loop

---

# Memory Card

Location:

src/components/memory-card.tsx

Responsibilities:

- Thumbnail display
- Metadata display
- Processing status display
- Source link access

---

# Backend Architecture

## Save Endpoint

Location:

src/app/api/memories/save/route.ts

Responsibilities:

- Validate input
- Create memory record
- Queue worker job

Returns immediately.

No metadata extraction occurs here.

---

# Database

Provider:

Supabase PostgreSQL

Primary Table:

saves

Important columns:

id
user_id
original_input
canonical_url
source_platform
title
description
thumbnail_url
creator_name
raw_metadata
processing_status
created_at
updated_at

---

# Queue System

Provider:

BullMQ

Broker:

Redis

Purpose:

Background job execution.

Queue:

memory-processing

---

# Worker Architecture

Location:

Worker process

Responsibilities:

- Pull jobs from queue
- Extract metadata
- Update database
- Mark completion

---

# Metadata Extraction Layer

Current Support:

YouTube

Extractor:

extractYoutubeMetadata()

Future Platforms:

Instagram
TikTok
Twitter/X
LinkedIn
GitHub
Notion
Spotify
Articles
Blogs
PDFs

---

# Realtime Architecture

Provider:

Supabase Realtime

Purpose:

Push memory updates to frontend.

---

# Realtime Flow

Worker updates database

↓

Postgres row changes

↓

Supabase Realtime

↓

Frontend subscription

↓

Zustand upsertMemory()

↓

UI updates automatically

---

# Authentication

Provider:

Supabase Auth

Current Model:

Authenticated users only.

Realtime subscriptions are scoped to:

user_id = current_user

This ensures:

- RLS compatibility
- User isolation
- Security

---

# Optimistic UI Architecture

User presses Save

↓

Temporary card inserted

↓

Database row created

↓

Worker processes

↓

Realtime update received

↓

Temporary card replaced

This creates perceived instant performance.

---

# Reconciliation Layer

Purpose:

Recover from missed realtime events.

Responsibilities:

- Query pending memories
- Compare against store
- Force synchronization

Acts as safety net.

Realtime remains primary mechanism.

---

# Current Performance Baseline

Measured:

Metadata extraction:
~2760 ms

Database update:
~324 ms

Total worker processing:
~3103 ms

Typical end-user experience:

Optimistic card:
0–100 ms

Fully enriched card:
3–4 seconds

This is acceptable for V1.

---

# Scaling Strategy

Phase 1

Single Worker

BullMQ

Supabase

Expected capacity:

Thousands of memories/day

---

Phase 2

Multiple Workers

Shared Redis

Queue Concurrency

Expected capacity:

Hundreds of thousands/day

---

Phase 3

Dedicated Metadata Services

Platform-specific extraction workers

Expected capacity:

Millions/day

---

# Future Architecture

Planned additions:

Semantic Search

Vector Embeddings

Knowledge Graph

Memory Relationships

Collections

AI Summaries

Recommendation Engine

Personal Memory Feed Ranking

Agentic Memory Retrieval

Cross-Memory Reasoning

---

# Architectural Non-Goals

Current V1 intentionally excludes:

Real-time collaboration

Shared workspaces

Offline-first architecture

Multi-region deployment

Distributed workers

Microservices

These can be added later if justified by scale.

---

# Current Status

Architecture Status:

Stable

Queue System:

Operational

Realtime:

Operational

Optimistic Updates:

Operational

Worker Processing:

Operational

Memory Enrichment:

Operational

Ready for MVP expansion.