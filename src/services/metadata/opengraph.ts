import * as cheerio from "cheerio";

export async function extractOpenGraphMetadata(
  url: string
) {
  console.log(
    "🔍 OPEN GRAPH EXTRACTOR CALLED:",
    url
  );

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 StashlyBot",
      },
    });

    const html = await response.text();

    console.log(
     "Response status:",
     response.status
    );

    console.log(
     "HTML length:",
     html.length
    );

    console.log(
     "First 500 chars:",
     html.slice(0, 500)
    );

    const $ = cheerio.load(html);

    console.log(
     "OG title:",
     $('meta[property="og:title"]').attr("content")
    );

    console.log(
     "Page title:",
     $("title").text()
    );

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