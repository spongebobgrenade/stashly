import * as cheerio from "cheerio";

export async function extractOpenGraphMetadata(
  url: string
) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 StashlyBot",
      },
    });

    const html =
      await response.text();

    const $ =
      cheerio.load(html);

    const title =
      $('meta[property="og:title"]').attr(
        "content"
      ) ||
      $("title").text() ||
      null;

    const description =
      $(
        'meta[property="og:description"]'
      ).attr("content") ||
      $('meta[name="description"]').attr(
        "content"
      ) ||
      null;

    const thumbnailUrl =
      $('meta[property="og:image"]').attr(
        "content"
      ) || null;

    const canonicalUrl =
      $('link[rel="canonical"]').attr(
        "href"
      ) || url;

    const creatorName =
      $('meta[property="og:site_name"]').attr(
        "content"
      ) || null;

    return {
      title,
      description,
      thumbnailUrl,
      creatorName,
      canonicalUrl,
      rawMetadata: null,
      sourcePlatform: "website",
    };
  } catch (error) {
    console.error(
      "OpenGraph extraction failed:",
      error
    );

    return {
      title: null,
      description: null,
      thumbnailUrl: null,
      creatorName: null,
      canonicalUrl: url,
      rawMetadata: null,
      sourcePlatform: "website",
    };
  }
}