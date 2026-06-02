# Stashly Known Limitations

Status: Active

---

# Purpose

This document tracks current repository limitations, unsupported functionality, and intentionally incomplete architecture.

These are not all debt items.

Some are deliberate phase boundaries.

---

# Product-State Limitations

## Validation UI Only

Status:

Current Repository State

Limitation:

The current UI is a validation environment for architecture and functionality.

Impact:

- not the final public product interface
- not the final AI retrieval experience

## No Public Launch Yet

Status:

Intentional

Limitation:

The product should not launch publicly until AI-powered retrieval exists.

Impact:

- current search and dashboard validate infrastructure rather than final product promise

---

# Capture Limitations

## URL-First Capture

Status:

Current MVP Scope

Implemented:

- URLs

Not implemented:

- notes
- copied text
- screenshots
- images
- PDFs
- files
- voice notes

---

# Metadata Platform Limitations

## YouTube Playlists

Status:

Partially Supported

Limitation:

- resolver recognizes playlists
- enrichment path is not fully specialized end to end

## Instagram / TikTok / X / LinkedIn / Spotify / Notion

Status:

Unsupported

Limitation:

- no dedicated extractors
- URLs fall back to generic website extraction

## Medium / Product Hunt

Status:

Partially Supported

Limitation:

- metadata quality depends on generic OpenGraph availability

## No Headless Browser Fallback

Status:

Not Implemented

Limitation:

- extraction relies on direct HTTP requests
- JS-rendered or protected pages may fail enrichment

## Website Attribution Ambiguity

Status:

Known Limitation

Limitation:

- `og:site_name` currently maps into `creator_name`
- publisher and creator are not modeled separately

---

# Retrieval Limitations

## Retrieval V1 Only In User Queries

Status:

Implemented

Limitation:

- user queries currently use keyword retrieval only

## Semantic Retrieval Not Query-Serving Yet

Status:

Foundation Implemented, Serving Not Implemented

Current foundation exists for:

- retrieval documents
- embeddings
- embedding queue
- embedding worker
- `memory_embeddings`

Current limitation:

- no vector query path
- no semantic search API

## No Hybrid Retrieval

Status:

Not Implemented

Limitation:

- keyword and semantic signals are not fused yet

## No AI Retrieval

Status:

Not Implemented

Limitation:

- no query understanding
- no retrieval planning
- no retrieval explanations

---

# Embedding Architecture Limitations

## Local Ollama Dependency

Status:

Implemented With Constraint

Limitation:

- embedding generation depends on a local Ollama runtime by default

## No Embedding Refresh Strategy

Status:

Not Implemented

Limitation:

- no re-embedding policy when Memory changes
- no provider/model upgrade strategy

## No Embedding Deduplication / Replacement Policy

Status:

Not Implemented

Limitation:

- repeated embedding jobs may create multiple rows without explicit lifecycle rules

## Retrieval Document Is Minimal

Status:

Implemented With Constraint

Current document uses:

- title
- description
- creator_name

Limitation:

- original input and richer context are not yet part of the semantic document

---

# Synchronization Limitations

## Reconciliation Polling

Status:

Implemented

Limitation:

- polling runs every 15 seconds regardless of pending-state presence

## No State-Aware Synchronization

Status:

Not Implemented

Limitation:

- synchronization does not yet optimize around pending Memory lifecycle state

---

# Operations Limitations

## No Queue Dashboard

Status:

Not Implemented

## No Structured Logging

Status:

Not Implemented

## No Distributed Workers

Status:

Deferred

## Schema Source Drift

Status:

Known Limitation

Limitation:

- runtime and generated types use `memory_embeddings`
- checked-in migrations do not currently define it

## `dev:all` Dependency Gap

Status:

Known Limitation

Limitation:

- `package.json` defines `dev:all` using `concurrently`
- `concurrently` is not present in the current dependencies

---

# Memory and Discovery Limitations

## No Relationships

Status:

Not Implemented

## No Knowledge Graph

Status:

Not Implemented

## No Collections

Status:

Not Implemented

## No Rediscovery Engine

Status:

Not Implemented

---

# Current Phase Boundary

Still outside current implemented scope:

- semantic retrieval serving
- hybrid retrieval
- AI retrieval
- rediscovery engine
- relationships
- knowledge graph
- non-URL capture types

These remain future layers on top of the current Memory and embedding foundation.

---

# Last Updated

After:

- Search V1
- Synchronization V1
- Embedding Architecture V1

# Architecture Drift Audit V1

## Current Limitations

### Dependency Validation

Current behavior:

TRD.md Memory Architecture dependency is validated using normalized text presence.

Example:

"Memory Architecture V1"

Future improvement (V2):

Dependency validation should become structure-aware and verify that a dedicated dependency section exists rather than relying on text presence alone.

Reason:

Text matching can produce false positives and does not guarantee architectural dependency is formally declared.