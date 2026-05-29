import { Innertube } from "youtubei.js";

export async function extractYoutubeMetadata(
  url: string
) {
  const youtube = await Innertube.create();

  const videoId = extractVideoId(url);

  const info = await youtube.getInfo(videoId);

  return {
    title:
      info.basic_info.title || null,

    thumbnailUrl:
      info.basic_info.thumbnail?.[0]?.url ||
      null,

    description:
      info.basic_info.short_description ||
      null,

    creatorName:
      info.basic_info.author || null,

    canonicalUrl: `https://youtube.com/watch?v=${videoId}`,

    rawMetadata: info.basic_info,

    sourcePlatform: "youtube",
  };
}

function extractVideoId(url: string) {
  try {
    const parsedUrl = new URL(url);

    if (
      parsedUrl.hostname.includes("youtu.be")
    ) {
      return parsedUrl.pathname.replace(
        "/",
        ""
      );
    }

    return (
      parsedUrl.searchParams.get("v") || ""
    );
  } catch {
    return "";
  }
}