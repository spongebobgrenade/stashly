import type { MetadataEnrichment } from "@/types/metadata";

import {
  ResolvedContent,
} from "./content-types";

import {
  getExtractor,
} from "./extractor-registry";

export type ExtractedMetadata =
  MetadataEnrichment & {
    sourcePlatform:
      ResolvedContent["platform"];
    contentType:
      ResolvedContent["contentType"];
  };

export async function extractMetadata(
  resolved: ResolvedContent
): Promise<ExtractedMetadata> {
  const extractor =
    getExtractor(
      resolved.platform
    );

  const metadata =
    await extractor(resolved);

  return {
    ...metadata,

    sourcePlatform:
      resolved.platform,

    contentType:
      resolved.contentType,
  };
}
