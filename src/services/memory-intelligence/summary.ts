import { z } from "zod";

import type {
  MemoryKnowledgeV1,
  MemoryMetadataV1,
  MemoryTranscriptV1,
} from "@/lib/memory-v1/types";

import {
  generateWithOllama,
} from "./ollama";

const SUMMARY_SCHEMA = z.object({
  summary: z.string(),
});

const SUMMARY_LIMIT = 320;

export async function generateMemorySummary(
  input: {
    metadata: MemoryMetadataV1;
    transcript: MemoryTranscriptV1;
    knowledge: MemoryKnowledgeV1;
  }
): Promise<string> {
  const prompt =
    buildSummaryPrompt(input);

  if (!prompt) {
    return "";
  }

  try {
    const rawOutput =
      await generateWithOllama(
        prompt,
        {
          format: "json",
          numPredict: 220,
          temperature: 0.1,
        }
      );

    const parsed =
      SUMMARY_SCHEMA.safeParse(
        JSON.parse(rawOutput)
      );

    if (!parsed.success) {
      return "";
    }

    return normalizeSummary(
      parsed.data.summary
    );
  } catch (error) {
    console.error(
      "Summary generation failed:",
      error
    );

    return "";
  }
}

function buildSummaryPrompt(input: {
  metadata: MemoryMetadataV1;
  transcript: MemoryTranscriptV1;
  knowledge: MemoryKnowledgeV1;
}): string {
  const transcriptSample =
    input.transcript.chunks
      .slice(0, 6)
      .join("\n\n")
      .slice(0, 4500)
      .trim();

  const metadataLines = [
    `Title: ${input.metadata.title ?? ""}`,
    `Creator: ${input.metadata.creatorName ?? ""}`,
    `Source Platform: ${input.metadata.sourcePlatform ?? ""}`,
    `Content Type: ${input.metadata.contentType ?? ""}`,
  ]
    .filter((line) => !line.endsWith(": "))
    .join("\n");

  const knowledgeLines = [
    `Topics: ${input.knowledge.topics.join(", ")}`,
    `Entities: ${input.knowledge.entities.join(", ")}`,
    `Key Insights: ${input.knowledge.keyInsights.join(" | ")}`,
  ]
    .filter(
      (line) =>
        !line.endsWith(": ") &&
        !line.endsWith(":")
    )
    .join("\n");

  if (
    !metadataLines &&
    !transcriptSample &&
    !knowledgeLines
  ) {
    return "";
  }

  return [
    "You are writing a retrieval-friendly memory summary.",
    "Represent the memory as a whole using metadata, transcript content, and extracted knowledge.",
    "Return strict JSON with this exact shape:",
    '{"summary":""}',
    "Rules:",
    "- 1 to 3 sentences",
    "- maximum 320 characters",
    "- concise and factual",
    "- do not mention missing information",
    "- no markdown",
    "- no explanation outside JSON",
    "",
    "Metadata:",
    metadataLines || "None",
    "",
    "Knowledge:",
    knowledgeLines || "None",
    "",
    "Transcript:",
    transcriptSample || "None",
  ].join("\n");
}

function normalizeSummary(
  value: string
): string {
  return value
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, SUMMARY_LIMIT);
}
