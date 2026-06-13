import type { MetadataEnrichment } from "@/types/metadata";

import type {
  Platform,
  ResolvedContent,
} from "./content-types";

import { extractOpenGraphMetadata } from "./opengraph";
import { extractYoutubeMetadata } from "./youtube";

export type MetadataExtractor = (
  resolved: ResolvedContent
) => Promise<MetadataEnrichment>;

const fallbackExtractor: MetadataExtractor =
  async (
    resolved
  ) => ({
    title: null,
    description: null,
    thumbnailUrl: null,
    creatorName: null,
    canonicalUrl:
      resolved.normalizedUrl,

    transcript: null,
    articleText: null,
    documentText: null,
    ocrText: null,
    imageDescriptions: [],

    rawMetadata: null,
  });

const openGraphExtractor: MetadataExtractor =
  async (
    resolved
  ) =>
    extractOpenGraphMetadata(
      resolved.normalizedUrl
    );

const youtubeExtractor: MetadataExtractor =
  async (
    resolved
  ) =>
    extractYoutubeMetadata(
      resolved.normalizedUrl
    );

const extractorRegistry: Record<
  Platform,
  MetadataExtractor
> = {
  youtube:
    youtubeExtractor,

  github:
    openGraphExtractor,

  website:
    openGraphExtractor,

  unknown:
    fallbackExtractor,
};

export function getExtractor(
  platform: Platform
) {
  return (
    extractorRegistry[
      platform
    ] ??
    fallbackExtractor
  );
}