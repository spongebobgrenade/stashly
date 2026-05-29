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
    case "youtube":
      return extractYoutubeMetadata(
        resolved.normalizedUrl
      );

    case "github":
    case "website":
      return extractOpenGraphMetadata(
        resolved.normalizedUrl
      );

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
      };
  }
}