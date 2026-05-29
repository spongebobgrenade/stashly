import {
  ResolvedContent,
} from "./content-types";

export function resolveInput(
  url: string
): ResolvedContent {
  try {
    const parsedUrl =
      new URL(url);

    const hostname =
      parsedUrl.hostname
        .replace("www.", "")
        .toLowerCase();

    // YouTube

    if (
      hostname.includes(
        "youtube.com"
      ) ||
      hostname.includes(
        "youtu.be"
      )
    ) {
      return resolveYoutube(
        parsedUrl
      );
    }

    // GitHub

    if (
      hostname.includes(
        "github.com"
      )
    ) {
      return {
        platform: "github",

        contentType:
          "repository",

        normalizedUrl:
          url,

        identifier:
          parsedUrl.pathname,
      };
    }

    // Default Website

    return {
      platform: "website",

      contentType:
        "website",

      normalizedUrl:
        url,

      identifier: null,
    };
  } catch {
    return {
      platform: "unknown",

      contentType:
        "unknown",

      normalizedUrl:
        url,

      identifier: null,
    };
  }
}

function resolveYoutube(
  parsedUrl: URL
): ResolvedContent {
  const hostname =
    parsedUrl.hostname;

  // youtu.be

  if (
    hostname.includes(
      "youtu.be"
    )
  ) {
    const videoId =
      parsedUrl.pathname.replace(
        "/",
        ""
      );

    return {
      platform: "youtube",

      contentType:
        "video",

      normalizedUrl: `https://youtube.com/watch?v=${videoId}`,

      identifier:
        videoId,
    };
  }

  // Shorts

  if (
    parsedUrl.pathname.startsWith(
      "/shorts/"
    )
  ) {
    const shortId =
      parsedUrl.pathname
        .replace(
          "/shorts/",
          ""
        )
        .split("/")[0];

    return {
      platform: "youtube",

      contentType:
        "short",

      normalizedUrl: `https://youtube.com/watch?v=${shortId}`,

      identifier:
        shortId,
    };
  }

  // Playlist

  const playlistId =
    parsedUrl.searchParams.get(
      "list"
    );

  if (
    parsedUrl.pathname ===
      "/playlist" &&
    playlistId
  ) {
    return {
      platform: "youtube",

      contentType:
        "playlist",

      normalizedUrl:
        parsedUrl.toString(),

      identifier:
        playlistId,
    };
  }

  // Standard Video

  const videoId =
    parsedUrl.searchParams.get(
      "v"
    );

  if (videoId) {
    return {
      platform: "youtube",

      contentType:
        "video",

      normalizedUrl: `https://youtube.com/watch?v=${videoId}`,

      identifier:
        videoId,
    };
  }

  return {
    platform: "youtube",

    contentType:
      "unknown",

    normalizedUrl:
      parsedUrl.toString(),

    identifier: null,
  };
}