export interface ExtractedMetadata {
  title: string | null;

  description: string | null;

  thumbnailUrl: string | null;

  creatorName: string | null;

  canonicalUrl: string | null;

  rawMetadata: Record<string, unknown> | null;

  sourcePlatform: string;

  contentType: string;
}