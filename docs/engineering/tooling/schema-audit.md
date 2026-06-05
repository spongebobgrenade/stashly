# Schema Audit V2

Status: APPROVED FOR IMPLEMENTATION

Last Updated: 2026-06-01

---

# Purpose

Schema Audit V2 exists to detect database drift automatically before it causes runtime failures, retrieval issues, migration inconsistencies, or developer confusion.

The audit verifies alignment between:

- Live database state
- Migration history
- Generated database types

The goal is to ensure that the application, database, and migration history remain synchronized.

---

# Scope

Schema Audit V2 audits only the public database schema.

Out of Scope:

- auth schema
- storage schema
- realtime schema
- Supabase internal schemas
- RLS policies
- Database functions
- Triggers
- Experimental tables
- Extraneous table detection

These may be covered by future audit versions.

---

# Sources of Truth

Schema Audit V2 uses a hybrid source-of-truth model.

## Live Database

Represents actual execution reality.

Used to validate:

- tables
- columns
- indexes
- constraints
- vector configuration

---

## Migrations

Location:

```text
supabase/migrations/
```

Represents the historical contract.

Used to validate:

- migration ordering
- migration completeness
- migration application status

---

## Generated Database Types

Location:

```text
database.types.ts
```

Represents the application contract.

Used to validate:

- expected tables
- expected columns
- expected database structure

---

# Audit Categories

The audit executes the following categories in order.

---

## PREREQUISITES

Purpose:

Validate required runtime configuration before schema inspection begins.

Checks:

- SUPABASE_URL exists
- SUPABASE_SERVICE_ROLE_KEY exists
- Database connection succeeds

---

## DATABASE

Purpose:

Validate database accessibility.

Checks:

- public schema exists
- public schema is accessible

---

## TABLES

Purpose:

Validate expected tables.

Checks:

- all tables referenced by database.types.ts exist

---

## COLUMNS

Purpose:

Validate expected columns and type compatibility.

Checks:

- required columns exist
- basic type alignment exists

---

## INDEXES

Purpose:

Validate required indexes.

Checks:

- index exists
- target table matches
- target columns match
- access method matches

Examples:

- btree
- hnsw
- ivfflat

---

## CONSTRAINTS

Purpose:

Validate relational integrity.

Checks:

- primary keys exist
- foreign keys exist

---

## VECTOR

Purpose:

Validate semantic retrieval infrastructure.

Checks:

- vector extension installed
- embedding columns exist
- vector dimensions match expected configuration

Examples:

```text
vector(768)
```

---

## MIGRATIONS

Purpose:

Detect migration drift.

Checks:

- local migration exists in database history
- database history exists locally
- migration ordering is valid

---

## DATABASE_TYPES

Purpose:

Detect generated type drift.

Checks:

- database.types.ts exists
- Database interface exists
- generated structure appears synchronized

---

# PASS / FAIL Rules

## FAIL

Triggers:

```text
process.exit(1)
```

Examples:

- Missing environment variables
- Database unreachable
- Missing tables
- Missing columns
- Missing indexes
- Missing constraints
- Missing vector extension
- Incorrect vector dimensions
- Migration drift
- Missing database.types.ts

---

## WARNING

Does not fail execution.

Examples:

- Duplicate indexes
- Unused indexes

Warnings should be used sparingly.

The audit prioritizes signal quality over noise.

---

## PASS

Triggers:

```text
process.exit(0)
```

Conditions:

- All required checks succeed
- No FAIL results exist

---

# Output Format

Example:

```text
[PREREQUISITES]

PASS SUPABASE_URL configured
PASS SUPABASE_SERVICE_ROLE_KEY configured
PASS Database connection established

[DATABASE]

PASS Public schema accessible

[TABLES]

PASS saves table exists
PASS memory_embeddings table exists

Summary:
23 PASS
0 WARNING
0 FAIL

Exit Code: 0
```

---

# Design Principles

## Registry-Based Checks

Each audit rule must be independently executable.

Benefits:

- easier testing
- easier maintenance
- future extensibility

---

## Shared Audit Context

Database introspection should occur once.

Audit checks consume shared state rather than repeatedly querying the database.

---

## Single Exit Decision

The audit must never fail fast.

All checks execute.

The final exit code is determined after reporting completes.

---

## Low Noise

The audit should avoid generating warnings that developers will learn to ignore.

Trust in the audit is more important than exhaustive reporting.

---

# Future Versions

## Schema Audit V3

Potential additions:

### RLS_POLICIES

Validate:

- RLS enabled
- required policies exist
- user isolation guarantees

Reason:

Prevent cross-user retrieval leakage.

---

### FUNCTIONS

Validate:

- required RPC functions
- function signatures

---

### TRIGGERS

Validate:

- required triggers
- trigger configuration

---

### Auto Remediation

Generate:

- migration suggestions
- repair recommendations

---

# Success Criteria

Schema Audit V2 is successful when:

- Database drift becomes immediately visible.
- Migration inconsistencies are detected automatically.
- Generated types remain synchronized.
- Semantic retrieval infrastructure remains correctly configured.
- Engineers can trust audit results without being overwhelmed by noise.
