# Stashly PRD v4.1

> **Tagline:** Stash it. Find it. Share it.  
> **Version:** 4.1  
> **Status:** Locked  
> **Phase:** Retrieval-First MVP  
> **Classification:** Internal

---

# Executive Summary

## Problem

People save hundreds of pieces of content every week across:

- Instagram
- TikTok
- YouTube
- Safari
- screenshots
- PDFs
- notes
- products
- recipes
- articles
- videos
- files

Most saved information is never meaningfully retrieved again.

Current systems fail because:

- saving is fragmented
- retrieval is weak
- organization is manual
- information becomes buried
- users forget where things were saved
- saved systems become digital graveyards

---

## Solution

Stashly is an AI-assisted memory layer for a user's digital life.

The system allows users to:

```text
See something valuable
→ Share to Stashly
→ Forget about it
→ Retrieve naturally later
```

Stashly absorbs content, enriches it invisibly, and retrieves it through conversational interaction.

The system optimizes for:

- memory recovery
- low cognitive effort
- retrieval confidence
- rediscovery
- contextual recall

---

# Product Positioning

## What Stashly Is

Stashly is:

> A universal memory layer for anything users want to remember.

The product exists to reduce remembering burden.

---

## What Stashly Is Not

Stashly is not:

- a bookmark manager
- a read-later tool
- a productivity workspace
- a manual organization system
- a folder-based archive
- a traditional social network

---

## Core Product Differentiators

1. Universal intake
2. Conversational retrieval
3. AI-assisted memory recovery
4. Cross-platform memory layer
5. Retrieval-first interaction architecture
6. Invisible organization
7. Rediscovery-oriented experience

---

# Product Principles

## Locked Product Principles

- Retrieval-first architecture
- AI handles complexity invisibly
- Users should not organize manually
- Saving should require minimal decisions
- Heavy processing should remain asynchronous
- Backend owns business logic
- Retrieval quality is the primary product value
- Simplicity is preferred over feature density
- Build lean while designing for scale

---

# Universal Intake

## Primary Capture Flow

```text
Anything
→ Share
→ Stashly
→ Done
```

---

## Supported Content Types

Supported memory sources include:

- URLs
- reels
- videos
- articles
- PDFs
- screenshots
- images
- notes
- copied text
- products
- files
- voice notes

---

# Core User Personas

## P1 — Social Saver

### Profile

Heavy short-form content consumer.

### Behavior

- saves reels frequently
- discovers content socially
- rarely revisits saved tabs
- remembers ideas vaguely

### Goals

- retrieve forgotten content naturally
- avoid losing useful discoveries
- resurface interesting content quickly

---

## P2 — Research Collector

### Profile

Information-heavy user collecting learning material.

### Behavior

- saves articles
- stores research links
- captures references across platforms
- struggles with scattered information

### Goals

- conversational retrieval
- unified memory layer
- reduced information fragmentation

---

## P3 — Taste Curator

### Profile

Collects aesthetically or personally meaningful content.

### Behavior

- saves travel ideas
- saves food inspiration
- saves interiors, fashion, and recommendations

### Goals

- rediscovery
- sharing curated taste
- memory resurfacing

---

## P4 — Screenshot Memory User

### Profile

Uses screenshots as a memory system.

### Behavior

- captures information impulsively
- rarely organizes screenshots
- forgets stored content

### Goals

- screenshot retrieval
- OCR-assisted recovery
- contextual resurfacing

---

# Core Product Systems

## C1 — Frictionless Saving

### Principle

Saving should require minimal cognitive effort.

---

### Must Have

- mobile share sheet
- URL saving
- screenshot upload
- note attachment
- background processing
- instant save confirmation
- automatic metadata extraction
- automatic categorization
- optional reinforcement note

---

### Should Have

- bulk import
- image-only save
- browser extension support

---

## C2 — Conversational Retrieval

### Principle

Users should retrieve memories naturally rather than browse manually.

---

### Must Have

- natural language retrieval
- semantic search
- keyword fallback
- contextual retrieval
- time-aware retrieval
- retrieval explanation
- related memory suggestions
- original source access
- retrieval confidence handling

---

## C3 — Homepage Retrieval Experience

### Principle

The homepage exists primarily for retrieval and rediscovery.

Homepage is:

> Memory Home

not:

> dashboard software

---

### Must Have

- AI-centered retrieval input
- suggested prompts
- conversational interaction
- retrieval-first interaction hierarchy
- exact memory surfaced first
- transparent retrieval explanation
- original source access
- related memory bundles
- rediscovery surfaces
- mobile-first accessibility
- immersive desktop exploration

---

### Example Queries

- “show me that startup reel”
- “find the protein article”
- “that Rome travel thing I saved”
- “show the workout screenshot I shared”

---

## C4 — Memory Discovery System

### Principle

Discovery should feel organic rather than administratively organized.

---

### Discovery Goals

The system should support:

- rediscovery
- contextual resurfacing
- related memory exploration
- thematic grouping
- relationship-based navigation

---

### Experience Direction

Discovery may evolve toward:

- film-roll inspired interaction
- floating memory stacks
- layered content systems
- immersive exploration
- contextual bundles
- fluid navigation

---

## C5 — Rediscovery Engine

### Must Have

- forgotten memory resurfacing
- contextual rediscovery
- weekly memory digest
- related memory suggestions

---

### Future Possibilities

- save streaks
- retrieval reminders
- smart resurfacing timing
- AI-curated memory groups

---

## C6 — Stashes and Sharing

### Principle

Sharing should extend memory utility without turning the product into a social feed.

---

### Must Have

- private-by-default behavior
- public stashes
- shareable stash links
- quick re-stash
- profile system
- stash importing

---

### Constraints

The product must not become:

- feed-first
- engagement-maximizing
- creator-economy dependent
- socially addictive

Memory utility remains primary.

---

## C7 — Platform Foundation

### Must Have

- Google authentication
- email authentication
- permanent persistence
- PWA support
- Android share support
- iOS share support

---

# Retrieval System

## Retrieval Goal

The system should surface:

> the likely remembered item

not:

> the most technically accurate keyword match

---

## Retrieval Results Should Include

- saved timestamp
- source platform
- retrieval explanation
- original source access
- related memory bundles

---

## Retrieval Ranking Priorities

1. Semantic similarity
2. Optional note relevance
3. OCR relevance
4. Contextual similarity
5. Recency
6. Retrieval history

---

## Retrieval Explanation Rules

Retrieval explanations may only use:

- user-provided content
- timestamps
- explicit metadata
- content similarity
- bundle relationships
- user-approved integrations

The system must never imply hidden knowledge or inferred life context.

---

## Example Retrieval Card

```text
Instagram Reel

“10 startup ideas no one is building in India”

Saved: March 14
Source: Instagram

Why this was retrieved:
Matched startup-related query
+ Similar to previously saved founder content

[Open Original]
[View Summary]
```

---

# Memory Cue System

## Purpose

Memory cues improve recognition and retrieval confidence.

---

## Sources

Memory cues may use:

- timestamps
- source platform
- OCR
- metadata
- optional notes
- content similarity
- retrieval relationships

---

## Example Memory Cues

- “Shared alongside restaurant and hotel links”
- “Similar to startup content previously saved”
- “Saved from Instagram”
- “Matched your AI tools bundle”

---

# Reinforcement Layer

## Optional Reinforcement Prompt

```text
Why did I save this?
```

Examples:

- buy later
- gym routine
- travel idea
- startup inspiration

This layer should remain optional.

---

# AI Interaction Model

## AI Responsibilities

The AI system handles:

- metadata enrichment
- content understanding
- contextual relationships
- memory ranking
- retrieval orchestration
- rediscovery support
- summarization
- memory grouping

---

## AI Constraints

Users should not need to:

- manually organize
- maintain folders
- classify information
- build taxonomies

---

## Supported Memory Categories

- recipes
- workouts
- places
- products
- articles
- videos
- screenshots
- audio
- notes
- social posts

---

# Platform Support

Supported platforms include:

- iOS
- Android
- desktop browsers
- Windows
- Linux
- ChromeOS

Additional device ecosystems may be supported later.

---

# Notification Philosophy

Notifications should create retrieval value rather than engagement addiction.

---

## Allowed Notifications

- rediscovery moments
- retrieval reminders
- forgotten memory resurfacing

---

## Example Notifications

- “You saved this ramen place months ago.”
- “Remember this workout routine?”
- “You may want to revisit this travel guide.”

---

# Emotional Product Goals

Users should feel:

- relief
- trust
- rediscovery delight
- ownership
- reduced cognitive load
- confidence in retrieval

Users should not feel:

- pressure to organize
- productivity guilt
- fear of forgetting
- surveillance discomfort
- administrative fatigue

---

# Habit Loop

```text
See something valuable
→ Share to Stashly
→ Instant save confidence
→ Forget naturally
→ Retrieve successfully later
→ Trust increases
→ Saving behavior compounds
```

---

# Legal Constraints

The system must never:

- scrape Instagram
- scrape TikTok
- download protected media
- bypass platform restrictions

---

## Permanent Policy

The system operates through:

- share flows
- user-provided content
- approved integrations
- accessible metadata

---

# Competitive Positioning

| Competitor | Limitation |
|---|---|
| Instagram Saved | Weak retrieval |
| Pinterest | Discovery-first rather than retrieval-first |
| Notion | Manual organization burden |
| Readwise | Narrow capture scope |
| WhatsApp self-chat | Poor retrieval structure |
| Screenshot folders | Retrieval failure at scale |

---

## Stashly Position

> Universal memory layer + AI-assisted conversational retrieval

---

# Success Metrics

## North Star

Time to first retrieval magic moment.

---

## Core Metrics

- successful retrieval rate
- retrieval latency
- week-2 retention
- saves per week
- rediscovery engagement
- retrieval confidence success

---

## Product-Market-Fit Events

- save_created
- save_opened
- retrieval_attempted
- retrieval_success
- stash_imported
- rediscovery_opened

---

# Accessibility Requirements

The product should support:

- screen readers
- keyboard navigation
- reduced motion
- large text
- high contrast modes

Accessibility must not become post-launch cleanup work.

---

# Empty State Philosophy

Users should never encounter emotionally empty interfaces.

---

## Example Empty States

- “Try asking about something you saved.”
- “Share your first memory.”
- “Upload screenshots to begin.”
- “Ask Stashly to find something for you.”

---

# Onboarding Direction

## Core Goal

The onboarding experience should quickly establish:

- trust
- simplicity
- retrieval potential
- capture ease

---

## Initial Personalization

Possible onboarding questions:

- What do you save most?
- Reels?
- Screenshots?
- Recipes?
- Travel ideas?
- Research?
- Shopping?

Purpose:

- personalize examples
- improve onboarding relevance
- accelerate understanding

---

# Technical Product Assumptions

- modular monolith architecture
- asynchronous processing
- low-cost infrastructure initially
- backend-owned business logic
- retrieval-first system design

---

# Internationalization

## MVP Language

English-first.

---

## Future Direction

- multilingual OCR
- multilingual retrieval
- localization
- mixed-language search

---

## Monetization Direction

Stashly is intended to become a sustainable revenue-generating platform.

However, monetization structure is not fully finalized during the MVP phase.

Current pricing examples are exploratory placeholders and may evolve based on:

- user behavior
- retention
- retrieval frequency
- infrastructure cost
- AI processing cost
- willingness-to-pay signals
- platform evolution

Potential future monetization directions may include:

- premium retrieval capabilities
- expanded storage tiers
- collaborative memory systems
- creator/public stash ecosystems
- AI-assisted organization
- team/workspace memory systems
- API access

## Monetization Constraint

Monetization must never:

- reduce memory trust
- degrade retrieval quality
- create manipulative engagement loops
- pressure users into organizational complexity

Memory utility remains the primary product value.

---

## Monetization Constraint

Monetization must never reduce retrieval quality.

---

# Non-Goals

The product is not intended to become:

- a folder-management system
- a productivity workspace
- a media scraping platform
- a cloud storage replacement
- a social messaging platform

---

# Product Assumptions

- share behavior can become habitual
- conversational retrieval improves retention
- memory cues improve recognition
- rediscovery creates long-term engagement
- retrieval quality drives trust

---

# Roadmap Direction

| Phase | Focus |
|---|---|
| Phase 1 | MVP Retrieval System |
| Phase 2 | Recommendations and Extensions |
| Phase 3 | Native Apps and Integrations |
| Phase 4 | Community and APIs |

---

# PRD Status

| Field | Value |
|---|---|
| Version | 4.1 |
| Status | LOCKED |

This PRD may evolve through future version upgrades, but foundational behavior should remain stable.