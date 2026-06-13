import { Innertube } from "youtubei.js";

import type { MetadataEnrichment } from "@/types/metadata";

export async function extractYoutubeMetadata(
  url: string
): Promise<MetadataEnrichment> {
  const youtube =
    await Innertube.create();

  const videoId =
    extractVideoId(url);

  if (!videoId) {
    throw new Error(
      `Unable to extract YouTube video ID from URL: ${url}`
    );
  }

  const info =
    await youtube.getInfo(
      videoId
    );

  return {
    title:
      info.basic_info
        .title || null,

    thumbnailUrl:
      info.basic_info
        .thumbnail?.[0]
        ?.url || null,

    description:
      info.basic_info
        .short_description ||
      null,

    creatorName:
      info.basic_info
        .author || null,

    canonicalUrl: `https://youtube.com/watch?v=${videoId}`,

    transcript: null,

    articleText: null,

    documentText: null,

    ocrText: null,

    imageDescriptions: [],

    rawMetadata:
      info.basic_info as Record<
        string,
        unknown
      >,
  };
}

function extractVideoId(
  url: string
) {
  try {
    const parsedUrl =
      new URL(url);

    if (
      parsedUrl.hostname.includes(
        "youtu.be"
      )
    ) {
      return parsedUrl.pathname.replace(
        "/",
        ""
      );
    }

    const watchId =
      parsedUrl.searchParams.get(
        "v"
      );

    if (watchId) {
      return watchId;
    }

    if (
      parsedUrl.pathname.startsWith(
        "/shorts/"
      )
    ) {
      return parsedUrl.pathname
        .replace(
          "/shorts/",
          ""
        )
        .split("/")[0];
    }

    return "";
  } catch {
    return "";
  }
}