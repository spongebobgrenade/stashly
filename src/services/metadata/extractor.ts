import {
  ResolvedContent,
} from "./content-types";

import {
  extractYoutubeMetadata,
} from "./youtube";

import {
  extractOpenGraphMetadata,
} from "./opengraph";

export async function extractMetadata(
  resolved: ResolvedContent
) {
  switch (
    resolved.platform
  ) {
    case "youtube": {
      const metadata =
        await extractYoutubeMetadata(
          resolved.normalizedUrl
        );

      return {
        ...metadata,
        contentType:
          resolved.contentType,
      };
    }

    case "github":
    case "website": {
      const metadata =
        await extractOpenGraphMetadata(
          resolved.normalizedUrl
        );

      return {
        ...metadata,
        contentType:
          resolved.contentType,
      };
    }

    default:
      return {
        title: null,
        description: null,
        thumbnailUrl: null,
        creatorName: null,
        canonicalUrl:
          resolved.normalizedUrl,
        rawMetadata: null,
        sourcePlatform:
          "unknown",
        contentType:
          resolved.contentType,
      };
  }
}