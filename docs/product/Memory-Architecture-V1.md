# Memory Architecture V1

Status: LOCKED  
Version: 1.0  
Last Updated: 2026-06-01
Purpose: Target Memory Representation Architecture

---

# Purpose

This document defines the canonical structure of a Memory inside Stashly.

The goal is not to store links.

The goal is to create durable, searchable, platform-independent knowledge representations that remain useful even when source platforms change.

This architecture serves as the foundation for:

- Semantic Retrieval
- Hybrid Retrieval
- AI Recall
- Memory Chat
- Cross-Memory Synthesis
- Future Intelligence Features

---

# Core Principle

A Memory is not the original content.

A Memory is a structured representation of knowledge extracted from content.

The original content remains the source of truth.

The representation becomes the retrieval and intelligence layer.

---

# Memory Layers

Every memory consists of five logical layers.

```text
Memory
│
├── Raw Source Layer
├── Extracted Content Layer
├── Understanding Layer
├── User Layer
└── Retrieval Layer
```

---

# Layer 1: Raw Source Layer

Purpose:

Preserve the original source information exactly as received.

This layer is never modified.

## Example Fields

```json
{
  "original_input": "",
  "canonical_url": "",
  "source_platform": "",
  "saved_at": "",
  "creator_name": ""
}
```

## Responsibilities

- Maintain source provenance
- Preserve original URLs
- Support future re-processing
- Enable debugging and recovery

---

# Layer 2: Extracted Content Layer

Purpose:

Capture as much information as possible from the source.

This layer is platform-specific.

## Examples

### YouTube

```json
{
  "title": "",
  "description": "",
  "transcript": "",
  "creator_name": ""
}
```

### Instagram Reel

```json
{
  "caption": "",
  "transcript": "",
  "ocr_text": "",
  "creator_name": ""
}
```

### Article

```json
{
  "title": "",
  "article_text": "",
  "author": ""
}
```

### PDF

```json
{
  "document_text": "",
  "page_count": 0
}
```

## Responsibilities

- Preserve maximum information
- Support future AI processing
- Enable future re-indexing
- Avoid information loss

---

# Layer 3: Understanding Layer

Purpose:

Convert extracted content into platform-independent knowledge.

This layer becomes one of Stashly's primary long-term moats.

Even if platform extraction breaks later, stored understanding remains usable.

## Example Fields

```json
{
  "summary": "",
  "topics": [],
  "entities": [],
  "key_insights": [],
  "intent": "",
  "content_type": ""
}
```

## Example

Raw Content:

```text
3 mistakes beginners make while investing
```

Understanding:

```json
{
  "summary": "Common beginner investing mistakes involving emotional decisions, lack of diversification, and poor risk management.",
  "topics": [
    "investing",
    "finance",
    "risk management"
  ],
  "entities": [
    "diversification",
    "index funds",
    "asset allocation"
  ],
  "key_insights": [
    "Emotional investing often reduces long-term returns",
    "Diversification lowers concentration risk",
    "Risk management matters more than stock picking"
  ]
}
```

## Responsibilities

- Platform-independent representation
- Knowledge extraction
- Search optimization
- Future AI Recall support
- Cross-platform memory durability

---

# Layer 4: User Layer

Purpose:

Store knowledge added by the user.

User-generated information is treated as highly valuable.

## Example Fields

```json
{
  "notes": "",
  "tags": [],
  "collections": []
}
```

## Responsibilities

- User annotations
- Personal context
- Organization
- Collection membership

## Rule

AI systems must never overwrite user-created information.

User-created notes are considered part of the memory representation and participate in retrieval.

---

# Layer 5: Retrieval Layer

Purpose:

Generate embeddings and retrieval representations.

This layer is derived from all previous layers.

It is not manually authored.

## Generation Flow

```text
Raw Layer
+
Extracted Content Layer
+
Understanding Layer
+
User Layer

↓

Retrieval Document

↓

Embedding Generation

↓

Semantic Retrieval
```

---

# Retrieval Document V1

The retrieval document is the canonical text used for semantic embeddings.

## Structure

```text
TITLE

SUMMARY

TOPICS

ENTITIES

KEY INSIGHTS

CREATOR

USER NOTES
```

## Example

```text
How To Lose Fat Without Losing Muscle

Summary:
Explains maintaining muscle during calorie deficit through protein intake and resistance training.

Topics:
fitness
nutrition
fat loss

Entities:
protein
hypertrophy
calorie deficit

Key Insights:
Protein preserves muscle during calorie deficits.
Resistance training reduces muscle loss.

Creator:
Jeff Nippard

User Notes:
Use during cutting phase.
```

---

# What Gets Embedded

## Included

- Title
- Summary
- Topics
- Entities
- Key Insights
- Creator
- User Notes

---

# What Does Not Get Embedded

## Stored But Not Embedded

- Full transcripts
- OCR text
- Raw metadata
- Full descriptions
- Raw extraction payloads

Reason:

These fields are often noisy, excessively large, and reduce retrieval quality.

They remain available for future retrieval systems and AI Recall.

---

# Retrieval Philosophy

Stashly optimizes for both:

## Content Discovery

Example:

```text
Find the recipe video I saved last month.
```

## Knowledge Recall

Example:

```text
Show me everything I saved about muscle growth.
```

Both goals are first-class requirements.

However:

```text
Discovery > Precision
```

When conflicts occur, the system should favor discovery.

## Rationale

The primary goal of Stashly is not simply to retrieve saved content.

The primary goal is to surface valuable knowledge the user may have forgotten exists.

Discovery-first retrieval better supports:

- Long-term memory augmentation
- AI Recall
- Cross-memory synthesis
- Future intelligence systems

---

# Future Versions

## V2

Transcript-aware retrieval.

## V3

OCR-aware retrieval.

## V4

Visual understanding.

Example:

```text
Person cooking homemade pasta.
Kitchen.
Tomatoes.
Parmesan.
```

## V5

AI Recall.

Example:

```text
Show me everything I saved related to homemade cooking.
```

Across:

- YouTube
- Instagram
- Articles
- PDFs
- User Notes

---

# Known Weaknesses of V1

These limitations are accepted intentionally to maximize execution speed and reduce complexity.

## Transcript Blindness

V1 ignores transcripts during embedding generation.

Some valuable information will not be discoverable semantically.

Mitigation:

Transcripts remain stored for future re-indexing.

---

## OCR Blindness

Text present inside images is not included in retrieval.

Mitigation:

OCR storage remains available for future retrieval upgrades.

---

## No Visual Understanding

Images and videos are represented through extracted text only.

Mitigation:

Visual understanding is planned for future architecture versions.

---

## Single Memory Representation

Memories are retrieved independently.

Relationships between memories are not yet modeled.

Mitigation:

Knowledge graph architecture remains a future initiative.

---

# Architectural Decisions

## Locked

- Five-layer memory architecture
- Retrieval document abstraction
- Platform-independent understanding layer
- User-owned knowledge layer
- Discovery-first retrieval philosophy
- Key insights as a retrieval primitive
- User notes participate in retrieval
- Retrieval layer is derived, not authored

## Not Yet Locked

- Transcript processing strategy
- OCR processing strategy
- Visual understanding strategy
- Knowledge graph architecture
- Multimodal embedding strategy
- AI-generated memory synthesis architecture

---

# Guiding Principle

The goal is not to build a better bookmark manager.

The goal is to build a Memory Operating System.

Every future architecture decision should be evaluated against that objective.
