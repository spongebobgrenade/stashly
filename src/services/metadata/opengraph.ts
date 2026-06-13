import * as cheerio from "cheerio";

import type { MetadataEnrichment } from "@/types/metadata";

export async function extractOpenGraphMetadata(
  url: string
): Promise<MetadataEnrichment> {
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

    const articleText =
      extractArticleText($);

    return {
      title,
      description,
      thumbnailUrl,
      creatorName,
      canonicalUrl,

      transcript: null,

      articleText,

      documentText: null,

      ocrText: null,

      imageDescriptions: [],

      rawMetadata: {
        title,
        description,
        articleText,
      },
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

      transcript: null,

      articleText: null,

      documentText: null,

      ocrText: null,

      imageDescriptions: [],

      rawMetadata: null,
    };
  }
}

function extractArticleText(
  $: cheerio.CheerioAPI
): string | null {
  const selectors = [
    "article",
    "main",
    "[role='main']",
    ".post-content",
    ".entry-content",
    ".article-content",
    ".content",
  ];

  for (const selector of selectors) {
    const text = normalizeText(
      $(selector).text()
    );

    if (text.length > 500) {
      return text;
    }
  }

  const bodyText =
    normalizeText(
      $("body").text()
    );

  return bodyText.length > 500
    ? bodyText
    : null;
}

function normalizeText(
  value: string | null | undefined
): string {
  return (value ?? "")
    .replace(/\r/g, "")
    .replace(/\s+/g, " ")
    .trim();
}