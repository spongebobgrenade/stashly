# Code Debt

## Pending Cleanup

### Type Safety

- memory-feed.tsx uses any
- memory-realtime.ts uses any
- queues.ts uses any
- worker.ts uses any

### React Warnings

- memory-feed.tsx missing effect dependencies

### UI Warnings

- memory-card.tsx uses img instead of next/image

### Worker Cleanup

- worker.ts contains unused memoryWorker variable

Status: Deferred

Reason:
Architecture stabilization takes priority over local code cleanup.

These items do not create schema, lifecycle, or product architecture drift.