# 1. Repository Structure

```text
src/
├── .DS_Store
├── app/
│   ├── .DS_Store
│   ├── api/
│   │   ├── memories/
│   │   │   ├── pending/
│   │   │   │   └── route.ts
│   │   │   └── save/
│   │   │       └── route.ts
│   │   └── search/
│   │       └── route.ts
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts
│   ├── dashboard/
│   │   ├── page.tsx
│   │   └── save-form.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── login/
│   │   └── page.tsx
│   └── page.tsx
├── components/
│   ├── memory-card.tsx
│   ├── memory-feed.tsx
│   └── search/
│       ├── search-bar.tsx
│       ├── search-empty.tsx
│       └── search-results.tsx
├── hooks/
│   └── use-search.ts
├── lib/
│   ├── .DS_Store
│   ├── memories/
│   │   ├── get-memories.ts
│   │   ├── reconciliation.ts
│   │   ├── search-memories.ts
│   │   └── store.ts
│   ├── realtime/
│   │   └── memory-realtime.ts
│   ├── redis/
│   │   ├── connection.ts
│   │   └── queues.ts
│   ├── supabase/
│   │   ├── admin.ts
│   │   ├── client.ts
│   │   ├── middleware.ts
│   │   └── server.ts
│   └── validators/
│       └── memory.ts
├── services/
│   ├── auth/
│   │   └── auth.service.ts
│   ├── metadata/
│   │   ├── README.md
│   │   ├── content-types.ts
│   │   ├── extractor.ts
│   │   ├── opengraph.ts
│   │   ├── platform-resolver.ts
│   │   └── youtube.ts
│   ├── queue/
│   └── save/
├── types/
│   ├── database.types.ts
│   ├── jobs.ts
│   ├── memory.ts
│   └── metadata.ts
└── workers/
    └── metadata-worker/
        ├── metadata-processor.ts
        └── worker.ts

docs/
├── engineering/
│   ├── architecture-decisions.md
│   ├── architecture.md
│   ├── code-debt.md
│   ├── engineering-debt.md
│   ├── known-limitation.md
│   ├── performance-baseline.md
│   ├── runtime-alignment.md
│   ├── schema-alignment.md
│   └── technologuy-roadmap.md
└── product/
    ├── Experience-Architecture.json
    ├── Experience-Architecture.md
    ├── Memory-Architecture.json
    ├── Memory-Architecture.md
    ├── Philosophy.json
    ├── Philosophy.md
    ├── PRD.json
    ├── PRD.md
    ├── Search-Architecture.md
    ├── TRD.json
    └── TRD.md

scripts/
└── redis/
    ├── test-connection.ts
    └── test-queue.ts
```

# 2. Feature Inventory

| Feature | Purpose | Files involved | Status |
|---|---|---|---|
| Landing page | Simple entry screen with CTA to auth | `src/app/page.tsx` | Complete |
| Google OAuth sign-in | Start Google login via Supabase OAuth | `src/app/login/page.tsx`, `src/services/auth/auth.service.ts` | Complete |
| OAuth callback | Exchange auth code for session and redirect to dashboard | `src/app/auth/callback/route.ts`, `src/lib/supabase/server.ts` | Complete |
| Dashboard memory feed | Server-render initial memories and mount save/feed UI | `src/app/dashboard/page.tsx`, `src/lib/memories/get-memories.ts`, `src/components/memory-feed.tsx` | Complete |
| URL save form | Accept URL input and POST to save API | `src/app/dashboard/save-form.tsx` | Complete |
| Save API | Validate URL, authenticate user, insert save row, enqueue worker job | `src/app/api/memories/save/route.ts`, `src/lib/validators/memory.ts`, `src/lib/redis/queues.ts` | Complete |
| Optimistic save UX | Insert temporary queued card before backend finishes | `src/app/dashboard/save-form.tsx`, `src/lib/memories/store.ts` | Complete |
| Supabase save persistence | Persist memory rows in `saves` | `src/app/api/memories/save/route.ts`, `src/lib/memories/get-memories.ts`, `src/types/database.types.ts` | Complete |
| Memory card rendering | Show title, description, thumbnail, status, source link | `src/components/memory-card.tsx` | Complete |
| Realtime memory updates | Subscribe to `saves` row changes and upsert into store | `src/lib/realtime/memory-realtime.ts`, `src/components/memory-feed.tsx`, `src/lib/memories/store.ts` | Partially Complete |
| Reconciliation layer | Intended safety net for missed realtime updates | `src/lib/memories/reconciliation.ts`, `src/components/memory-feed.tsx`, `/api/memories/pending` | Stub |
| BullMQ queueing | Queue async processing jobs in Redis | `src/lib/redis/queues.ts`, `src/app/api/memories/save/route.ts` | Complete |
| Metadata worker runtime | Consume queue jobs and update DB lifecycle/metadata fields | `src/workers/metadata-worker/worker.ts`, `src/workers/metadata-worker/metadata-processor.ts` | Complete |
| Platform resolver | Normalize URL into platform/content classification | `src/services/metadata/platform-resolver.ts`, `src/services/metadata/content-types.ts` | Partially Complete |
| YouTube metadata extraction | Extract metadata for video/short URLs using `youtubei.js` | `src/services/metadata/youtube.ts`, `src/services/metadata/extractor.ts` | Partially Complete |
| Generic OpenGraph extraction | Extract metadata from websites and GitHub URLs via HTML OG tags | `src/services/metadata/opengraph.ts`, `src/services/metadata/extractor.ts` | Partially Complete |
| Search API/backend | Query user memories by keyword across text fields | `src/app/api/search/route.ts`, `src/lib/memories/search-memories.ts` | Partially Complete |
| Search hook/UI components | Debounced search hook and presentational search components | `src/hooks/use-search.ts`, `src/components/search/*` | Stub |
| Pending memories endpoint | Return non-completed saves with service-role access | `src/app/api/memories/pending/route.ts`, `src/lib/supabase/admin.ts` | Complete |
| Redis smoke tests | Verify Redis connectivity and queue enqueueing | `scripts/redis/test-connection.ts`, `scripts/redis/test-queue.ts` | Complete |
| Auth utility helpers | Browser helpers for sign-out and current-user lookup | `src/services/auth/auth.service.ts` | Partially Complete |
| Session middleware helper | Refresh Supabase session in middleware-style wrapper | `src/lib/supabase/middleware.ts` | Stub |

# 3. API Inventory

| Route | Purpose | Request format | Response format | Dependencies |
|---|---|---|---|---|
| `/api/memories/save` `POST` | Save a URL as a memory and enqueue enrichment | JSON body: `{ "url": string }`; authenticated user required | `200`: `{ success: true, memory }`; `400/401/500`: `{ error }` | Supabase server client, `saves` table, `isValidUrl`, BullMQ `memory-processing` queue, Redis |
| `/api/memories/pending` `GET` | Fetch all saves whose `processing_status != completed` | No body | `200`: `Memory[]`; `500`: `{ error }` | Supabase service-role admin client, `saves` table |
| `/api/search` `GET` | Keyword search across current user’s memories | Query param: `q` | `200`: `{ memories: Memory[] }`; `500`: `{ error: "Search failed" }` | Supabase server client, `searchMemories`, `saves` table |
| `/auth/callback` `GET` | Exchange Supabase OAuth code for session and redirect | Query param: `code` | Redirect to `/dashboard` | Supabase server client auth |

# 4. Database Inventory

## Tables in generated types
- `saves`
- `save_processing_jobs`

## Runtime table usage

### `saves`
Columns in schema:
- `id`
- `user_id`
- `content_type`
- `original_input`
- `source_platform`
- `title`
- `description`
- `thumbnail_url`
- `processing_status`
- `created_at`
- `updated_at`
- `canonical_url`
- `creator_name`
- `raw_metadata`

Columns written by save API:
- `id`
- `user_id`
- `original_input`
- `content_type`
- `source_platform`
- `processing_status`

Columns written by worker:
- `processing_status`
- `source_platform`
- `content_type`
- `title`
- `description`
- `thumbnail_url`
- `creator_name`
- `canonical_url`
- `raw_metadata`

Columns read by app/search/UI:
- `*` in all read queries
- UI explicitly uses `processing_status`, `source_platform`, `thumbnail_url`, `title`, `description`, `creator_name`, `canonical_url`, `original_input`

Queries observed:
- `insert` by ID on save
- `select * where user_id = auth user order by created_at desc`
- `select * where user_id = auth user and OR-ilike(...) order by created_at desc limit 50`
- `select * where processing_status != completed order by created_at desc`
- `update ... where id = memoryId`

### `save_processing_jobs`
Columns in schema:
- `id`
- `save_id`
- `job_type`
- `status`
- `retries`
- `created_at`

Current runtime usage:
- Present in generated types and SQL schema
- No app, worker, or script code reads or writes this table

## Index assumptions from current queries
- `saves.id` primary-key lookup is assumed by worker updates
- `saves.user_id` is assumed for all user-scoped reads
- `saves.user_id + created_at` is implicitly favored by feed/search ordering patterns
- `saves.processing_status` is implicitly favored by pending-memory queries
- Search currently assumes plain `ILIKE` scans over `title`, `description`, `creator_name`, `source_platform`, `original_input`
- No repository-local SQL defines additional indexes beyond PK/FK defaults

## RLS assumptions
- User-scoped app reads assume RLS or equivalent policy isolation on `saves.user_id`
- Realtime subscription assumes authenticated row-level access filtered by `user_id`
- Save API still explicitly sets `user_id` from the authenticated session
- `/api/memories/pending` bypasses user RLS by using the service-role admin client
- No RLS policy definitions are present in the checked-in migrations; RLS is documented/assumed, not repository-defined

# 5. Queue System Inventory

## BullMQ queues
- `memory-processing` in `src/lib/redis/queues.ts`

## Redis connections
- `redisConnection` in `src/lib/redis/connection.ts`
- `queueConnection` in `src/lib/redis/queues.ts`
- `workerConnection` in `src/workers/metadata-worker/worker.ts`

Shared connection shape:
- `host = UPSTASH_REDIS_HOST`
- `port = Number(UPSTASH_REDIS_PORT)`
- `password = UPSTASH_REDIS_PASSWORD`
- `tls = {}`
- `maxRetriesPerRequest = null`

## Workers
- One BullMQ `Worker` bound to `memory-processing`
- Entry point: `npm run worker`
- Processor: `processMemoryJob(job.data)`

## Job payloads
Type:
- `{ memoryId: string, url: string, userId: string }`

Produced by:
- `/api/memories/save`

Consumed by worker:
- `memoryId`
- `url`

Currently unused in worker logic:
- `userId`

# 6. Metadata System Inventory

## Platform resolver
File:
- `src/services/metadata/platform-resolver.ts`

Resolver outputs:
- `platform`: `youtube | github | website | unknown`
- `contentType`: `video | short | playlist | repository | article | website | unknown`
- `normalizedUrl`
- `identifier`

## Extractors
- `extractYoutubeMetadata(url)` in `youtube.ts`
- `extractOpenGraphMetadata(url)` in `opengraph.ts`
- `extractMetadata(resolved)` dispatch layer in `extractor.ts`

## Supported platforms
- YouTube video URLs
- YouTube short URLs
- Generic website URLs via OpenGraph scraping
- GitHub URLs resolved as `github/repository`, but metadata still comes from the generic OpenGraph extractor

## Unsupported or incomplete platforms
- YouTube playlists are recognized by resolver but not extractable end-to-end by the YouTube extractor
- Instagram
- TikTok
- Twitter/X
- LinkedIn
- Notion
- Spotify
- Medium-specific extraction
- Product Hunt-specific extraction
- Headless-browser fallback for blocked pages
- Any non-URL capture types from the PRD: screenshots, images, notes, files, PDFs, voice notes

# 7. Realtime System Inventory

## Realtime subscriptions
- One channel: `"memories-feed"`
- Provider: Supabase Realtime
- Event source: `postgres_changes`
- Scope: `schema=public`, `table=saves`, `event=*`, `filter=user_id=eq.<session.user.id>`

## Event flow
1. Save API inserts queued row
2. Worker updates same row to `processing` and then `completed` or `failed`
3. Postgres row change triggers Supabase Realtime
4. `initializeMemoryRealtime()` receives payload
5. `payload.new` is cast to `Memory`
6. `useMemoryStore.getState().upsertMemory(updatedMemory)` runs
7. `MemoryFeed` re-renders from Zustand state

## Zustand integration
- Realtime layer does not own UI state
- It writes directly into the singleton Zustand store via `useMemoryStore.getState()`
- `MemoryFeed` reads `state.memories`
- Save form writes optimistic entries into the same store

# 8. Search System Inventory

## Search implementation
- Backend is keyword-only
- Query source: Supabase `or(...)` with `ILIKE` on:
  - `title`
  - `description`
  - `creator_name`
  - `source_platform`
  - `original_input`
- Ordered by `created_at desc`
- Limited to 50 rows

## Search hooks
- `useSearch(query)` debounces by 300ms
- Calls `/api/search`
- Returns `{ results, loading }`

## Search UI
- `SearchBar`
- `SearchResults`
- `SearchEmpty`

Current wiring state:
- Components exist
- No page imports or renders them

## Search API
- `/api/search?q=...`

## Status
- `Partial`

# 9. State Management Inventory

## Zustand stores
- One store: `useMemoryStore` in `src/lib/memories/store.ts`

## Store state
- `memories: OptimisticMemory[]`

## Store actions
- `initializeMemories(memories)`
- `addOptimisticMemory(url)`
- `upsertMemory(memory)`

## Data flow
1. Server fetches initial memories via `getMemories()`
2. `MemoryFeed` initializes store once
3. `SaveForm` inserts optimistic queued memory
4. Save API persists row and enqueues worker
5. Realtime subscription receives DB updates
6. `upsertMemory` removes matching optimistic item by normalized URL and merges real record

# 10. Type Inventory

| File | Exports | Current usage |
|---|---|---|
| `src/types/database.types.ts` | `Json`, `Database`, `Tables`, `TablesInsert`, `TablesUpdate`, `Enums`, `CompositeTypes` | `Tables` is used by `src/types/memory.ts`; the rest are generated and currently unused in app code |
| `src/types/memory.ts` | `Memory`, `MemoryProcessingStatus` | `Memory` is used across feed, card, store, realtime, search, and memory queries; `MemoryProcessingStatus` is declared but not imported elsewhere |
| `src/types/metadata.ts` | `ExtractedMetadata` | No current imports |
| `src/types/jobs.ts` | `ProcessMemoryJob` | Used by `src/workers/metadata-worker/worker.ts` and `metadata-processor.ts` |

# 11. Documentation Inventory

| Document | Purpose | Last architectural relevance | Match |
|---|---|---|---|
| `docs/engineering/architecture.md` | Current system architecture overview | High; describes core app/worker/realtime stack | Needs Update |
| `docs/engineering/architecture-decisions.md` | Decision log and formal ADRs | High; ADRs still align with current stack | Current |
| `docs/engineering/code-debt.md` | Small cleanup/debt register | Low-to-medium; multiple listed issues are already fixed in code | Outdated |
| `docs/engineering/engineering-debt.md` | Broader debt register | Medium; several debts still relevant, several are stale | Outdated |
| `docs/engineering/known-limitation.md` | Quick implementation limitations list | Medium; partly matches, partly mixes speculative/non-wired platform notes | Needs Update |
| `docs/engineering/performance-baseline.md` | Observed perf baseline and bottlenecks | Medium; useful historically, not verifiable from code alone | Needs Update |
| `docs/engineering/runtime-alignment.md` | Runtime governance rules vs Memory Architecture | High; still authoritative, but current code violates at least one documented mapping rule | Needs Update |
| `docs/engineering/schema-alignment.md` | Memory schema alignment reference | High; task list is partly stale and content-type alignment is still unresolved | Needs Update |
| `docs/engineering/technologuy-roadmap.md` | Forward-looking technical roadmap | Medium; mostly directional rather than implementation-descriptive | Current |

# 12. Technical Debt Inventory

## Inline markers
- No `TODO` markers found in `src/`, `scripts/`, or `supabase/`
- No `TECH_DEBT` markers found in `src/`, `scripts/`, or `supabase/`

## Documented debt registers
- `ED-001` Inline platform detection: documented, but implementation now has `platform-resolver.ts`; doc is stale
- `ED-002` YouTube-only metadata support: partially stale; extraction is no longer YouTube-only because generic OpenGraph exists
- `ED-003` Loose metadata typing: still relevant; `ExtractedMetadata` exists but is unused
- `ED-004` Raw metadata stored unbounded: still relevant
- `ED-005` Memory feed uses `any`: stale; feed now uses `Memory[]`
- `ED-006` Reconciliation polling: documented, but actual reconciliation implementation is only a stub
- `ED-007` Realtime singleton only in browser memory: still relevant
- `ED-008` Native `img` in memory card: stale; component uses `next/image`
- `ED-009` No retry strategy for metadata extraction: still relevant
- `ED-010` Worker logging uses console statements: still relevant
- `ED-011` No distributed worker support: current and explicitly deferred
- `ED-012` No queue monitoring dashboard: still relevant
- `ED-013` Metadata extraction latency accepted for MVP: current as documented decision

## Deferred architecture documented
- Memory type mapping layer in `runtime-alignment.md`
- Next.js image optimization work in `runtime-alignment.md`
- Distributed workers in `engineering-debt.md`
- Multiple ops/observability items in `technologuy-roadmap.md`
- Code cleanup items in `code-debt.md`

## Current repository-level debt signals outside registers
- `src/services/queue/` exists but is empty
- `src/services/save/` exists but is empty
- `src/lib/supabase/middleware.ts` exists but has no runtime entrypoint using it
- `src/lib/memories/reconciliation.ts` is a no-op stub
- `save_processing_jobs` exists in schema/types but has no runtime usage

# 13. Architecture Decisions Inventory

| ADR number | Decision | Current status |
|---|---|---|
| `ADR-001` | Memory type source of truth is generated Supabase types: `type Memory = Tables<"saves">` | Accepted and implemented |
| `ADR-002` | Metadata processing runs in a dedicated BullMQ worker outside Next.js | Accepted and implemented |
| `ADR-003` | Optimistic save architecture with placeholder card before enrichment completes | Accepted and implemented |
| `ADR-004` | Long-term provider-agnostic AI architecture with future gateway/router | Accepted, documented only; no AI gateway implementation yet |

Additional accepted decision log entry:
- `2026-05-29` “Canonical Memory Foundation Locked” is accepted and reflected in the current type/schema direction

# 14. Runtime Alignment Inventory

| Documented runtime rule | Implementation match |
|---|---|
| Memory Architecture is the authority above schema/types/runtime | Yes, by documentation and type layering |
| Canonical persisted Memory is the `saves` table with the listed columns | Yes |
| Generated DB types are the source for app memory typing | Yes |
| `Memory` must derive from `Tables<"saves">` | Yes |
| Lifecycle is `queued -> processing -> completed/failed` | Yes |
| Save layer owns creation/original input/user assignment/enqueue | Yes |
| Save layer starts new rows as `processing_status = queued` | Yes |
| Worker owns lifecycle transitions and metadata enrichment | Yes |
| Worker may write only canonical metadata fields plus lifecycle state | Yes |
| UI owns presentation only, not lifecycle semantics | Yes |
| No undeclared Memory fields should be written | Yes |
| Resolver content types must not be written directly into canonical Memory until a mapping layer exists | No; worker writes resolver/extractor `contentType` directly into `saves.content_type` |
| Thumbnail strategy is `next/image` with `unoptimized` | Yes |
| Local dev requires both `npm run dev` and `npm run worker` | Yes |

# 15. MVP Progress Assessment

Estimated MVP completion:
- `25%`

Features complete:
- Google authentication
- URL saving
- persistent `saves` storage
- optimistic save confirmation
- async queue + worker pipeline
- metadata enrichment for YouTube and generic websites
- realtime row-driven UI updates
- dashboard feed rendering

Features partially complete:
- keyword search backend
- search hook/UI components
- generic platform metadata coverage
- realtime reliability/reconciliation

Features missing versus PRD/TRD MVP scope:
- natural-language retrieval
- semantic/vector search
- retrieval-first homepage interaction
- integrated search UI
- rediscovery surfaces/engine
- screenshot/image/PDF/file/note/voice capture
- email auth
- stashes/sharing
- mobile share sheet/PWA platform work
- OCR, embeddings, relationships, AI retrieval/explanations

# 16. Next Recommended Engineering Step

1. Integrate the existing search stack into the primary app flow by wiring `SearchBar`, `useSearch`, and `/api/search` into the dashboard/homepage so retrieval becomes an actual end-to-end user feature rather than a backend-only partial.