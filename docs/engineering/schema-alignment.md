# Schema Alignment

## Status

Active

## Purpose

This document aligns the canonical Memory Architecture with the persisted database schema and all runtime representations.

The database schema must become the authoritative implementation of the Memory Architecture.

Generated types must derive from schema.

Application types must derive from generated types.

Runtime code must derive from application types.

No layer may redefine Memory independently.

---

# Canonical Memory Table

Current canonical storage entity:

```text
saves
```

Future renaming is allowed.

The field contract is authoritative.

---

# Canonical Memory Fields

Required fields:

```text
id
user_id
original_input
content_type

processing_status

created_at
updated_at
```

Metadata fields:

```text
source_platform
canonical_url

title
description
thumbnail_url
creator_name

raw_metadata
```

---

# Processing Lifecycle

Canonical states:

```text
queued
processing
completed
failed
```

Rules:

```text
save endpoint creates queued

worker begins processing

worker finishes completed

worker failure writes failed
```

No additional lifecycle states are allowed.

---

# Ownership Hierarchy

Memory Architecture
↓
Database Schema
↓
Generated Types
↓
Application Types
↓
Runtime

The lower layer must align to the higher layer.

---

# Drift Elimination

Forbidden:

- duplicate Memory definitions
- handwritten persistence types
- schema/runtime mismatches
- undocumented columns
- undocumented statuses

Allowed:

- derived view models
- transport DTOs
- UI projections

These must derive from the canonical Memory model.

---

# Current Alignment Tasks

1. Add missing columns

```text
canonical_url
creator_name
raw_metadata
```

2. Align lifecycle

```text
pending -> queued
```

3. Regenerate database types

4. Remove duplicate Memory definitions

5. Align worker contracts

6. Align store contracts