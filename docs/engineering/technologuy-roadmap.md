"}
# Technology Roadmap

## Purpose

This document captures long-term technology decisions, future architectural direction, rejected alternatives, and strategic upgrades for Stashly.

This is not an implementation backlog.

This is a record of technology decisions that should survive across development phases and chat sessions.

---

# Core Philosophy

Build systems in their final architectural shape.

Implement only the minimum surface area required for the current product stage.

Avoid throwaway architectures.

Avoid premature implementation of systems that are not yet dependencies.

---

# AI Strategy

## Current

No AI features in MVP.

Focus on memory ingestion, retrieval, metadata enrichment, and search.

## Future

Introduce AI capabilities after memory foundation is stable.

Potential capabilities:

- Semantic retrieval
- Memory summarization
- Memory clustering
- Topic extraction
- Personalized recommendations
- Agent-assisted rediscovery

---

# Model Provider Strategy

## Decision

Use OpenRouter as the primary model abstraction layer.

## Reason

Avoid vendor lock-in.

Allow model replacement without application changes.

Support multiple providers through one integration layer.

## Future

Model Router Layer.

Capabilities:

- Automatic fallback
- Cost-aware routing
- Latency-aware routing
- Capability-based routing
- Free-tier optimization

Potential models:

- Gemini Flash
- DeepSeek
- Qwen
- Kimi
- Future OpenRouter models

---

# Vector Search Strategy

## Current

Keyword search.

## Future

Supabase pgvector.

Reason:

Existing infrastructure already supports vectors.

Avoid introducing a dedicated vector database prematurely.

---

# RAG Strategy

## Current

Not implemented.

## Future

Memory retrieval layer built on pgvector.

Evaluate:

- Native pgvector
- Hybrid search
- Knowledge graph augmentation

Rejected for MVP:

- Dedicated vector databases
- Complex RAG orchestration frameworks

---

# Agent Framework Strategy

## Current

No agent orchestration.

## Future

Evaluate LangGraph as primary orchestration framework.

Potential use cases:

- Research agents
- Content enrichment agents
- Memory organization agents
- Recommendation agents

---

# Browser Automation Strategy

## Current

fetch + cheerio

## Future

Evaluate:

- Agent Browser
- Browser automation infrastructure

Use cases:

- Dynamic page extraction
- Authenticated content ingestion
- Rich metadata extraction

---

# CLI Strategy

## Current

Not implemented.

## Future

Stashly CLI.

Potential commands:

stashly ingest

stashly search

stashly export

stashly sync

stashly agent

Framework candidate:

commander.js

---

# Infrastructure Strategy

Database:
Supabase

Queue:
BullMQ

Redis:
Upstash

Frontend:
Next.js

State:
Zustand

Realtime:
Supabase Realtime

---

# Deferred Evaluations

- Hermes Agent
- SwarmVault
- Dedicated vector databases
- Multi-agent systems
- Browser-use frameworks
- Self-hosted LLM infrastructure

These remain candidates but are intentionally deferred until core memory workflows are validate

# Operations & Reliability Roadmap

## Why This Exists

As Stashly evolves from a simple web app into an AI Memory Operating System, failures will increasingly occur in background services rather than the UI.

Examples:

- Metadata worker stopped
- Queue backlog growing
- Embedding generation failed
- RAG indexing stuck
- AI extraction service unavailable
- OpenRouter model exhausted
- Rate limits reached
- Scrapers blocked
- Realtime disconnected

Without visibility, these failures appear to users as "the app is broken" even when the frontend is functioning correctly.

The goal is to make Stashly observable, debuggable, and self-healing.

---

## Phase 1 — Worker & Queue Monitoring

### Internal Operations Dashboard

Create an admin-only monitoring page.

Display:

- Worker Status
- Queue Size
- Queued Jobs
- Processing Jobs
- Completed Jobs
- Failed Jobs
- Last Worker Heartbeat

Purpose:

Immediately detect whether background systems are functioning.

Priority:

- Post-MVP
- High

---

### Worker Heartbeat System

Worker periodically writes:

```text
last_seen_at
```

to Redis or Supabase.

Frontend dashboard displays:

- Healthy
- Degraded
- Offline

based on heartbeat age.

Priority:

- Post-MVP
- High

---

### Failed Job Inspection

Store:

- Job ID
- Failure Reason
- Stack Trace
- Timestamp
- Retry Count

Allow manual retry.

Priority:

- Post-MVP
- High

---

## Phase 2 — AI Infrastructure Monitoring

### Model Router Dashboard

Display:

- Current Active Model
- Fallback Model
- Requests Today
- Tokens Consumed
- Estimated Cost
- Failures
- Rate Limit Events

Potential providers:

- OpenRouter
- OpenAI
- Anthropic
- Google
- DeepSeek
- Kimi
- Qwen

Priority:

- V2

---

### Automatic Model Failover

If primary model fails because of:

- Rate limits
- Quota exhaustion
- Timeout
- Provider outage

Automatically route requests to:

- Fallback Model A
- Fallback Model B
- Fallback Model C

Goal:

Users should never notice provider outages.

Priority:

- V2

---

## Phase 3 — RAG Observability

### Knowledge Pipeline Monitoring

Display:

- Memories Indexed
- Embeddings Generated
- Pending Embeddings
- Failed Embeddings
- Vector Count
- Retrieval Latency

Purpose:

Ensure memory retrieval remains healthy.

Priority:

- V2

---

### Retrieval Quality Monitoring

Track:

- Search Success Rate
- Retrieval Relevance
- Missed Retrievals
- AI Hallucination Reports

Priority:

- V3

---

## Phase 4 — Self-Healing Systems

### Automatic Retry Framework

Failures automatically retry:

- Metadata Extraction
- Embedding Generation
- AI Summarization
- Web Fetching

using:

- Exponential Backoff
- Retry Limits
- Dead Letter Queue

Priority:

- V3

---

### Dead Letter Queue

Jobs that repeatedly fail are moved to a Dead Letter Queue instead of being lost.

Allows:

- Inspection
- Recovery
- Reprocessing

Priority:

- V3

---

## Long-Term Vision

Stashly should eventually operate like production-grade AI infrastructure.

Target characteristics:

- Observable
- Fault-Tolerant
- Provider-Agnostic
- Self-Healing
- Cost-Aware
- Model-Aware
- Scalable

The user should never need to know:

- Which model was used
- Which provider was used
- Whether a worker restarted
- Whether a queue recovered
- Whether a scraper failed

The platform should automatically handle failures and continue operating.