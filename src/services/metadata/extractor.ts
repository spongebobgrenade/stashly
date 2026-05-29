import * as cheerio from "cheerio"
import { ExtractedMetadata } from "@/types/metadata"

export async function extractMetadata(
  url: string
): Promise<ExtractedMetadata> {

  try {

    const response = await fetch(url,{
      headers:{
        "User-Agent":
        "Mozilla/5.0 StashlyBot"
      }
    })

    const html=await response.text()

    const $=cheerio.load(html)

    const title =
      $('meta[property="og:title"]').attr("content")
      ||
      $("title").text()
      ||
      null

    const description =
      $('meta[property="og:description"]')
      .attr("content")
      ||
      $('meta[name="description"]')
      .attr("content")
      ||
      null

    const thumbnail_url =
      $('meta[property="og:image"]')
      .attr("content")
      ||
      null

    return {
      title,
      description,
      thumbnail_url
    }

  } catch {

    return {
      title:null,
      description:null,
      thumbnail_url:null
    }

  }
}