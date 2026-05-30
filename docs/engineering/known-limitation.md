# Stashly Known Limitations

Status: Active

Purpose:

Document current repository limitations, unsupported capabilities, implementation constraints, and intentionally deferred functionality.

A limitation is not necessarily engineering debt.

A limitation may be:

- unsupported functionality
- deferred architecture
- incomplete platform support
- MVP scope boundary

---

# Platform Support Limitations

## YouTube Playlists

Status:

Partially Supported

Current State:

The resolver recognizes YouTube playlists.

Current Limitation:

End-to-end playlist metadata extraction is not implemented.

Impact:

Playlist URLs may not receive complete enrichment.

---

## Instagram

Status:

Unsupported

Current Limitation:

No extractor exists.

Impact:

Instagram URLs fall back to generic website extraction.

---

## TikTok

Status:

Unsupported

Current Limitation:

No extractor exists.

Impact:

TikTok URLs fall back to generic website extraction.

---

## X (Twitter)

Status:

Unsupported

Current Limitation:

No extractor exists.

Impact:

X URLs fall back to generic website extraction.

---

## LinkedIn

Status:

Unsupported

Current Limitation:

No extractor exists.

Impact:

LinkedIn URLs fall back to generic website extraction.

---

## Spotify

Status:

Unsupported

Current Limitation:

No extractor exists.

Impact:

Spotify URLs fall back to generic website extraction.

---

## Notion

Status:

Unsupported

Current Limitation:

No extractor exists.

Impact:

Notion URLs fall back to generic website extraction.

---

## Medium

Status:

Partially Supported

Current State:

Medium URLs use generic OpenGraph extraction.

Current Limitation:

Metadata quality depends entirely on available OpenGraph tags.

Enrichment quality is not guaranteed.

---

## Product Hunt

Status:

Partially Supported

Current State:

Product Hunt URLs use generic OpenGraph extraction.

Current Limitation:

Metadata quality depends entirely on available OpenGraph tags.

Enrichment quality is not guaranteed.

---

# Metadata Extraction Limitations

## OpenAI Properties

Status:

Known Limitation

Current Limitation:

Some OpenAI properties block scraping requests.

Observed Result:

403 responses.

Impact:

Metadata extraction may fail.

---

## No Headless Browser Fallback

Status:

Not Implemented

Current Limitation:

Metadata extraction relies on direct HTTP requests.

Current Architecture:

Resolver
↓
Extractor
↓
HTTP Fetch

Missing:

Browser-based extraction fallback.

Impact:

JavaScript-rendered pages and anti-bot protected pages may fail enrichment.

---

## Website Attribution

Status:

Known Limitation

Current State:

OpenGraph extraction maps:

```text
og:site_name
↓
creator_name
```

Current Limitation:

Publisher and creator are not always the same entity.

Future Work:

Separate:

- creator_name
- publisher_name
- platform_name

---

## No Metadata Retry Strategy

Status:

Not Implemented

Current State:

Single extraction attempt.

Failure Path:

processing
↓
failed

Impact:

Temporary platform failures immediately become permanent failures.

---

# Capture Limitations

## URL-Only Capture

Status:

Current MVP Scope

Supported:

- URLs

Unsupported:

- Notes
- Text
- Images
- Screenshots
- PDFs
- Files
- Voice Notes
- Audio Uploads

Impact:

Memory capture remains URL-centric.

---

# Retrieval Limitations

## Keyword Search Only

Status:

Implemented

Current Search:

ILIKE search across:

- title
- description
- creator_name
- source_platform
- original_input

Current Limitation:

Search is lexical only.

Search does not understand meaning.

Example:

```text
AI
```

will not automatically match:

```text
Artificial Intelligence
```

unless those words exist in metadata.

---

## No Semantic Search

Status:

Not Implemented

Missing:

- embeddings
- vector retrieval
- similarity search

---

## No Hybrid Search

Status:

Not Implemented

Current Search:

Keyword only.

Future Search:

Keyword
+
Semantic Retrieval

---

# Memory Architecture Limitations

## No Relationships

Status:

Not Implemented

Current Limitation:

Memories exist independently.

Missing:

- memory links
- parent-child relationships
- references
- graph edges

---

## No Knowledge Graph

Status:

Not Implemented

Current Limitation:

No entity graph exists.

No relationship graph exists.

---

## No Collections

Status:

Not Implemented

Current Limitation:

Users cannot group memories into collections.

---

## No Rediscovery Engine

Status:

Not Implemented

Current Limitation:

No resurfacing system exists.

No recommendation system exists.

---

# AI Layer Limitations

## No AI Retrieval

Status:

Not Implemented

Current Limitation:

Users can search memories.

Users cannot ask questions across memories.

---

## No AI Summaries

Status:

Not Implemented

Current Limitation:

Memories are stored individually.

No synthesized summaries exist.

---

## No Cross-Memory Reasoning

Status:

Not Implemented

Current Limitation:

The system cannot reason across multiple memories.

---

## No Agentic Retrieval

Status:

Not Implemented

Current Limitation:

No agents exist.

No memory planning exists.

No autonomous retrieval workflows exist.

---

# Synchronization Limitations

## Reconciliation Polling

Status:

Implemented

Current State:

Polling occurs every 15 seconds.

Current Limitation:

Polling continues even when no pending memories exist.

Impact:

Additional API traffic.

Future Architecture:

State-aware synchronization.

Example:

Pending Memories Exist
↓
Polling Enabled

No Pending Memories
↓
Polling Disabled

---

# Operations Limitations

## No Queue Dashboard

Status:

Not Implemented

Current Limitation:

Queue visibility is limited to logs.

Missing:

- queue metrics
- job monitoring
- failure dashboard

---

## No Structured Logging

Status:

Not Implemented

Current Limitation:

Worker logging uses console statements.

---

## No Distributed Workers

Status:

Deferred

Current State:

Single metadata worker.

Impact:

Horizontal scaling is not yet implemented.

---

# Current MVP Boundary

The following are intentionally outside current MVP scope:

- Semantic Search
- Embeddings
- Knowledge Graph
- Relationships
- Collections
- Rediscovery
- AI Retrieval
- AI Summaries
- Agentic Retrieval
- Offline Support
- Multi-Device Synchronization
- Collaboration

These systems will be introduced in future phases on top of the existing Memory Foundation.

---

# Last Updated

After:

- Metadata Architecture V1
- Search Architecture V1
- Synchronization Layer V1