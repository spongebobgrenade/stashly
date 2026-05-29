# Metadata Extractors

Each platform should have:

- dedicated extractor
- normalized response shape
- isolated parsing logic

Examples:
- youtube.ts
- twitter.ts
- instagram.ts
- github.ts
- spotify.ts

This prevents platform logic from leaking into workers.