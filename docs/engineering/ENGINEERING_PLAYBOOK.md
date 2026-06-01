# Stashly Engineering Playbook

Version: 1.0

---

# Purpose

This document defines the mandatory engineering workflow for all Stashly development.

The goal is to:

- Reduce debugging time
- Reduce AI token waste
- Prevent architecture drift
- Improve development speed
- Create repeatable engineering processes

This document is considered part of the Stashly system architecture.

---

# Core Engineering Principles

## Principle 1

Never guess.

Collect evidence before changing code.

Bad:

Bug
→ Random code changes
→ More code changes
→ Maybe find issue

Good:

Bug
→ Reproduce
→ Isolate
→ Diagnose
→ Confirm root cause
→ Fix

---

## Principle 2

Every bug must have a proven root cause.

A bug is not fixed until:

- Root cause identified
- Root cause documented
- Fix verified

---

## Principle 3

Diagnostics before architecture changes.

Before changing:

- Database schema
- Retrieval logic
- Embedding pipeline
- Queue workers
- Search logic

Create diagnostics first.

---

## Principle 4

Production paths matter more than SQL editor results.

Always verify:

- Browser
- API Route
- Authenticated User
- RLS Context

Never assume SQL editor results reflect production behavior.

---

# Standard Debugging Protocol

When a bug is discovered:

## Step 1

Reproduce consistently.

Document:

- exact query
- exact save
- exact user

---

## Step 2

Identify failing layer.

Possible layers:

UI

↓

API

↓

Application Logic

↓

Database

↓

External Service

---

## Step 3

Create diagnostic instrumentation.

Examples:

Diagnostic API Route

Diagnostic SQL Function

Temporary Logging

Temporary Admin Query

---

## Step 4

Gather evidence.

Do not modify architecture.

Do not refactor.

Do not optimize.

Collect facts only.

---

## Step 5

Prove root cause.

Questions:

What failed?

Why failed?

Can we reproduce it?

Can we explain every symptom?

If not:

Continue investigating.

---

## Step 6

Implement minimal fix.

Fix only the proven issue.

Avoid unrelated changes.

---

## Step 7

Remove diagnostics.

Delete:

Temporary routes

Temporary SQL functions

Temporary logs

Temporary test files

---

## Step 8

Create postmortem.

Document:

Issue

Root Cause

Fix

Lessons

---

# Migration Protocol

Before creating a migration:

Verify:

1. Current production schema
2. Existing migrations
3. Migration ordering
4. RLS impact

---

## Migration Checklist

Must answer:

What changes?

Why?

Rollback path?

RLS impact?

Type generation required?

Backfill required?

---

## After Every Migration

Run:

supabase db push

Then:

Generate types

Then:

Run TypeScript check

Then:

Verify feature in application

---

# Database Verification Protocol

Never trust:

SQL Editor only

Always verify:

SQL Editor

↓

RPC

↓

API Route

↓

Frontend

All four layers must succeed.

---

# Retrieval Verification Protocol

Every retrieval change must pass:

Keyword Search

Semantic Search

Hybrid Search

No Result Query

Cross User Isolation

RLS Verification

---

# Embedding System Protocol

Every embedding feature must verify:

Embedding created

Embedding stored

Embedding retrieved

Embedding matched

Embedding returned to user

---

## Embedding Checklist

Memory Count

Embedding Count

Queue Count

Failed Count

Missing Count

---

# Backfill Protocol

Before running backfill:

Measure:

Total Saves

Total Embeddings

Missing Embeddings

Expected Runtime

---

Backfill must:

Be resumable

Be idempotent

Support batching

Log failures

Skip completed records

---

# AI Agent Workflow

## ChatGPT

Used for:

Architecture

Planning

Debugging

PRD

TRD

System Design

---

## Codex

Used for:

Implementation

Refactors

Code Generation

---

## Antigravity CLI

Used for:

Repository Analysis

Alternative Agent Execution

Cross Validation

Second Opinion Reviews

---

## Continue

Used for:

IDE Assistance

Small Refactors

Code Navigation

---

## Local Qwen

Used for:

Offline Work

Emergency Fallback

Simple Coding Tasks

---

# Postmortem Template

Date:

Issue:

Symptoms:

Root Cause:

Evidence:

Fix:

Verification:

Lessons Learned:

Preventive Action:

---

# Known Lessons

## Semantic Retrieval V2

Issue:

Semantic retrieval returned zero results.

Symptoms:

Embeddings existed.

SQL editor returned matches.

Application returned empty results.

Root Cause:

RPC executed under authenticated user context.

RLS visibility differed from SQL editor execution.

Fix:

Security Definer RPC.

Auth scoped internally using auth.uid().

Lesson:

Always verify authenticated execution path before modifying retrieval architecture.

---

# Definition Of Done

A feature is complete only if:

Code complete

Types generated

Typecheck passes

Feature tested

RLS verified

Diagnostics removed

Documentation updated

Postmortem written if applicable

No known blockers remain