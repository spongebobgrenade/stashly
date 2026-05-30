export interface MetadataEnrichment {
  title: string | null;

  description: string | null;

  thumbnailUrl: string | null;

  creatorName: string | null;

  canonicalUrl: string | null;

  rawMetadata: Record<string, unknown> | null;
}
