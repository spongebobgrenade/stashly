# Stashly Search Architecture

> Product: Stashly  
> Type: Search Architecture Document  
> Version: 1.0  
> Status: Source of Truth  
> Layer: Product Architecture  
> Hierarchy: Philosophy → PRD → Memory Architecture → Search Architecture → TRD → Implementation

---

# 1. Purpose

This document defines the canonical architecture of Search in Stashly.

Its purpose is to establish:

- what Search is
- what Retrieval is
- how Search differs from Retrieval
- how Search evolves over time
- what information Search owns
- what information Search does not own
- how Search interacts with Memory

This document exists to prevent Search architecture drift as Stashly evolves from a simple memory repository into an AI Memory Layer.

---

# 2. Search Is Not Memory

Memory and Search are different architectural layers.

Memory answers:

> What has been remembered?

Search answers:

> How can a remembered thing be found again?

Memory persists truth.

Search discovers truth.

Search does not own Memory.

Search derives from Memory.

---

# 3. Search Is Not Retrieval

Search and Retrieval are related but not identical.

Search is the user-facing capability.

Retrieval is the system capability.

---

## Search

Search is the experience.

Examples:

- searching by title
- searching by creator
- searching by keywords
- searching by concepts
- searching by vague intent

---

## Retrieval

Retrieval is the engine.

Examples:

- lexical matching
- metadata matching
- vector matching
- ranking
- reranking
- confidence scoring

---

Relationship:

```text
User
  ↓
Search
  ↓
Retrieval
  ↓
Memory
```

---

# 4. Search Principles

## 4.1 Search Exists To Recover Memories

Search is not a database query tool.

Search exists to help users recover things they previously wanted remembered.

---

## 4.2 Recognition Beats Recall

Users often do not remember exact titles.

Search should optimize for recognition.

Examples:

Bad:

"Type exact title"

Good:

"Show things related to startup funding"

---

## 4.3 Search Must Remain Trust-Safe

Search may retrieve.

Search may rank.

Search may recommend.

Search must never fabricate memories.

Search can only return information grounded in stored Memories.

---

## 4.4 Search Evolves

Search capability is expected to evolve.

Search quality improves over time.

Memory truth remains stable.

Search derives from Memory.

---

# 5. Search Ownership Boundaries

Search owns:

- query interpretation
- result ranking
- result presentation
- result ordering
- retrieval orchestration

Search does not own:

- Memory truth
- Memory lifecycle
- Memory ownership
- Memory metadata

---

# 6. Retrieval Ownership Boundaries

Retrieval owns:

- matching
- ranking
- scoring
- filtering
- retrieval explanations

Retrieval does not own:

- Memory semantics
- Memory persistence
- Memory lifecycle

---

# 7. Search Evolution Model

Search evolves through multiple stages.

Each stage builds on the previous one.

Earlier stages are not discarded.

They become fallback mechanisms.

---

# 8. Search V1

## Objective

Allow users to find saved Memories quickly.

---

## Retrieval Method

Lexical Retrieval

Search against:

- title
- description
- creator_name
- source_platform
- original_input

---

## Ranking

Simple relevance ordering.

---

## Trust Model

Only return stored Memory data.

No AI interpretation.

---

## Search Flow

```text
User Query
     ↓
Lexical Match
     ↓
Rank Results
     ↓
Display Results
```

---

# 9. Search V2

## Objective

Improve retrieval quality.

---

## Additional Capabilities

- metadata weighting
- creator matching
- platform matching
- fuzzy matching

---

## Search Flow

```text
User Query
     ↓
Lexical Retrieval
     ↓
Ranking Layer
     ↓
Display Results
```

---

# 10. Search V3

## Objective

Support concept-level search.

---

## Additional Capabilities

- embeddings
- semantic retrieval
- meaning-based matching

---

## Search Flow

```text
User Query
     ↓
Lexical Retrieval
     ↓
Semantic Retrieval
     ↓
Fusion Layer
     ↓
Ranking Layer
     ↓
Display Results
```

---

# 11. Search V4

## Objective

Support AI-assisted memory recovery.

---

## Additional Capabilities

- query understanding
- retrieval planning
- multi-stage retrieval
- retrieval explanations

---

## Search Flow

```text
User Query
     ↓
Query Understanding
     ↓
Retrieval Planning
     ↓
Lexical Retrieval
     ↓
Semantic Retrieval
     ↓
Fusion Layer
     ↓
Ranking Layer
     ↓
Display Results
```

---

# 12. Search Inputs

Search may use:

- title
- description
- creator_name
- source_platform
- original_input
- future notes
- future summaries

Search may use future retrieval indexes derived from Memory.

Search must not depend on information outside user-owned Memory scope.

---

# 13. Search Outputs

Search returns:

- matching Memories
- ranking order
- retrieval metadata

Search does not modify Memory.

Search does not enrich Memory.

Search does not redefine Memory.

---

# 14. Retrieval Artifacts

Retrieval systems may generate:

- scores
- ranks
- confidence values
- semantic similarity values
- explanations

These are retrieval artifacts.

They are not Memory fields.

They must not be persisted inside the canonical Memory entity.

---

# 15. Search And Memory Relationship

Memory remains authoritative.

Search derives from Memory.

If Search and Memory disagree:

Memory wins.

Search must adapt.

Memory must not be altered to accommodate Search.

---

# 16. Search And AI Relationship

AI may improve Search.

AI must not replace Search truth.

AI may:

- interpret queries
- improve ranking
- explain retrieval

AI may not:

- fabricate Memories
- invent retrieval results
- create false source attribution

---

# 17. Search Isolation Rules

Search remains user-scoped.

Retrieval remains user-scoped.

Ranking remains user-scoped.

No Search system may retrieve Memories belonging to another user unless future permission architecture explicitly allows it.

---

# 18. Future Retrieval Systems

Future retrieval systems may include:

- semantic retrieval
- relationship retrieval
- rediscovery retrieval
- bundle retrieval
- recommendation retrieval

These systems derive from Memory.

They do not redefine Memory.

---

# 19. Compatibility Requirements

Search Architecture must remain compatible with:

- Memory Architecture
- Runtime Alignment
- Retrieval Systems
- AI Systems
- Rediscovery Systems

Search evolves.

Memory remains stable.

---

# 20. Final Boundary Definition

Search is:

> the user-facing capability responsible for helping users recover remembered information.

Search is not:

> the owner of Memory truth.

Search derives from Memory.

Memory remains authoritative.