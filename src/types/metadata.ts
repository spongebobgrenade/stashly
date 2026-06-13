export interface MetadataEnrichment {
  title: string | null;

  description: string | null;

  thumbnailUrl: string | null;

  creatorName: string | null;

  canonicalUrl: string | null;

  transcript: string | null;

  articleText: string | null;

  documentText: string | null;

  ocrText: string | null;

  imageDescriptions: string[];

  rawMetadata: Record<
    string,
    unknown
  > | null;
}