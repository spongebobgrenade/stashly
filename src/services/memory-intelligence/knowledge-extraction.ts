import { z } from "zod";

import type {
  MemoryKnowledgeV1,
  MemoryMetadataV1,
  MemoryTranscriptV1,
} from "@/lib/memory-v1/types";

import {
  generateWithOllama,
} from "./ollama";

const KNOWLEDGE_SCHEMA = z.object({
  topics: z.array(z.string()),
  entities: z.array(z.string()),
  keyInsights: z.array(z.string()),
});

const EMPTY_KNOWLEDGE: MemoryKnowledgeV1 =
  {
    topics: [],
    entities: [],
    keyInsights: [],
  };

export async function extractMemoryKnowledge(
  input: {
    metadata: MemoryMetadataV1;
    transcript: MemoryTranscriptV1;
  }
): Promise<MemoryKnowledgeV1> {
  const prompt =
    buildKnowledgePrompt(input);

  if (!prompt) {
    return EMPTY_KNOWLEDGE;
  }

  try {
    const rawOutput =
      await generateWithOllama(
        prompt,
        {
          format: "json",
          numPredict: 350,
          temperature: 0.1,
        }
      );

    const parsed =
      KNOWLEDGE_SCHEMA.safeParse(
        JSON.parse(rawOutput)
      );

    if (!parsed.success) {
      return EMPTY_KNOWLEDGE;
    }

    return {
      topics: normalizeList(
        parsed.data.topics,
        8,
        48
      ),
      entities: normalizeList(
        parsed.data.entities,
        10,
        64
      ),
      keyInsights: normalizeList(
        parsed.data.keyInsights,
        5,
        220
      ),
    };
  } catch (error) {
    console.error(
      "Knowledge extraction failed:",
      error
    );

    return EMPTY_KNOWLEDGE;
  }
}

function buildKnowledgePrompt(input: {
  metadata: MemoryMetadataV1;
  transcript: MemoryTranscriptV1;
}): string {
  const transcriptSample =
    input.transcript.chunks
      .slice(0, 6)
      .join("\n\n")
      .slice(0, 5000)
      .trim();

  const metadataLines = [
    `Title: ${input.metadata.title ?? ""}`,
    `Creator: ${input.metadata.creatorName ?? ""}`,
    `Source Platform: ${input.metadata.sourcePlatform ?? ""}`,
    `Content Type: ${input.metadata.contentType ?? ""}`,
  ]
    .filter((line) => !line.endsWith(": "))
    .join("\n");

  if (
    !metadataLines &&
    !transcriptSample
  ) {
    return "";
  }

  return [
    "You are extracting retrieval-oriented knowledge from a saved memory.",
    "Use only the provided metadata and transcript content.",
    "Return strict JSON with this exact shape:",
    '{"topics":[""],"entities":[""],"keyInsights":[""]}',
    "Rules:",
    "- topics: short high-level subjects",
    "- entities: notable people, companies, products, concepts, or named items",
    "- keyInsights: concrete takeaways grounded in the content",
    "- no markdown",
    "- no explanation outside JSON",
    "- if information is missing, return empty arrays",
    "",
    "Metadata:",
    metadataLines || "None",
    "",
    "Transcript:",
    transcriptSample || "None",
  ].join("\n");
}

function normalizeList(
  values: string[],
  limit: number,
  maxLength: number
): string[] {
  const seen = new Set<string>();

  const normalized: string[] = [];

  for (const value of values) {
    const cleaned = value
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, maxLength);

    const key =
      cleaned.toLowerCase();

    if (
      !cleaned ||
      seen.has(key)
    ) {
      continue;
    }

    seen.add(key);
    normalized.push(cleaned);

    if (
      normalized.length >=
      limit
    ) {
      break;
    }
  }

  return normalized;
}
