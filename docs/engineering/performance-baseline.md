# Stashly Performance Baseline

## Date

2026-05-29

---

## Async Ingestion Pipeline Benchmark

### Test Environment

- Local development
- Next.js 16
- Supabase
- BullMQ
- Redis
- YouTube extractor: youtubei.js

---

## Test Result

### Worker Metrics

Metadata extraction: 2760 ms

Database update: 324 ms

Total worker time: 3103 ms

---

## Observations

### Working

- Optimistic save appears instantly
- Realtime updates working
- Metadata enrichment updates automatically
- No page refresh required
- Queue architecture functioning correctly

### Bottleneck

Current bottleneck is YouTube metadata extraction.

Approximate breakdown:

- YouTube extraction: ~89%
- Database update: ~10%
- Other overhead: ~1%

---

## Baseline UX

Current user experience:

0 ms
→ Placeholder card appears

~3.1 sec
→ Full metadata enrichment appears

---

## Optimization Priority

Current recommendation:

Do NOT optimize extraction yet.

Higher leverage work:

1. OpenGraph extractor
2. Platform detector
3. Progressive enrichment
4. Multi-platform ingestion

---

## Milestone

Async distributed enrichment architecture completed.

Status: COMPLETE